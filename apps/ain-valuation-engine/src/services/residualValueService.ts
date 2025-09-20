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

export async function fetchResidualForecast(vehicle: NormalizedVehicle): Promise<{
  residualPercent: number;
  months: number;
  futureValue: number;
} | null> {
  try {
    const result = await residualValueService(vehicle);
    const currentValue = 20000; // Mock current value
    const futureValue = currentValue * (result.data.residualPercent / 100);
    
    return {
      residualPercent: result.data.residualPercent,
      months: result.data.months,
      futureValue
    };
  } catch (error) {
    logger.error("Residual forecast fetch failed", { vehicle, error });
    return null;
  }
}
