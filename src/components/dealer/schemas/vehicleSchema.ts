
import { z } from "zod";

// Define the allowed vehicle status types
export type VehicleStatus = 'available' | 'pending' | 'sold';

// Create a Zod schema for vehicle form validation
export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim_id: z.string().optional(),
  year: z.number()
    .int("Year must be a whole number")
    .min(1950, "Year must be 1950 or later")
    .max(new Date().getFullYear() + 1, `Year cannot be in the future`),
  mileage: z.number().nullable()
    .transform(val => val === 0 ? null : val)
    .refine(val => val === null || (val >= 0 && val <= 500000), {
      message: "Mileage must be between 0 and 500,000 miles"
    }),
  price: z.number().min(1, "Price must be greater than 0"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"], {
    required_error: "Please select a condition",
  }),
  transmission: z.enum(["Automatic", "Manual", "CVT", "Semi-Automatic", "Dual Clutch"], {
    required_error: "Please select a transmission type",
  }).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "Natural Gas", "Flex Fuel"], {
    required_error: "Please select a fuel type",
  }).optional(),
  zip_code: z.string()
    .regex(/^\d{5}$/, "ZIP code must be a 5-digit number")
    .optional(),
  photos: z.array(z.any()).optional(),
  status: z.enum(["available", "pending", "sold"], {
    required_error: "Please select a status",
  }),
});

// Export the inferred type from our schema
export type VehicleFormData = z.infer<typeof vehicleSchema>;
