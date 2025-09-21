// Hard require AIN in production - no fallbacks allowed
if (import.meta.env.PROD) {
  if (!import.meta.env.USE_AIN_VALUATION || import.meta.env.USE_AIN_VALUATION !== "true") {
    throw new Error("AIN required in production - local engine removed");
  }
}