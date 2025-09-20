import { NormalizedVehicle } from "../utils/normalizeVehicleData.js";
import logger from "../utils/logger.js";
import type { DecodedVinResult } from "../types/ValuationTypes.js";

export async function vinLookupService(
  vehicle: NormalizedVehicle
): Promise<{ [key: string]: any }> {
  logger.info("Calling VIN Lookup Service", { vin: vehicle.vin });
  // Not implemented: return 404/empty
  return {
    source: "VinLookup",
    status: "not_implemented",
    data: {},
  };
}

export async function fetchVinLookup(vin: string): Promise<DecodedVinResult | null> {
  try {
    logger.info("Fetching VIN lookup", { vin });
    // Mock implementation - replace with real VIN API call
    const mockResult: DecodedVinResult = {
      vin,
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      trim: 'LE',
      engine: '2.5L I4',
      transmission: 'Automatic'
    };
    return mockResult;
  } catch (error) {
    logger.error("VIN lookup failed", { vin, error });
    return null;
  }
}
