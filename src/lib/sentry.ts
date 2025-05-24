
// src/lib/sentry.ts

// 🧪 TEMP DISABLED: Sentry is not available in Lovable until proper install confirmed
console.log("[⚠️ Sentry temporarily disabled]");

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

export const initSentry = () => {
  if (import.meta.env.MODE === 'production') {
    console.warn('Sentry initialization skipped in development.');
  }
};
