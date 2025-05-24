
// src/lib/sentry.ts

/**
 * TEMP DISABLED: Sentry error tracking is turned off during MVP development
 * This file is locked and should not be modified until Sentry packages are verified
 * Re-enable only when `@sentry/react` and `@sentry/tracing` are correctly installed.
 */

export const initSentry = () => {
  if (import.meta.env.MODE === 'production') {
    console.warn('Sentry init skipped: Disabled for MVP phase.');
  }
};

// Export a mock Sentry object with empty implementations
export const Sentry = {
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
  // Add other commonly used Sentry methods as needed
};
