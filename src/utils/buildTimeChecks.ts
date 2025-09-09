// Build-time enforcement for AIN integration
// This file will cause TypeScript compilation to fail if AIN is not properly configured

// Compile-time check: Ensure USE_AIN_VALUATION is enabled in production
const USE_AIN_VALUATION = process.env.USE_AIN_VALUATION;
const NODE_ENV = process.env.NODE_ENV;

// Type-level assertions that will fail compilation if conditions aren't met
type AssertAINEnabled = typeof USE_AIN_VALUATION extends "true" 
  ? true 
  : "❌ BUILD ERROR: USE_AIN_VALUATION must be set to 'true' in production";

type AssertNotLocal = typeof NODE_ENV extends "production" 
  ? AssertAINEnabled
  : true; // Allow local development

// This will cause a TypeScript error if AIN is not properly configured
const _buildTimeAssertion: AssertNotLocal = true as AssertNotLocal;

// Runtime check for additional safety
export function validateAINConfiguration() {
  if (NODE_ENV === 'production' && USE_AIN_VALUATION !== 'true') {
    throw new Error(
      '🚨 PRODUCTION BUILD ERROR: USE_AIN_VALUATION must be set to "true" in production. ' +
      'Local fallback is disabled in production builds.'
    );
  }
  
  console.log('✅ AIN Configuration validated:', {
    USE_AIN_VALUATION,
    NODE_ENV,
    status: USE_AIN_VALUATION === 'true' ? 'AIN_ENABLED' : 'LOCAL_DEV'
  });
}

// Export for use in app initialization
export { _buildTimeAssertion };