
import { validateVin as baseValidateVin } from './vin-validation';

/**
 * Enhanced VIN validation with detailed error checking and explanations
 * This is a wrapper around the base validateVin function with additional validations
 * @param vin 
 * @returns 
 */
export function validateVinEnhanced(vin: string): { isValid: boolean; error: string | null } {
  const result = baseValidateVin(vin);
  return { 
    isValid: result.isValid, 
    error: result.isValid ? null : result.error || null 
  };
}

export { validateVin } from './vin-validation';
