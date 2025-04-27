
import { z } from "zod";
import { VinSchema, PlateSchema } from "./validation/schemas";

export const VehicleLookupSchema = z.object({
  mode: z.enum(['vin', 'plate', 'manual']).default('vin'),
  lookupValue: z.string().optional(),
  manual: z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number()
      .int()
      .min(1900, "Year must be 1900 or later")
      .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    trim: z.string().optional(),
  }).optional(),
});

export type VehicleLookupFormData = z.infer<typeof VehicleLookupSchema>;
