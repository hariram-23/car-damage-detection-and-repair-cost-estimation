const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { calculateEstimatedCost, calculateMultipleDamageCosts } = require('../utils/costCalculator');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload the image properly. Only image files are allowed.'));
    }
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Please upload the image properly. Image size should be less than 10MB.' });
    }
    return res.status(400).json({ error: 'Please upload the image properly' });
  } else if (err) {
    return res.status(400).json({ error: err.message || 'Please upload the image properly' });
  }
  next();
};

// Function to run Python ML prediction
function runPrediction(imagePath) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'ml_service', 'predict.py');
    const python = spawn('python', [pythonScript, imagePath]);
    
    let dataString = '';
    let errorString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorString}`));
        return;
      }
      
      try {
        const result = JSON.parse(dataString);
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Prediction failed'));
        }
      } catch (e) {
        reject(new Error(`Failed to parse prediction result: ${e.message}`));
      }
    });
  });
}

// Analyze Damage
router.post('/analyze', authMiddleware, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload the image properly' });
    }

    const { carCategory } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);

    console.log('\n' + '='.repeat(80));
    console.log('🚀 NEW ANALYSIS REQUEST');
    console.log('='.repeat(80));
    console.log(`📁 Image: ${req.file.filename}`);
    console.log(`📏 Size: ${(req.file.size / 1024).toFixed(2)} KB`);
    console.log(`🚗 Car Category: ${carCategory || 'Medium'}`);
    console.log(`👤 User ID: ${req.userId}`);
    console.log('-'.repeat(80));

    // Run ML prediction
    let damageResult;
    try {
      console.log('⚙️  Calling ML prediction service...');
      damageResult = await runPrediction(imagePath);
      
      console.log('\n📊 ML PREDICTION RESULTS:');
      console.log('-'.repeat(80));
      console.log(`✅ Success: ${damageResult.success}`);
      if (damageResult.success) {
        console.log(`🎯 Primary Damage: ${damageResult.damageType}`);
        console.log(`⚠️  Severity: ${damageResult.severity}`);
        console.log(`📈 Confidence: ${damageResult.confidence}%`);
        console.log(`📏 Affected Area: ${damageResult.affectedArea} px²`);
        console.log(`🔢 Total Detections: ${damageResult.totalDetections}`);
        console.log(`🤖 Model Source: ${damageResult.modelSource}`);
        
        if (damageResult.detections && damageResult.detections.length > 0) {
          console.log('\n🏷️  All Detections:');
          damageResult.detections.forEach((det, idx) => {
            console.log(`   ${idx + 1}. ${det.damageType} - ${det.confidence}% (Area: ${det.area} px²)`);
          });
        }
      } else {
        console.log(`❌ Error: ${damageResult.error}`);
      }
      console.log('-'.repeat(80));
      
    } catch (mlError) {
      console.error('\n❌ ML PREDICTION ERROR:');
      console.error('-'.repeat(80));
      console.error(mlError);
      console.error('='.repeat(80) + '\n');
      
      // Check if it's a vehicle detection error
      const errorMessage = mlError.message || '';
      if (errorMessage.includes('No vehicle detected') || errorMessage.includes('Please upload a car image')) {
        return res.status(400).json({ 
          error: 'Please upload a car image. No vehicle detected in the uploaded image.',
          details: 'The image must contain a vehicle (car, motorcycle, bus, or truck) for damage analysis.'
        });
      }
      
      return res.status(503).json({ 
        error: 'Please upload the image properly',
        details: 'Unable to process the image. Please ensure the image is clear and shows vehicle damage.'
      });
    }

    // Calculate estimated cost for all damages
    const costCalculation = calculateMultipleDamageCosts(
      damageResult.detections,
      carCategory || 'Medium'
    );

    console.log('\n💰 COST ESTIMATION:');
    console.log('-'.repeat(80));
    console.log(`💵 Total Estimated Cost: ${costCalculation.totalCostRange}`);
    console.log(`📊 Unique Damage Types: ${costCalculation.uniqueDamageTypes}`);
    console.log('\n📋 Cost Breakdown:');
    costCalculation.damageBreakdown.forEach((damage, idx) => {
      console.log(`   ${idx + 1}. ${damage.damageType} (${damage.count}x) - ${damage.severity}`);
      console.log(`      Cost: ${damage.costRange}`);
      console.log(`      Avg Confidence: ${damage.avgConfidence}%`);
    });
    console.log('-'.repeat(80));

    // Determine if analysis needs review based on confidence
    const needsReview = damageResult.confidence < 70;
    const status = needsReview ? 'pending' : 'pending';

    // Create analysis record
    const analysis = new Analysis({
      userId: req.userId,
      reportId: `REP-${new Date().getFullYear()}-${uuidv4().substring(0, 4).toUpperCase()}`,
      vehicleDetails: { carCategory: carCategory || 'Medium' },
      imageUrl,
      damageDetection: {
        damageType: damageResult.damageType,
        severity: damageResult.severity,
        confidence: damageResult.confidence,
        affectedArea: damageResult.affectedArea,
        boundingBox: damageResult.detections.length > 0 ? damageResult.detections[0].boundingBox : null
      },
      detections: damageResult.detections,
      totalDetections: damageResult.totalDetections,
      estimatedCost: costCalculation.totalCostRange,
      costBreakdown: costCalculation.damageBreakdown,
      status,
      needsReview
    });

    await analysis.save();

    console.log('\n💾 DATABASE:');
    console.log('-'.repeat(80));
    console.log(`✅ Analysis saved to database`);
    console.log(`📋 Report ID: ${analysis.reportId}`);
    console.log('='.repeat(80) + '\n');

    res.json({
      message: 'Analysis completed',
      analysis: {
        reportId: analysis.reportId,
        damageType: analysis.damageDetection.damageType,
        severity: analysis.damageDetection.severity,
        confidence: analysis.damageDetection.confidence,
        affectedArea: analysis.damageDetection.affectedArea,
        estimatedCost: analysis.estimatedCost,
        costBreakdown: analysis.costBreakdown,
        imageUrl: analysis.imageUrl,
        carCategory: analysis.vehicleDetails.carCategory,
        modelVersion: analysis.modelVersion,
        createdAt: analysis.createdAt,
        detections: damageResult.detections,
        totalDetections: damageResult.totalDetections
      }
    });
  } catch (error) {
    console.error('\n❌ ANALYSIS ERROR:');
    console.error('='.repeat(80));
    console.error(error);
    console.error('='.repeat(80) + '\n');
    res.status(500).json({ error: error.message });
  }
});

// Get Analysis by ID
router.get('/:reportId', authMiddleware, async (req, res) => {
  try {
    let reportId = decodeURIComponent(req.params.reportId);
    
    // Try with # prefix if not found
    let analysis = await Analysis.findOne({
      reportId: reportId,
      userId: req.userId
    });
    
    // If not found, try with # prefix
    if (!analysis) {
      analysis = await Analysis.findOne({
        reportId: `#${reportId}`,
        userId: req.userId
      });
    }

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF Report
router.get('/:reportId/pdf', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      reportId: req.params.reportId,
      userId: req.userId
    }).populate('userId', 'firstName lastName');

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${analysis.reportId}.pdf`);

    doc.pipe(res);

    // PDF Content
    doc.fontSize(20).text('AI DAMAGE ANALYSIS REPORT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Report ID: ${analysis.reportId}`);
    doc.text(`Date: ${analysis.createdAt.toLocaleDateString()}`);
    doc.text(`User: ${analysis.userId.firstName} ${analysis.userId.lastName}`);
    doc.moveDown();
    doc.fontSize(16).text('Vehicle Details');
    doc.fontSize(12).text(`Category: ${analysis.vehicleDetails.carCategory || 'N/A'}`);
    if (analysis.vehicleDetails.carType) {
      doc.text(`Type: ${analysis.vehicleDetails.carType}`);
    }
    if (analysis.vehicleDetails.brand) {
      doc.text(`Brand: ${analysis.vehicleDetails.brand}`);
    }
    if (analysis.vehicleDetails.model) {
      doc.text(`Model: ${analysis.vehicleDetails.model}`);
    }
    doc.moveDown();
    doc.fontSize(16).text('Damage Analysis');
    doc.fontSize(12).text(`Damage Type: ${analysis.damageDetection.damageType}`);
    doc.text(`Severity: ${analysis.damageDetection.severity}`);
    doc.text(`Confidence: ${analysis.damageDetection.confidence}%`);
    doc.text(`Affected Area: ${analysis.damageDetection.affectedArea} px²`);
    doc.moveDown();
    doc.fontSize(16).text(`Estimated Repair Cost: $${analysis.estimatedCost}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
