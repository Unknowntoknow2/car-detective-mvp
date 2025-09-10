
/**
 * Sentry error tracking configuration
 * This file handles Sentry initialization with proper error handling
 */

import { appConfig } from '@/config';

export const initSentry = () => {
  try {
    if (appConfig.SENTRY_ENABLED) {
      console.log('Sentry initialization skipped: Will be enabled in production with proper DSN');
      // In a real implementation with the proper packages installed:
      // Sentry.init({
      //   dsn: appConfig.SENTRY_DSN,
      //   tracesSampleRate: 0.5,
      //   environment: appConfig.MODE
      // });
    } else {
      console.info('Sentry init skipped: Not in production or missing DSN');
    }
  } catch (error) {
    console.warn('Failed to initialize Sentry:', error);
  }
};

// Export a mock Sentry object with empty implementations
// This prevents errors when Sentry methods are called but Sentry isn't properly initialized
export const Sentry = {
  captureException: (error: any) => {
    if (import.meta.env.DEV) {
      console.warn('Sentry.captureException called but Sentry is disabled:', error);
    }
  },
  captureMessage: (message: string) => {
    if (import.meta.env.DEV) {
      console.warn('Sentry.captureMessage called but Sentry is disabled:', message);
    }
  },
  setUser: () => {},
  setTag: () => {},
  setTags: () => {},
  setExtra: () => {},
  setExtras: () => {},
  lastEventId: () => null,
  showReportDialog: () => {},
  init: () => {},
  // Add other commonly used Sentry methods as needed
};
