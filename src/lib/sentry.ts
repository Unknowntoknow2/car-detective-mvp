
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const dsn = import.meta.env.VITE_SENTRY_DSN;
const isProd = import.meta.env.MODE === "production";

try {
  if (isProd && dsn) {
    Sentry.init({
      dsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1, // reduce to avoid 429 errors
      replaysSessionSampleRate: 0.0, // disable until needed
      replaysOnErrorSampleRate: 0.0,
    });
  } else {
    console.info("[Sentry] Skipped initialization — not production or DSN missing.");
  }
} catch (error) {
  console.warn("[Sentry] Failed to initialize:", error);
}

export { Sentry };
