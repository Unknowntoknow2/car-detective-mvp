/**
 * Global type definitions for runtime configuration
 */

declare global {
  interface Window {
    __APP_CONFIG__?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
      VEHICLE_API_URL?: string;
      FEATURE_AUDIT?: string;
      SENTRY_DSN?: string;
      MODE?: string;
    };
  }
}

export {};