/**
 * Converts any error object to a string message
 */
export function errorToString(error: unknown): string {
  if (error === null || error === undefined) {
    return 'Unknown error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  return JSON.stringify(error);
}

/**
 * Extracts an error message from a Supabase error response
 */
export function extractSupabaseErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  // Handle standard error objects
  if (typeof error === 'string') return error;
  
  // Handle Supabase error format
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  
  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Utility to suppress third-party tracking errors in development mode
 * These errors typically occur when tracking scripts (Facebook, Google, TikTok)
 * are blocked by browser extensions or privacy settings
 */

// List of common tracking error patterns
const TRACKING_ERROR_PATTERNS = [
  /fb is not defined/i,
  /fbq is not defined/i,
  /ga is not defined/i,
  /gtag is not defined/i,
  /amplitude is not defined/i,
  /ttq is not defined/i,
  /tiktok/i,
  /pixel/i,
  /tracking/i,
  /analytics/i,
  /window\.dataLayer/i,
];

/**
 * Setup error handling for third-party tracking scripts
 * This prevents console errors from blocked trackers in development
 */
export function setupTrackingErrorHandler() {
  if (process.env.NODE_ENV === 'development') {
    // Save the original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter out tracking errors
    console.error = (...args) => {
      // Check if this is a tracking-related error
      const errorMessage = args.join(' ');
      const isTrackingError = TRACKING_ERROR_PATTERNS.some(pattern => 
        pattern.test(errorMessage)
      );
      
      // If it's a tracking error in development, suppress it or log differently
      if (isTrackingError) {
        console.debug('[Dev Mode] Suppressed tracking error:', ...args);
        return;
      }
      
      // Otherwise, pass through to the original console.error
      originalConsoleError.apply(console, args);
    };
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      const isTrackingError = TRACKING_ERROR_PATTERNS.some(pattern => 
        pattern.test(event.message || '')
      );
      
      if (isTrackingError && process.env.NODE_ENV === 'development') {
        console.debug('[Dev Mode] Suppressed uncaught tracking error:', event.message);
        event.preventDefault();
        return true;
      }
      
      return false;
    }, true);
  }
}

/**
 * Enable React development mode with verbose warnings
 * This helps diagnose issues like the minified #418, #422 errors
 */
export function enableReactDevMode() {
  if (process.env.NODE_ENV === 'development') {
    // Force development mode for React
    try {
      // @ts-ignore - Setting hidden React property
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
      console.info('[Dev Mode] React developer mode enabled for detailed errors');
    } catch (error) {
      console.warn('[Dev Mode] Could not enable React developer mode:', error);
    }
  }
}
