import logger from "./logger.js";
export async function vinLookupService(vehicle) {
  logger.info("Calling VIN Lookup Service", { vin: vehicle.vin });
  // Simulate not found for MVP
  return null;
}
