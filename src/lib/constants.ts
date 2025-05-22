
// Global constants for the application

// Set to true to reveal all UI components during development
export const DEBUG_MODE = true;

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';

// Show all components in development mode if DEBUG_MODE is true
export const SHOW_ALL_COMPONENTS = isDevelopment && DEBUG_MODE;
