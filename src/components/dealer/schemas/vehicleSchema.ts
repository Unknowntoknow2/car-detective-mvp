
import { z } from "zod";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Year must be at least 1900").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.number().int().min(0, "Mileage cannot be negative").nullable(),
  price: z.number().positive("Price must be positive"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().min(5, "Zip code must be 5 digits").max(10, "Zip code is too long").optional(),
  photos: z.array(z.any()).optional(),
  status: z.enum(["available", "sold", "pending"]).default("available")
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
