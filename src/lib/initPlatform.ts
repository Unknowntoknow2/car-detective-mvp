
import { loadFonts } from './fonts';
import { initSentry } from './sentry';
import { setupTrackingErrorHandler, enableReactDevMode } from '../utils/errorHandling';

// Define global skip configurations
const disablePuppeteerCompletely = () => {
  try {
    // Set environment variables to prevent Puppeteer downloads
    if (typeof process !== 'undefined' && process.env) {
      // Set all possible environment variables
      const preventionVars = [
        'PUPPETEER_SKIP_DOWNLOAD',
        'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD',
        'SKIP_PUPPETEER_DOWNLOAD',
        'PUPPETEER_SKIP_CHROME_DOWNLOAD',
        'PUPPETEER_NO_DOWNLOAD',
        'PUPPETEER_EXECUTABLE_PATH',
        'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD',
        'PLAYWRIGHT_BROWSERS_PATH'
      ];
      
      preventionVars.forEach(varName => {
        process.env[varName] = varName.includes('PATH') ? '/bin/false' : 'true';
      });
    }
    
    // Browser context
    if (typeof window !== 'undefined') {
      // Set global flags to prevent Puppeteer
      const preventionProps = [
        'PUPPETEER_SKIP_DOWNLOAD',
        'PUPPETEER_SKIP_CHROMIUM_DOWNLOAD',
        '__PUPPETEER_DISABLED__',
        'PUPPETEER_NO_DOWNLOAD',
        'SKIP_CHROMIUM_DOWNLOAD',
        'SKIP_BROWSER_DOWNLOAD'
      ];
      
      preventionProps.forEach(prop => {
        Object.defineProperty(window, prop, {
          value: true,
          writable: false,
          configurable: false
        });
      });
      
      // Create a fully disabled Puppeteer shim
      const puppeteerShim = {
        launch: () => Promise.reject(new Error('Puppeteer is disabled')),
        connect: () => Promise.reject(new Error('Puppeteer is disabled')),
        executablePath: () => '/bin/false',
        defaultArgs: () => [],
        createBrowserFetcher: () => ({
          download: () => Promise.reject(new Error('Puppeteer is disabled')),
          localRevisions: () => Promise.resolve([]),
          revisionInfo: () => ({ local: false, url: '', revision: '', folderPath: '' })
        }),
        // Add getters that reject any attempt to use Puppeteer
        get browser() {
          throw new Error('Puppeteer is disabled');
        },
        get page() {
          throw new Error('Puppeteer is disabled');
        }
      };
      
      // Attempt to override any Puppeteer global with both methods
      try {
        // Fix: Use type assertion to avoid TypeScript error
        (window as any).puppeteer = puppeteerShim;
      } catch (e) {}
      
      try {
        Object.defineProperty(window, 'puppeteer', {
          value: puppeteerShim,
          writable: false,
          configurable: false
        });
      } catch (e) {}
      
      // Also trap global require attempts if in a Node.js context
      if (typeof global !== 'undefined') {
        // Fix: Use proper type for require function
        const originalRequire = (global as any).require;
        if (originalRequire) {
          (global as any).require = function(name: string) {
            if (name.includes('puppeteer') || name.includes('chromium')) {
              return puppeteerShim;
            }
            return originalRequire(name);
          };
        }
      }
    }
  } catch (e) {
    // Silently handle any errors from our prevention attempts
  }
};

// Call the disabler immediately
disablePuppeteerCompletely();

export const initPlatform = () => {
  // Call it again in the init function
  disablePuppeteerCompletely();
  
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
