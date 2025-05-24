
import { toast } from 'sonner';

// Setup error handler for third-party tracking scripts
export const setupTrackingErrorHandler = () => {
  // If in development or test, suppress most tracking errors
  if (process.env.NODE_ENV !== 'production') {
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Ignore tracking script errors in development
      if (source && (
          source.includes('analytics') || 
          source.includes('tracking') || 
          source.includes('sentry') || 
          source.includes('gtag') ||
          // Add more patterns for 3rd party scripts that might cause noise
          source.includes('cdn') ||
          message?.toString().includes('BloomFilter')
      )) {
        console.warn('Suppressed external script error:', message);
        return true; // Prevents the error from bubbling up
      }
      
      // Otherwise use the original handler
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };
  }
};

// Enable React dev mode in development
export const enableReactDevMode = () => {
  if (process.env.NODE_ENV === 'development') {
    // This helps with catching issues during development
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filter out certain known non-critical errors in development
      const message = args[0]?.toString() || '';
      if (
        message.includes('Warning: ReactDOM.render is no longer supported') ||
        message.includes('Warning: findDOMNode is deprecated') ||
        message.includes('Multiple GoTrueClient instances detected') ||
        message.includes('React Router Future Flag Warning') ||
        message.includes('Warning: Importing from @/utils/formatters.ts is deprecated')
      ) {
        // Suppress common warnings that are not critical
        return;
      }
      
      originalConsoleError(...args);
    };
  }
};

// Helper function to convert errors to string
export const errorToString = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred';
};
