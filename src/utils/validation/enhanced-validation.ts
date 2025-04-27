
import { z } from "zod";
import { validateVinCheckDigit } from "./vin-validation";

// Enhanced ZIP code validation with specific error messages
export const EnhancedZipSchema = z.string()
  .min(5, "ZIP code must be 5 digits")
  .max(10, "ZIP code cannot exceed 10 characters (including optional +4)")
  .regex(/^\d{5}(-\d{4})?$/, "ZIP code must be in format 12345 or 12345-6789");

// Enhanced VIN validation
export const EnhancedVinSchema = z.string()
  .length(17, "VIN must be exactly 17 characters")
  .regex(/^[A-HJ-NPR-Z0-9]+$/, "VIN can only contain letters (except I,O,Q) and numbers")
  .refine(
    (vin) => !(/[IOQ]/.test(vin.toUpperCase())),
    "VIN cannot contain letters I, O, or Q"
  )
  .refine(
    (vin) => validateVinCheckDigit(vin),
    "Invalid VIN check digit - please verify the VIN"
  );

// Enhanced year validation
const currentYear = new Date().getFullYear();
export const EnhancedYearSchema = z.number()
  .int("Year must be a whole number")
  .min(1900, "Year must be 1900 or later")
  .max(currentYear + 1, "Year cannot be more than 1 year in the future")
  .refine(
    (year) => year <= currentYear + 1,
    `Year cannot exceed ${currentYear + 1}`
  );

// Enhanced mileage validation
export const EnhancedMileageSchema = z.number()
  .int("Mileage must be a whole number")
  .min(0, "Mileage cannot be negative")
  .max(999999, "Mileage seems unusually high - please verify")
  .refine(
    (mileage) => mileage <= 500000,
    "Warning: Mileage exceeds typical vehicle lifetime"
  );

// Comprehensive form validation schema
export const EnhancedManualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: EnhancedYearSchema,
  mileage: EnhancedMileageSchema,
  zipCode: EnhancedZipSchema.optional(),
  vin: EnhancedVinSchema.optional(),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid", "Other"]).optional(),
  condition: z.number()
    .min(0, "Condition score must be between 0 and 100")
    .max(100, "Condition score must be between 0 and 100"),
  accident: z.enum(["yes", "no"]).optional(),
  accidentDetails: z.object({
    count: z.string().optional(),
    severity: z.string().optional(),
    area: z.string().optional()
  }).optional(),
  selectedFeatures: z.array(z.string()).default([])
});

export type EnhancedManualEntryData = z.infer<typeof EnhancedManualEntrySchema>;
