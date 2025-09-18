import { NormalizedVehicleData as NormalizedVehicle } from "./normalizeVehicleData";
import logger from "../utils/logger";

export async function residualValueService(
  vehicle: NormalizedVehicle
): Promise<{ [key: string]: any }> {
  logger.info("Calling Residual Value Service", { vin: vehicle.vin });
  // Mocked response for demonstration
  return {
    source: "ResidualValue",
    status: "success",
    data: {
      residualPercent: 48,
      months: 36,
    },
  };
}
