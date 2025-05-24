
import { loadFonts } from './fonts';
import { initSentry } from './sentry';
import { setupTrackingErrorHandler, enableReactDevMode } from '../utils/errorHandling';

// Define global skip configurations
const disablePuppeteer = () => {
  try {
    // Set environment variables to prevent Puppeteer downloads
    if (typeof process !== 'undefined' && process.env) {
      process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
      process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
      process.env.SKIP_PUPPETEER_DOWNLOAD = 'true';
    }
    
    // Browser context
    if (typeof window !== 'undefined') {
      // Set global flags to prevent Puppeteer
      (window as any).PUPPETEER_SKIP_DOWNLOAD = true;
      (window as any).PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
      (window as any).__PUPPETEER_DISABLED__ = true;
      
      // Create a disabled Puppeteer shim
      const puppeteerShim = {
        launch: () => Promise.reject(new Error('Puppeteer is disabled')),
        connect: () => Promise.reject(new Error('Puppeteer is disabled')),
        executablePath: () => '/bin/false',
        defaultArgs: () => [],
        createBrowserFetcher: () => ({
          download: () => Promise.reject(new Error('Puppeteer is disabled')),
          localRevisions: () => Promise.resolve([]),
          revisionInfo: () => ({ local: false, url: '', revision: '', folderPath: '' })
        })
      };
      
      // Attempt to override any Puppeteer global
      Object.defineProperty(window, 'puppeteer', {
        value: puppeteerShim,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    // Silently handle any errors from our prevention attempts
  }
};

// Call the disabler immediately
disablePuppeteer();

export const initPlatform = () => {
  // Call it again in the init function
  disablePuppeteer();
  
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
