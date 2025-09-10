
/**
 * Sentry error tracking configuration
 * This file handles Sentry initialization with proper error handling
 */

import { appConfig } from '@/config';

export const initSentry = () => {
  try {
    if (appConfig.SENTRY_ENABLED && appConfig.SENTRY_DSN) {
      // In a real implementation with the proper packages installed:
      // Sentry.init({
      //   dsn: appConfig.SENTRY_DSN,
      //   tracesSampleRate: 0.5,
      //   environment: appConfig.MODE
      // });
      console.info('Sentry would be initialized for production');
    } else {
      console.info('Sentry init skipped: Not enabled or missing DSN');
    }
  } catch (error) {
    console.warn('Failed to initialize Sentry:', error);
  }
};

// Export Sentry object with conditional behavior
export const Sentry = appConfig.SENTRY_ENABLED ? {
  // Real Sentry methods would go here when package is installed
  captureException: (error: any) => console.error('Sentry capture:', error),
  captureMessage: (message: string) => console.info('Sentry message:', message),
  setUser: () => {},
  setTag: () => {},
  setTags: () => {},
  setExtra: () => {},
  setExtras: () => {},
  lastEventId: () => null,
  showReportDialog: () => {},
  init: () => {},
} : {
  // Noop implementations when disabled
  captureException: () => {},
  captureMessage: () => {},
  setUser: () => {},
  setTag: () => {},
  setTags: () => {},
  setExtra: () => {},
  setExtras: () => {},
  lastEventId: () => null,
  showReportDialog: () => {},
  init: () => {},
};
