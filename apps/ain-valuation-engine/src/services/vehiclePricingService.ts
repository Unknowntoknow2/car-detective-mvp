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

export async function fetchMarketPricing(vehicle: NormalizedVehicle): Promise<{
  retail: number | null;
  tradeIn: number | null;
  privateParty: number | null;
} | null> {
  try {
    const result = await vehiclePricingService(vehicle);
    return {
      retail: result.data?.retail || null,
      tradeIn: result.data?.tradeIn || null,
      privateParty: result.data?.privateParty || null,
    };
  } catch (error) {
    logger.error("Market pricing fetch failed", { vehicle, error });
    return null;
  }
}
