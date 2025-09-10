/**
 * Application Configuration
 * 
 * Centralized configuration management that replaces import.meta.env.VITE_* usage.
 * Reads from process.env first, then window.__APP_CONFIG__ fallback.
 */

import { z } from 'zod';

// Import global types
import '../global.d.ts';

// Configuration interface
export interface Config {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  VEHICLE_API_URL?: string;
  PUBLIC_API_BASE_URL?: string;
  EDGE_FUNCTION_BASE_URL?: string;
  FEATURE_AUDIT?: '0' | '1';
  SENTRY_DSN?: string;
  MODE: 'development' | 'production' | 'test';
}

// Configuration schema for validation
const ConfigSchema = z.object({
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  VEHICLE_API_URL: z.string().url().optional(),
  PUBLIC_API_BASE_URL: z.string().url().optional(),
  EDGE_FUNCTION_BASE_URL: z.string().url().optional(),
  FEATURE_AUDIT: z.enum(['0', '1']).optional().default('0'),
  SENTRY_DSN: z.string().optional(),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});



// Runtime config reader with browser/SSR safety
function getConfigValue(key: keyof Config): string | undefined {
  // Try process.env first (build time / SSR only)
  if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env) {
    const processKey = `VITE_${key}`;
    if (process.env[processKey]) {
      return process.env[processKey];
    }
  }

  // Try window.__APP_CONFIG__ (browser runtime)
  if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
    return (window as any).__APP_CONFIG__[key];
  }

  return undefined;
}

// Build config object
const rawConfig: Record<string, any> = {
  SUPABASE_URL: getConfigValue('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getConfigValue('SUPABASE_ANON_KEY'),
  VEHICLE_API_URL: getConfigValue('VEHICLE_API_URL'),
  PUBLIC_API_BASE_URL: getConfigValue('PUBLIC_API_BASE_URL'),
  EDGE_FUNCTION_BASE_URL: getConfigValue('EDGE_FUNCTION_BASE_URL'),
  FEATURE_AUDIT: getConfigValue('FEATURE_AUDIT') || '0',
  SENTRY_DSN: getConfigValue('SENTRY_DSN'),
  MODE: getConfigValue('MODE') || 'development',
};

// Validate and export config
let config: Config;

try {
  config = ConfigSchema.parse(rawConfig);
} catch (error) {
  console.error('Configuration validation failed:', error);
  throw new Error(`Invalid configuration: ${error instanceof z.ZodError ? error.message : 'Unknown error'}`);
}

// Derived configuration values
export const appConfig = {
  ...config,
  
  // Computed values with safe defaults
  API_BASE_URL: config.VEHICLE_API_URL || config.PUBLIC_API_BASE_URL || 'https://api.cardetective.com/api',
  EDGE_FUNCTION_BASE_URL: config.EDGE_FUNCTION_BASE_URL || `${config.SUPABASE_URL}/functions/v1`,
  
  // Feature flags
  IS_DEVELOPMENT: config.MODE === 'development',
  IS_PRODUCTION: config.MODE === 'production',
  AUDIT_ENABLED: config.FEATURE_AUDIT === '1',
  SENTRY_ENABLED: config.MODE === 'production' && Boolean(config.SENTRY_DSN),
  
  // Debug flags (only in development)
  ENABLE_DIAGNOSTICS: config.MODE === 'development',
} as const;

export default appConfig;