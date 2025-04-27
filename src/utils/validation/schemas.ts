
import { z } from "zod";

export const VinSchema = z.string()
  .length(17, "VIN must be exactly 17 characters")
  .regex(/^[A-HJ-NPR-Z0-9]+$/, "VIN can only contain letters (except I,O,Q) and numbers")
  .refine(
    (vin) => !(/[IOQ]/.test(vin.toUpperCase())),
    "VIN cannot contain letters I, O, or Q"
  );

export const PlateSchema = z.string()
  .min(2, "Plate must be at least 2 characters")
  .max(8, "Plate cannot exceed 8 characters")
  .regex(/^[A-Z0-9-]+$/, "Plate can only contain letters, numbers, and hyphens");

export const ManualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.number()
    .int()
    .min(0, "Mileage cannot be negative")
    .max(999999, "Mileage seems unusually high"),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid", "Other"]),
  condition: z.number()
    .min(0, "Condition score must be between 0 and 100")
    .max(100, "Condition score must be between 0 and 100"),
});

export type ManualEntryData = z.infer<typeof ManualEntrySchema>;
