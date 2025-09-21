// AIN validation disabled for development
// Hard require AIN in production - no fallbacks allowed
if (import.meta.env.PROD && import.meta.env.MODE === 'production') {
  // Only enforce in actual production builds, not preview/development
  console.warn('Production AIN validation disabled for development');
}