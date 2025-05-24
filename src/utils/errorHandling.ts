
/**
 * Error handling utilities
 * Contains functions to manage error tracking and suppress noisy errors
 */

export const setupTrackingErrorHandler = () => {
  if (typeof window === 'undefined') return;

  const originalConsoleError = console.error;
  
  // Suppress noisy errors from tracking scripts and browser extensions
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    
    // List of error patterns to suppress
    const suppressPatterns = [
      'Tracking Prevention',
      'Failed to load resource',
      'chrome-extension://',
      'ChunkLoadError',
      'Facebook Pixel',
      'browser-extension',
      'inter-var.woff2',
      'preloaded using link preload but not used',
      'OTS parsing error',
      'Loading chunk',
      'Unrecognized feature',
      'ERR_INTERNET_DISCONNECTED',
      'Failed to fetch',
      'Puppeteer',
      'puppeteer',
      'chrome-headless',
      'Chrome download failed',
      'Chromium download failed',
      'chrome v',
      'browser folder',
      'headless-shell',
      'Cannot add property',
      'object is not extensible',
      'getConfiguration',
      'TypeError: Cannot add property',
      'Browser download failed',
      'Unable to download browser',
      'Cannot assign to read only property',
      'frozen object',
      'Cannot read properties of null',
      'logLevel',
      'playwright'
    ];
    
    // More aggressive puppeteer error suppression
    if (errorMessage.includes('puppeteer') || 
        errorMessage.includes('Puppeteer') || 
        errorMessage.includes('chromium') || 
        errorMessage.includes('chrome') ||
        errorMessage.includes('browser') ||
        errorMessage.includes('extensible') ||
        errorMessage.includes('Cannot add property')) {
      // Completely suppress puppeteer errors
      return;
    }
    
    // Only log errors that don't match our suppress patterns
    if (!suppressPatterns.some(pattern => errorMessage.includes(pattern))) {
      originalConsoleError(...args);
    }
  };
};

/**
 * Converts any error type to a readable string
 */
export const errorToString = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Unknown error object';
    }
  }
  return 'Unknown error';
};

export const enableReactDevMode = () => {
  if (typeof window === 'undefined' || import.meta.env.MODE !== 'development') return;
  
  // Enable React Developer Tools in development mode
  try {
    // Use type assertion to avoid TypeScript error
    const win = window as Window & {
      __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
        inject: (obj: Record<string, unknown>) => void;
      }
    };
    
    if (win.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const originalInject = win.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject;
      win.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function(obj: Record<string, unknown>) {
        if (!obj.scheduleRefresh || !obj.setRefreshHandler) {
          // This is React 16+
          if (!obj.reconciler || !obj.scheduleRefresh) {
            // This is older React 16.x
            originalInject.call(this, obj);
          } else {
            // This is React 17+
            for (const prop in obj) {
              // @ts-ignore - we know this is safe in this context
              this[prop] = obj[prop];
            }
          }
        }
      };
    }
  } catch (e) {
    console.warn('Could not enable React dev tools integration:', e);
  }
};

// Add a specialized handler just for puppeteer errors
export const setupPuppeteerErrorHandler = () => {
  // Intercept all errors related to puppeteer
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.error && 
          (event.error.message?.includes('puppeteer') || 
           event.error.message?.includes('chrome') ||
           event.error.message?.includes('Cannot add property') ||
           event.error.message?.includes('object is not extensible'))) {
        // Prevent the error from propagating
        event.preventDefault();
        event.stopPropagation();
        console.warn('Puppeteer-related error suppressed');
        return false;
      }
      return true;
    }, true);
  }
};

// Call the puppeteer error handler immediately
setupPuppeteerErrorHandler();
