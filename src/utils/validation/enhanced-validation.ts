
import { z } from 'zod';

// Export the VIN regex for reuse
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Schema for manual entry validation
 */
export const EnhancedManualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  trim: z.string().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  features: z.array(z.string()).optional(),
  accidentCount: z.number().min(0).optional(),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format").optional(),
});

// Re-export validation functions from vin-validation.ts for backward compatibility
export * from './vin-validation';
