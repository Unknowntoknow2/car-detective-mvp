import { NormalizedVehicle } from "../utils/normalizeVehicleData.js";
import logger from "../utils/logger.js";

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

export async function fetchResidualForecast(vin: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await residualValueService({ vin } as NormalizedVehicle);
    return response?.data ?? null;
  } catch (error) {
    logger.warn?.('Residual value lookup failed', { vin, error });
    return null;
  }
}
