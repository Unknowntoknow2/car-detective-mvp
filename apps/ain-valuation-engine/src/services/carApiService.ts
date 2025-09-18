import { NormalizedVehicleData as NormalizedVehicle } from "./normalizeVehicleData";
import logger from "../utils/logger";

export async function carApiService(vehicle: NormalizedVehicle): Promise<{ [key: string]: any }> {
  logger.info("Calling Car API Service", { vin: vehicle.vin });
  const vin = vehicle.vin;
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NHTSA API error: ${res.status}`);
  const data = await res.json();
  return {
    source: "NHTSA",
    status: "success",
    data,
  };
}
