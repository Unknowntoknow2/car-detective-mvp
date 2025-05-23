
// Feature Flags
export const SHOW_ALL_COMPONENTS = process.env.NODE_ENV === 'development';
export const ENABLE_DEV_TOOLS = process.env.NODE_ENV === 'development';
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
export const DEBUG_MODE = process.env.NODE_ENV === 'development';

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;

// UI Constants
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_UPLOADS = 5;

// Vehicle Valuation
export const MIN_VEHICLE_YEAR = 1980;
export const MAX_VEHICLE_YEAR = new Date().getFullYear() + 1; // Next year's models

// Validation Constants
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;
export const US_PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const US_ZIP_REGEX = /^\d{5}(?:[-\s]\d{4})?$/;

// Local Storage Keys
export const STORAGE_KEY_PREFIX = 'car-detective-';
export const RECENT_SEARCHES_KEY = `${STORAGE_KEY_PREFIX}recent-searches`;
export const SAVED_VEHICLES_KEY = `${STORAGE_KEY_PREFIX}saved-vehicles`;
export const LAST_VALUATION_KEY = `${STORAGE_KEY_PREFIX}last-valuation`;

// Premium Features
export const PREMIUM_FEATURES = [
  'carfax_integration',
  'market_analysis',
  'price_forecast',
  'detailed_condition_assessment',
  'dealer_offers',
  'service_history'
];

// Page Limits
export const ITEMS_PER_PAGE = 10;
