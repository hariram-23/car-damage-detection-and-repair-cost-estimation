const express = require('express');
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper function to parse INR cost range and get average
function parseCostRange(costString) {
  if (!costString) return 0;
  
  // Remove ₹ symbol and commas, then extract numbers
  // Format: "₹1,000 - ₹3,000" or "1,000 - 3,000"
  const numbers = costString.replace(/₹|,/g, '').match(/[0-9]+/g);
  
  if (!numbers || numbers.length === 0) return 0;
  
  // If it's a range, calculate average of min and max
  if (numbers.length >= 2) {
    const min = parseInt(numbers[0]);
    const max = parseInt(numbers[1]);
    return Math.round((min + max) / 2);
  }
  
  // If it's a single number
  return parseInt(numbers[0]);
}

// Helper function to format number as INR
function formatINR(number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(number);
}

// Get Dashboard Stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId });

    const totalScans = analyses.length;
    
    // Calculate average repair cost from INR ranges
    const avgRepairCost = analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + parseCostRange(a.estimatedCost), 0) / analyses.length)
      : 0;
    
    const accuracyRate = analyses.length > 0
      ? (analyses.reduce((sum, a) => sum + a.damageDetection.confidence, 0) / analyses.length).toFixed(1)
      : 0;

    const pendingReviews = analyses.filter(a => {
      const daysSince = (Date.now() - a.createdAt) / (1000 * 60 * 60 * 24);
      return daysSince < 7;
    }).length;

    // Recent analyses
    const recentAnalyses = analyses
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50)
      .map(a => ({
        _id: a._id,
        reportId: a.reportId,
        vehicleName: `${a.vehicleDetails.brand || 'Unknown'} ${a.vehicleDetails.model || ''}`.trim(),
        vehicleCategory: a.vehicleDetails.carCategory,
        damageType: a.damageDetection.damageType,
        severity: a.damageDetection.severity,
        cost: a.estimatedCost,
        date: a.createdAt,
        imageUrl: a.imageUrl
      }));

    // Cost trends (last 7 days)
    const costTrends = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayAnalyses = analyses.filter(a => {
        const aDate = new Date(a.createdAt);
        return aDate.toDateString() === date.toDateString();
      });
      const avgCost = dayAnalyses.length > 0
        ? Math.round(dayAnalyses.reduce((sum, a) => sum + parseCostRange(a.estimatedCost), 0) / dayAnalyses.length)
        : 0;
      costTrends.push({
        day: days[date.getDay()],
        cost: avgCost
      });
    }

    res.json({
      stats: {
        totalScans,
        avgRepairCost,
        accuracyRate: parseFloat(accuracyRate),
        pendingReviews
      },
      recentAnalyses,
      costTrends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Analyses History
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ analyses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
