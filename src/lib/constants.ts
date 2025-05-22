
// Feature flags and configuration
export const DEBUG_MODE = false;
export const ENABLE_PREMIUM_FEATURES = true;
export const ENABLE_DEALER_FEATURES = true;
export const ENABLE_AUCTION_HISTORY = true;
export const ENABLE_CARFAX_INTEGRATION = true;
export const ENABLE_AI_ASSISTANT = true;
export const ENABLE_PLATE_LOOKUP = true;
export const ENABLE_PHOTO_UPLOAD = true;
export const ENABLE_MARKET_TRENDS = true;
export const SHOW_ALL_COMPONENTS = false; // Added missing constant

// Service URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cardetective.com';
export const CARFAX_API_URL = import.meta.env.VITE_CARFAX_API_URL || 'https://api.carfaxonline.com';
export const VIN_DECODER_API_URL = import.meta.env.VITE_VIN_DECODER_API_URL || 'https://api.vindecoder.com';

// App constants
export const MAX_PHOTO_SIZE_MB = 10;
export const DEFAULT_VEHICLE_IMAGE = '/images/default-vehicle.png';
export const PDF_TEMPLATE_VERSION = '1.2.0';

// Theme and appearance
export const PRIMARY_COLOR = '#3B82F6';
export const SECONDARY_COLOR = '#10B981';
export const ERROR_COLOR = '#EF4444';
export const WARNING_COLOR = '#F59E0B';
export const SUCCESS_COLOR = '#10B981';

// User roles
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  DEALER: 'dealer',
  ADMIN: 'admin',
};

// Lookup methods
export const LOOKUP_METHODS = {
  VIN: 'vin',
  PLATE: 'plate',
  MANUAL: 'manual',
  PHOTO: 'photo',
};

// Vehicle condition options
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new with no visible defects' },
  { value: 'good', label: 'Good', description: 'Minor wear but well maintained' },
  { value: 'fair', label: 'Fair', description: 'Shows normal wear for age and mileage' },
  { value: 'poor', label: 'Poor', description: 'Significant wear or mechanical issues' },
];
