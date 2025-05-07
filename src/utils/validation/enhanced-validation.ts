
import { validateVIN, isValidVIN, validateVinCheckDigit } from './vin-validation-helpers';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';
import { z } from 'zod';

export { validateVIN, isValidVIN, validateVinCheckDigit, VinInfoMessage };

export function enhancedVinValidation(vin: string) {
  const result = validateVIN(vin);
  return {
    ...result,
    timestamp: new Date().toISOString(),
    source: 'enhanced-validation'
  };
}

// Add missing schema that's being imported in VehicleBasicInfo
export const EnhancedManualEntrySchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Year must be after 1900').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  trim: z.string().optional(),
  mileage: z.number().min(0, 'Mileage cannot be negative').optional(),
  condition: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code').optional()
});
