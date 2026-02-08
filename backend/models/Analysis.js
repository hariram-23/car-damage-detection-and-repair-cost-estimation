const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  vehicleDetails: {
    carCategory: String,
    // Keep old fields for backward compatibility
    carType: String,
    brand: String,
    model: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  damageDetection: {
    damageType: String,
    severity: String,
    confidence: Number,
    affectedArea: Number,
    boundingBox: {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      // Keep old format for backward compatibility
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  },
  detections: [{
    damageType: String,
    confidence: Number,
    boundingBox: {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number
    },
    area: Number
  }],
  totalDetections: Number,
  estimatedCost: {
    type: String,  // Changed to String to support range format like "$500 - $750"
    required: true
  },
  modelVersion: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
