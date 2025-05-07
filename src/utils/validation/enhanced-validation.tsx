
import React from 'react';
import { z } from 'zod';

// VIN validation constants
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Validates a VIN string and returns structured feedback
 */
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) {
    return { isValid: false, error: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { isValid: false, error: 'VIN must be exactly 17 characters' };
  }

  if (/[IOQ]/.test(vin.toUpperCase())) {
    return { isValid: false, error: 'VIN cannot contain letters I, O, or Q' };
  }

  if (!VIN_REGEX.test(vin.toUpperCase())) {
    return {
      isValid: false,
      error: 'VIN must only contain letters A-H, J-N, P, R-Z and digits 0-9',
    };
  }

  return { isValid: true };
}

/**
 * Checks if a VIN is valid based on standard VIN rules
 */
export function isValidVIN(vin: string): boolean {
  const result = validateVIN(vin);
  return result.isValid;
}

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

/**
 * Informational component to explain VIN format
 */
export const VinInfoMessage: React.FC = () => {
  return (
    <div className="text-sm text-gray-500">
      <p>A valid VIN:</p>
      <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
        <li>Contains exactly 17 characters</li>
        <li>Does not contain I, O, or Q</li>
        <li>Contains only letters A-H, J-N, P, R-Z and numbers</li>
      </ul>
    </div>
  );
};
