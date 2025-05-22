
// Debug mode flag for development environment
export const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Authentication-related constants
export const AUTH_ROUTES = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
};

// Application routes
export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DEALER_DASHBOARD: '/dealer-dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
};

// Valuation-related constants
export const VALUATION_TYPES = {
  BASIC: 'basic',
  PREMIUM: 'premium',
};

// Default values
export const DEFAULT_VALUATION_CONFIDENCE = 85;
export const DEFAULT_ZIP_CODE = '90210';

// Feature flags
export const SHOW_ALL_COMPONENTS = process.env.NODE_ENV === 'development';
