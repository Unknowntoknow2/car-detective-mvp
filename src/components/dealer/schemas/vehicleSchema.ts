
import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.number().nullable().transform(val => val === 0 ? null : val),
  price: z.number().min(0, "Price must be a positive number"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format").optional(),
  photos: z.array(z.any()).optional(),
  status: z.enum(["available", "pending", "sold"]).default("available"),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
