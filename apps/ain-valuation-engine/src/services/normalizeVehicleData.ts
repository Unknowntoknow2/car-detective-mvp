import * as z from "zod";

// Define the Zod schema for vehicle data (MVP, minimal fields)
export const VehicleDataSchema = z.object({
  vin: z.string()
    .length(17, "VIN must be 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/, "VIN contains invalid characters"),
  year: z.number().int().gte(1980).lte(new Date().getFullYear() + 1).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
  plate: z.string().length(5).optional(),
  mileage: z.number().int().gte(0).optional(),
  // Add any other fields as needed
});

// TypeScript type inferred from schema
export type VehicleData = z.infer<typeof VehicleDataSchema>;

// Normalization function: validates and returns typed object
export function normalizeVehicleData(input: unknown): VehicleData {
  try {
    return VehicleDataSchema.parse(input);
  } catch (err: any) {
    throw new Error(`Invalid vehicle data: ${err.message}`);
  }
}
