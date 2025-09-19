import { NormalizedVehicle } from "../utils/normalizeVehicleData";
import logger from "../utils/logger";

export async function carSpecsService(
  vehicle: NormalizedVehicle
): Promise<{ [key: string]: any }> {
  logger.info("Calling Car Specs Service", { vin: vehicle.vin });
  // Not implemented: return 404/empty
  return {
    source: "CarSpecs",
    status: "not_implemented",
    data: {},
  };
}

// 🔧 Extra enrichment: Get models by makeId
export async function getModelsByMakeId(makeId: string) {
  const CAR_SPECS_URL = process.env.CAR_SPECS_URL || "https://dummy-carspecs-url.com";
  const url = `${CAR_SPECS_URL}/cars/makes/${makeId}/models`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "car-specs.p.rapidapi.com",
  "x-rapidapi-key": process.env.RAPIDAPI_KEY || "dummy-rapidapi-key",
    },
  });

  if (!res.ok) throw new Error(`Car Specs models lookup failed: ${res.status}`);
  return await res.json();
}
