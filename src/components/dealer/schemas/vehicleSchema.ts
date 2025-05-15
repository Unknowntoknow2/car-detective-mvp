
import { z } from 'zod';

// Vehicle form schema
export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  price: z.number().min(0, "Price must be a positive number"),
  mileage: z.number().nullable().transform(val => val === 0 ? null : val),
  vin: z.string().optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  description: z.string().optional(),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format").optional(),
  status: z.enum(["available", "pending", "sold"]).default("available"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
// Add this type alias to match what the components are trying to import
export type VehicleFormData = VehicleFormValues;
