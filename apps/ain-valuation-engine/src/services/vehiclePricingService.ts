import { NormalizedVehicle } from "../utils/normalizeVehicleData.js";
import logger from "../utils/logger.js";

export async function vehiclePricingService(
  vehicle: NormalizedVehicle
): Promise<{ [key: string]: any }> {
  logger.info("Calling Vehicle Pricing Service", { vin: vehicle.vin });
  // Mocked response for demonstration
  return {
    source: "VehiclePricing",
    status: "success",
    data: {
      retail: 18500,
      tradeIn: 16000,
      privateParty: 17000,
    },
  };
}
