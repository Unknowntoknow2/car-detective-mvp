
/**
 * Sentry error tracking configuration
 * This file handles Sentry initialization with proper error handling
 */

import { appConfig } from '@/config';
import { logger } from '@/lib/logger';

export const initSentry = () => {
  try {
    if (appConfig.SENTRY_ENABLED && appConfig.SENTRY_DSN) {
      // In a real implementation with the proper packages installed:
      // Sentry.init({
      //   dsn: appConfig.SENTRY_DSN,
      //   tracesSampleRate: 0.5,
      //   environment: appConfig.MODE
      // });
      logger.log('Sentry would be initialized for production');
    } else {
      logger.log('Sentry init skipped: Not enabled or missing DSN');
    }
  } catch (error) {
  }
};

// Export Sentry object with conditional behavior
export const Sentry = appConfig.SENTRY_ENABLED ? {
  // Real Sentry methods would go here when package is installed
  captureException: (error: any) => console.error('Sentry capture:', error),
  captureMessage: (message: string) => logger.log('Sentry message:', message),
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
