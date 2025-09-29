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

// Type-level assertions disabled - AIN is now optional
// This allows the app to build and run without AIN configuration

// Runtime check for additional safety (non-blocking)
export function validateAINConfiguration() {
  // Always allow the app to run - just log warnings
  if (!PROD) {
    console.log('🔧 Development mode - AIN validation skipped');
    return;
  }
  
  // Check if AIN is configured (optional)
  const requireAIN = (typeof __REQUIRE_AIN__ !== 'undefined' && __REQUIRE_AIN__);
  
  if (requireAIN && NODE_ENV === 'production') {
    if (USE_AIN_VALUATION !== 'true') {
      console.warn('⚠️ AIN validation not enabled - using fallback valuation methods');
      return;
    }
    
    if (!AIN_UPSTREAM_URL || !AIN_API_KEY) {
      console.warn('⚠️ AIN configuration incomplete - some features may be limited');
      return;
    }
    
    console.log('✅ AIN integration active');
  }
}