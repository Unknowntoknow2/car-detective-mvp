
// This flag enables debug/development components to be shown
export const SHOW_ALL_COMPONENTS = process.env.NODE_ENV === 'development';

// API endpoints
export const API_ENDPOINTS = {
  VIN_DECODE: '/api/vin/decode',
  PLATE_LOOKUP: '/api/plate/lookup',
  VALUATION: '/api/valuation',
  PREMIUM: '/api/premium'
};

// Feature flags
export const FEATURES = {
  PREMIUM_ENABLED: true,
  VIN_VALIDATION_ENABLED: true,
  CARFAX_INTEGRATION: false
};

// Values for condition ratings
export const CONDITION_RATINGS = {
  EXCELLENT: { value: 'excellent', label: 'Excellent', multiplier: 1.1 },
  GOOD: { value: 'good', label: 'Good', multiplier: 1.0 },
  FAIR: { value: 'fair', label: 'Fair', multiplier: 0.9 },
  POOR: { value: 'poor', label: 'Poor', multiplier: 0.8 }
};
