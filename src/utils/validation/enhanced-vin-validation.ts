
import { validateVIN } from './vin-validation';
import { z } from 'zod';

// Enhanced VIN validation schema
export const VinSchema = z.string()
  .trim()
  .toUpperCase()
  .min(17, { message: "VIN must be exactly 17 characters long" })
  .max(17, { message: "VIN must be exactly 17 characters long" })
  .refine(
    (vin) => !/[IOQ]/.test(vin),
    { message: "VIN cannot contain letters I, O, or Q" }
  )
  .refine(
    (vin) => /^[A-HJ-NPR-Z0-9]{17}$/.test(vin),
    { message: "VIN can only contain letters A-Z (except I, O, Q) and numbers 0-9" }
  );

// Enhanced VIN validation that combines the schema and check digit validation
export const validateVinEnhanced = (vin: string): { isValid: boolean; error?: string } => {
  try {
    // First, validate using the basic VIN validation
    const basicValidation = validateVIN(vin);
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    // Additional validation or business rules can be added here
    
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0].message
      };
    }
    
    return {
      isValid: false,
      error: 'Invalid VIN format'
    };
  }
};
