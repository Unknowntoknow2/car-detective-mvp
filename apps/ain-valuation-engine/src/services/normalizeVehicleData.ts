import * as z from "zod";
import type { VehicleData } from "@/types/ValuationTypes";

// Zod draft used for input validation; canonical TS type remains VehicleData
export const vehicleDataSchema = z.object({
  vin: z
    .string()
    .length(17, "VIN must be 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/, "VIN contains invalid characters"),
  year: z.number().int().gte(1980).lte(new Date().getFullYear() + 1).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
  plate: z.string().length(5).optional(),
  mileage: z.number().int().min(0).optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  zipCode: z.string().optional(),
  zip: z.string().optional(),
});

export type NormalizedVehicleDraft = z.infer<typeof vehicleDataSchema>;
export type NormalizedVehicleData = Partial<VehicleData> & NormalizedVehicleDraft;

// Normalize input and prefer canonical `zip`, accepting `zipCode` fallback.
export function normalizeVehicleData(input: unknown): NormalizedVehicleData {
  const parsed = vehicleDataSchema.parse(input);
  const zip = (parsed as any).zip ?? (parsed as any).zipCode;
  return (zip ? { ...parsed, zip } : parsed) as NormalizedVehicleData;
}
