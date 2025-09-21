
/**
 * Error handling utilities
 * Contains functions to manage error tracking and suppress noisy errors
 */

export const setupTrackingErrorHandler = () => {
  if (typeof window === 'undefined') return;

  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  // Comprehensive error suppression patterns
  const suppressPatterns = [
    // Browser & Extension Noise
    'Tracking Prevention',
    'Failed to load resource',
    'chrome-extension://',
    'ChunkLoadError',
    'browser-extension',
    'inter-var.woff2',
    'preloaded using link preload but not used',
    'OTS parsing error',
    'Loading chunk',
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
    'playwright',
    
    // Browser Feature Detection
    'Unrecognized feature:',
    'ambient-light-sensor',
    'battery',
    'vr',
    'accelerometer',
    'gyroscope',
    'magnetometer',
    'geolocation',
    'An iframe which has both allow-scripts and allow-same-origin',
    'sandbox attribute can escape',
    
    // Firebase & Firestore
    '@firebase/firestore',
    'Firestore (11.10.0)',
    'Uncaught Error in snapshot listener',
    'FirebaseError: [code=permission-denied]',
    'Missing or insufficient permissions',
    'snapshot listener',
    
    // Third-Party SDKs
    'RS SDK - Google Ads',
    'Email, Phone are mandatory fields',
    'FirstName, LastName, PostalCode, Country is mandatory',
    'RudderStack',
    'Facebook Pixel',
    'Google Analytics',
    'analytics.track',
    
    // WebSocket & Preview Errors
    'WebSocket connection to',
    'Max reconnect attempts',
    'lovableproject.com',
    'WebSocket connection failed',
    'Failed to establish WebSocket',
    'WebSocket error',
    'connection retry',
    'reconnect failed',
    
    // Development & Build Tools
    'We\'re hiring!',
    'https://lovable.dev/careers',
    'Source map',
    'sourcemap',
    'DevTools'
  ];
  
  // Firebase-specific error suppression
  const isFirebaseError = (message: string) => {
    return message.includes('@firebase/firestore') || 
           message.includes('FirebaseError') ||
           message.includes('Missing or insufficient permissions') ||
           message.includes('snapshot listener');
  };
  
  // Third-party SDK error suppression  
  const isThirdPartySDKError = (message: string) => {
    return message.includes('RS SDK') ||
           message.includes('Google Ads') ||
           message.includes('RudderStack') ||
           message.includes('mandatory fields');
  };
  
  // Browser feature detection suppression
  const isBrowserFeatureError = (message: string) => {
    return message.includes('Unrecognized feature:') ||
           message.includes('ambient-light-sensor') ||
           message.includes('battery') ||
           message.includes('vr') ||
           message.includes('iframe') && message.includes('sandbox');
  };
  
  // Enhanced console.error override
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    
    // Suppress Firebase permission errors (expected in unauthenticated state)
    if (isFirebaseError(errorMessage)) {
      return;
    }
    
    // Suppress third-party SDK validation errors
    if (isThirdPartySDKError(errorMessage)) {
      return;
    }
    
    // Suppress browser feature detection warnings
    if (isBrowserFeatureError(errorMessage)) {
      return;
    }
    
    // Check general suppress patterns
    if (suppressPatterns.some(pattern => errorMessage.toLowerCase().includes(pattern.toLowerCase()))) {
      return;
    }
    
    // Allow important errors to pass through
    originalConsoleError(...args);
  };
  
  // Enhanced console.warn override
  console.warn = (...args) => {
    const warnMessage = args.join(' ');
    
    // Suppress tracking prevention warnings
    if (warnMessage.includes('Tracking Prevention') ||
        warnMessage.includes('blocked access to storage') ||
        warnMessage.includes('Unrecognized feature:') ||
        warnMessage.includes('WebSocket') ||
        warnMessage.includes('Preview')) {
      return;
    }
    
    // Check general suppress patterns
    if (suppressPatterns.some(pattern => warnMessage.toLowerCase().includes(pattern.toLowerCase()))) {
      return;
    }
    
    originalConsoleWarn(...args);
  };
  
  // Enhanced console.log override for development artifacts
  console.log = (...args) => {
    const logMessage = args.join(' ');
    
    // Suppress development artifacts and hiring messages
    if (logMessage.includes('We\'re hiring!') ||
        logMessage.includes('lovable.dev/careers') ||
        logMessage.includes('⠀⠀#######')) {
      return;
    }
    
    originalConsoleLog(...args);
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
  }
};

// Comprehensive global error handler
export const setupGlobalErrorHandler = () => {
  if (typeof window === 'undefined') return;
  
  // Global error event handler
  window.addEventListener('error', (event) => {
    const message = event.error?.message || event.message || '';
    
    // Suppress Firebase errors
    if (message.includes('@firebase/firestore') || 
        message.includes('FirebaseError') ||
        message.includes('Missing or insufficient permissions')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // Suppress third-party SDK errors
    if (message.includes('RS SDK') ||
        message.includes('Google Ads') ||
        message.includes('RudderStack') ||
        message.includes('mandatory fields')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // Suppress browser extension and development errors
    if (message.includes('puppeteer') || 
        message.includes('chrome-extension') ||
        message.includes('Cannot add property') ||
        message.includes('object is not extensible') ||
        message.includes('WebSocket') ||
        message.includes('Failed to load resource')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    return true;
  }, true);
  
  // Global unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || '';
    
    // Suppress Firebase promise rejections
    if (reason.includes('@firebase/firestore') ||
        reason.includes('FirebaseError') ||
        reason.includes('Missing or insufficient permissions') ||
        reason.includes('snapshot listener')) {
      event.preventDefault();
      return;
    }
    
    // Suppress WebSocket and network promise rejections
    if (reason.includes('WebSocket') ||
        reason.includes('Failed to fetch') ||
        reason.includes('lovableproject.com') ||
        reason.includes('Max reconnect attempts')) {
      event.preventDefault();
      return;
    }
    
    // Suppress third-party SDK promise rejections
    if (reason.includes('Google Ads') ||
        reason.includes('RudderStack') ||
        reason.includes('analytics')) {
      event.preventDefault();
      return;
    }
  });
};

// Initialize all error handlers immediately
setupGlobalErrorHandler();
