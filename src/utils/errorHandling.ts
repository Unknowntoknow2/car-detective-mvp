
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
      'Chromium download failed'
    ];
    
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
