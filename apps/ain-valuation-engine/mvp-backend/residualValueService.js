import logger from "./logger.js";
export async function residualValueService(vehicle) {
  logger.info("Calling Residual Value Service", { vin: vehicle.vin });
  // Simulate not found for MVP
  return null;
}
