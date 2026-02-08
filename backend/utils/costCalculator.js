// Real-world Indian repair cost calculator
// Based on damage type, severity, and vehicle category

function calculateEstimatedCost(damageType, severity, carCategory) {
  // Real-world repair cost matrix (in Indian Rupees)
  const repairCosts = {
    'dent': {
      'Minor': { 'Economy': [1000, 3000], 'Medium': [2500, 5000], 'Premium': [4000, 8000], 'Luxury': [6000, 12000] },
      'Moderate': { 'Economy': [3000, 6000], 'Medium': [5000, 8000], 'Premium': [8000, 15000], 'Luxury': [12000, 22000] },
      'Severe': { 'Economy': [6000, 10000], 'Medium': [8000, 15000], 'Premium': [15000, 25000], 'Luxury': [22000, 40000] }
    },
    'scratch': {
      'Minor': { 'Economy': [500, 1500], 'Medium': [1000, 2500], 'Premium': [1500, 4000], 'Luxury': [2500, 6000] },
      'Moderate': { 'Economy': [1500, 3000], 'Medium': [2500, 5000], 'Premium': [4000, 7000], 'Luxury': [6000, 10000] },
      'Severe': { 'Economy': [3000, 5000], 'Medium': [5000, 8000], 'Premium': [7000, 12000], 'Luxury': [10000, 18000] }
    },
    'crack': {
      'Minor': { 'Economy': [2000, 4000], 'Medium': [3000, 6000], 'Premium': [5000, 10000], 'Luxury': [8000, 15000] },
      'Moderate': { 'Economy': [4000, 7000], 'Medium': [6000, 10000], 'Premium': [10000, 18000], 'Luxury': [15000, 28000] },
      'Severe': { 'Economy': [7000, 12000], 'Medium': [10000, 18000], 'Premium': [18000, 30000], 'Luxury': [28000, 45000] }
    },
    'glass shatter': {
      'Minor': { 'Economy': [3000, 6000], 'Medium': [5000, 10000], 'Premium': [8000, 15000], 'Luxury': [12000, 25000] },
      'Moderate': { 'Economy': [6000, 12000], 'Medium': [10000, 18000], 'Premium': [15000, 28000], 'Luxury': [25000, 40000] },
      'Severe': { 'Economy': [12000, 20000], 'Medium': [18000, 30000], 'Premium': [28000, 45000], 'Luxury': [40000, 65000] }
    },
    'lamp broken': {
      'Minor': { 'Economy': [1000, 3000], 'Medium': [2000, 5000], 'Premium': [4000, 8000], 'Luxury': [7000, 12000] },
      'Moderate': { 'Economy': [3000, 6000], 'Medium': [5000, 10000], 'Premium': [8000, 15000], 'Luxury': [12000, 25000] },
      'Severe': { 'Economy': [6000, 12000], 'Medium': [10000, 18000], 'Premium': [15000, 30000], 'Luxury': [25000, 40000] }
    },
    'tire flat': {
      'Minor': { // Simple puncture, slow leak, nail removal
        'Economy': [200, 500],
        'Medium': [300, 700],
        'Premium': [500, 1200],
        'Luxury': [800, 2000]
      },
      'Moderate': { // Multiple punctures, sidewall patch, valve issue
        'Economy': [500, 1500],
        'Medium': [800, 2500],
        'Premium': [1500, 4000],
        'Luxury': [3000, 8000]
      },
      'Severe': { // Tyre replacement required
        'Economy': [2500, 4500],
        'Medium': [4000, 7000],
        'Premium': [8000, 15000],
        'Luxury': [15000, 40000]
      }
    }
  };
  
  // Normalize damage type to lowercase for matching
  const normalizedDamageType = damageType.toLowerCase();
  
  // Get cost range for the specific damage type, severity, and category
  const damageCosts = repairCosts[normalizedDamageType];
  
  if (!damageCosts) {
    // Default fallback if damage type not found
    console.log(`Warning: Damage type "${damageType}" not found in cost matrix`);
    return '₹2,000 - ₹5,000';
  }
  
  const severityCosts = damageCosts[severity];
  if (!severityCosts) {
    // Default fallback if severity not found
    console.log(`Warning: Severity "${severity}" not found for damage type "${damageType}"`);
    return '₹2,000 - ₹5,000';
  }
  
  const categoryCosts = severityCosts[carCategory];
  if (!categoryCosts) {
    // Default fallback if category not found
    console.log(`Warning: Category "${carCategory}" not found. Using Medium as default.`);
    // Try Medium as fallback
    const fallbackCosts = severityCosts['Medium'];
    if (fallbackCosts) {
      const [minCost, maxCost] = fallbackCosts;
      return `₹${minCost.toLocaleString('en-IN')} - ₹${maxCost.toLocaleString('en-IN')}`;
    }
    return '₹2,000 - ₹5,000';
  }
  
  const [minCost, maxCost] = categoryCosts;
  
  // Format with Indian number system (commas)
  return `₹${minCost.toLocaleString('en-IN')} - ₹${maxCost.toLocaleString('en-IN')}`;
}

module.exports = { calculateEstimatedCost };
