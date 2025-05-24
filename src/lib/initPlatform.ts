
import { loadFonts } from './fonts';
import { initSentry } from './sentry';
import { setupTrackingErrorHandler, enableReactDevMode } from '../utils/errorHandling';

export const initPlatform = () => {
  // Skip puppeteer download completely 
  if (typeof process !== 'undefined') {
    process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
    process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
  }

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
