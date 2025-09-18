import { NormalizedVehicleData as NormalizedVehicle } from "./normalizeVehicleData";
import logger from "../utils/logger";

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
