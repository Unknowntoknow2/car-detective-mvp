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

export async function fetchMarketPricing(make: string, model: string, year: number): Promise<Record<string, unknown> | null> {
  const placeholderVehicle = {
    vin: 'VINPLACEHOLDER1234',
    make,
    model,
    year,
  } as NormalizedVehicle;

  try {
    const response = await vehiclePricingService(placeholderVehicle);
    return response?.data ?? null;
  } catch (error) {
    logger.warn?.('Market pricing lookup failed', { make, model, year, error });
    return null;
  }
}
