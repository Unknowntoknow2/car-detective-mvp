
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const isProd = import.meta.env.MODE === 'production';
const dsn = import.meta.env.VITE_SENTRY_DSN;

if (isProd && dsn) {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.2, // 20% of performance traces sent
    release: import.meta.env.VITE_RELEASE || 'car-perfector@dev',
    environment: import.meta.env.MODE,
  });
  console.info('✅ Sentry initialized in production.');
} else {
  console.info('🧪 Sentry is disabled in development.');
}

export default Sentry;
