import logger from "./logger.js";
export async function carApiService(vehicle) {
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
