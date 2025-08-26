import logger from "./logger.js";
export async function carSpecsService(vehicle) {
  logger.info("Calling Car Specs Service", { vin: vehicle.vin });
  // Simulate not found for MVP
  return null;
}
