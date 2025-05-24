
import { loadFonts } from './fonts';
import { initSentry } from './sentry';
import { setupTrackingErrorHandler, enableReactDevMode } from '../utils/errorHandling';

// Set environment variables to skip Puppeteer downloads
if (typeof process !== 'undefined') {
  process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
  process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
  process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = '1';
}

// Define a global skip configuration for any remaining Puppeteer references
if (typeof window !== 'undefined') {
  (window as any).PUPPETEER_SKIP_DOWNLOAD = true;
  (window as any).PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
}

export const initPlatform = () => {
  // Load fonts from CDN
  loadFonts();
  
  // Initialize error tracking
  initSentry();
  
  // Set up error suppression for noisy third-party scripts
  if (typeof window !== 'undefined') {
    setupTrackingErrorHandler();
  }
  
  // Enable detailed React errors in development
  enableReactDevMode();
};
