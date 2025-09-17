import { NormalizedVehicle } from "../utils/normalizeVehicleData.js";
import logger from "../utils/logger.js";

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

export async function fetchVinLookup(vin: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await vinLookupService({ vin } as NormalizedVehicle);
    if (response && response.data && Object.keys(response.data).length > 0) {
      return response.data;
    }
  } catch (error) {
    logger.warn?.('VIN lookup failed', { vin, error });
  }
  return null;
}
