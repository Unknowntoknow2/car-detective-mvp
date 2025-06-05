
import { z } from "zod";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0).optional(),
  price: z.number().min(0, "Price must be positive"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  status: z.enum(["available", "pending", "sold"]),
  photos: z.array(z.string()).default([]),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().optional(),
  description: z.string().optional(),
  vin: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
