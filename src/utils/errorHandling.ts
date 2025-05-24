
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
      'puppeteer',
      'ERR_INTERNET_DISCONNECTED',
      'Failed to fetch'
    ];
    
    // Only log errors that don't match our suppress patterns
    if (!suppressPatterns.some(pattern => errorMessage.includes(pattern))) {
      originalConsoleError(...args);
    }
  };
};

export const enableReactDevMode = () => {
  if (typeof window === 'undefined' || import.meta.env.MODE !== 'development') return;
  
  // Enable React Developer Tools in development mode
  try {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function(obj) {
      if (!obj.scheduleRefresh || !obj.setRefreshHandler) {
        // This is React 16+
        if (!obj.reconciler || !obj.scheduleRefresh) {
          // This is older React 16.x
          const oldInject = this.inject;
          oldInject.call(this, obj);
        } else {
          // This is React 17+
          for (const prop in obj) {
            this[prop] = obj[prop];
          }
        }
      }
    };
  } catch (e) {
    console.warn('Could not enable React dev tools integration:', e);
  }
};
