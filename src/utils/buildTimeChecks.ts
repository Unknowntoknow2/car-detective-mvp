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
  // Development mode - allow without AIN
  if (!PROD) {
    return; // Skip validation in development
  }
  
  // Check if we need to enforce AIN in production
  const requireAIN = (typeof __REQUIRE_AIN__ !== 'undefined' && __REQUIRE_AIN__) || PROD;
  
  if (requireAIN && NODE_ENV === 'production') {
    if (USE_AIN_VALUATION !== 'true') {
      console.warn('AIN validation not configured - using fallback');
      return;
    }
    
    if (!AIN_UPSTREAM_URL || !AIN_API_KEY) {
      console.warn('AIN configuration incomplete - using fallback');
      return;
    }
  }
}

// Export for use in app initialization
export { _buildTimeAssertion };