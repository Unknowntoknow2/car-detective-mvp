
import { z } from "zod";

// Current year for validation
const currentYear = new Date().getFullYear();

// VIN validation schema
export const vinSchema = z.object({
  vin: z.string()
    .min(17, { message: "VIN must be 17 characters" })
    .max(17, { message: "VIN must be 17 characters" })
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, { 
      message: "VIN contains invalid characters (no I, O, or Q allowed)" 
    }),
  zipCode: z.string()
    .min(5, { message: "ZIP code must be at least 5 characters" })
    .max(10, { message: "ZIP code cannot exceed 10 characters" })
});

// Plate validation schema
export const plateSchema = z.object({
  plate: z.string()
    .min(1, { message: "License plate is required" })
    .max(10, { message: "License plate cannot exceed 10 characters" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string()
    .min(5, { message: "ZIP code must be at least 5 characters" })
    .max(10, { message: "ZIP code cannot exceed 10 characters" })
});

// Manual entry validation schema
export const manualEntrySchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce.number()
    .min(1900, { message: "Year must be at least 1900" })
    .max(currentYear + 1, { message: `Year cannot be greater than ${currentYear + 1}` }),
  mileage: z.coerce.number()
    .min(0, { message: "Mileage cannot be negative" })
    .max(1000000, { message: "Mileage seems too high" }),
  zipCode: z.string()
    .min(5, { message: "ZIP code must be at least 5 characters" })
    .max(10, { message: "ZIP code cannot exceed 10 characters" }),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  trim: z.string().optional(),
  color: z.string().optional(),
  features: z.array(z.string()).optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional()
});

// Type for validation results
export type ValidationResult = {
  success: boolean;
  errors?: Record<string, string>;
  data?: any;
};

// Validate function
export function validateForm<T>(schema: z.ZodType<T>, data: any): ValidationResult {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const path = err.path.join(".");
          errors[path] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: "Validation failed" } };
  }
}
