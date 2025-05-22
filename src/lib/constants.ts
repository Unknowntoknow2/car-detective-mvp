
// Environment & debug settings
export const SHOW_ALL_COMPONENTS = true;
export const DEBUG_MODE = false; // Added for guard components

// Feature flag defaults
export const DEFAULT_FEATURES = {
  premiumTools: true,
  vinLookup: true,
  aiAssistant: true,
  pdfPreview: true,
  marketAnalysis: true,
  photoUpload: true,
  dealerOffers: true,
  drivingBehavior: true,
};

// Application defaults
export const DEFAULT_APP_SETTINGS = {
  theme: 'light',
  notifications: true,
  analyticsEnabled: true,
};

// API endpoints and config
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 30000,
};
