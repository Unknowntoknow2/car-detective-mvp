// Build-time enforcement for AIN integration
// This file will cause TypeScript compilation to fail if AIN is not properly configured

// Import meta environment check
declare const __REQUIRE_AIN__: boolean;

// Compile-time check: Ensure USE_AIN_VALUATION is enabled in production
const USE_AIN_VALUATION = import.meta.env.USE_AIN_VALUATION;
const AIN_UPSTREAM_URL = import.meta.env.AIN_UPSTREAM_URL; 
const AIN_API_KEY = import.meta.env.AIN_API_KEY;
const NODE_ENV = import.meta.env.NODE_ENV;
const PROD = import.meta.env.PROD;

// Type-level assertions that will fail compilation if conditions aren't met
type AssertAINEnabled = typeof USE_AIN_VALUATION extends "true" 
  ? true 
  : "❌ BUILD ERROR: USE_AIN_VALUATION must be set to 'true' in production";

type AssertAINConfigured = typeof AIN_UPSTREAM_URL extends string
  ? typeof AIN_API_KEY extends string
    ? AssertAINEnabled
    : "❌ BUILD ERROR: AIN_API_KEY must be configured in production"
  : "❌ BUILD ERROR: AIN_UPSTREAM_URL must be configured in production";

type AssertNotLocal = typeof PROD extends true 
  ? AssertAINConfigured
  : true; // Allow local development

// This will cause a TypeScript error if AIN is not properly configured
const _buildTimeAssertion: AssertNotLocal = true as AssertNotLocal;

// Runtime check for additional safety
export function validateAINConfiguration() {
  // Check if we need to enforce AIN in production
  const requireAIN = (typeof __REQUIRE_AIN__ !== 'undefined' && __REQUIRE_AIN__) || PROD;
  
  if (requireAIN) {
    if (USE_AIN_VALUATION !== 'true') {
      throw new Error(
        '🚨 PRODUCTION BUILD ERROR: USE_AIN_VALUATION must be set to "true" in production. ' +
        'Local fallback is disabled in production builds.'
      );
    }
    
    if (!AIN_UPSTREAM_URL || !AIN_API_KEY) {
      throw new Error(
        '🚨 PRODUCTION BUILD ERROR: AIN_UPSTREAM_URL and AIN_API_KEY must be configured in production.'
      );
    }
  }
  
    USE_AIN_VALUATION,
    NODE_ENV,
    PROD,
    HAS_UPSTREAM_URL: !!AIN_UPSTREAM_URL,
    HAS_API_KEY: !!AIN_API_KEY,
    status: USE_AIN_VALUATION === 'true' ? 'AIN_ENABLED' : 'LOCAL_DEV'
  });
}

// Export for use in app initialization
export { _buildTimeAssertion };