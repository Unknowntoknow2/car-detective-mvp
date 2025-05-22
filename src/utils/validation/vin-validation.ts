
import { ValidationResult } from './types';

// VIN validation helper function
export function validateVin(vin: string): ValidationResult {
  // Trim whitespace
  vin = vin.trim();
  
  // Check if VIN is empty
  if (!vin) {
    return { 
      isValid: false, 
      message: 'VIN is required',
      error: 'VIN is required'
    };
  }
  
  // Check VIN length
  if (vin.length !== 17) {
    return { 
      isValid: false, 
      message: 'VIN must be exactly 17 characters',
      error: 'VIN must be exactly 17 characters'
    };
  }
  
  // Check for invalid characters (VINs should only contain alphanumeric characters excluding I, O, Q)
  const invalidChars = vin.match(/[IOQ]/gi);
  if (invalidChars) {
    return { 
      isValid: false, 
      message: `VIN contains invalid characters: ${invalidChars.join(', ')}`,
      error: `VIN contains invalid characters: ${invalidChars.join(', ')}`
    };
  }
  
  // Basic format check (alphanumeric only)
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin)) {
    return { 
      isValid: false, 
      message: 'VIN must contain only alphanumeric characters (excluding I, O, Q)',
      error: 'VIN must contain only alphanumeric characters (excluding I, O, Q)'
    };
  }
  
  // VIN is valid
  return { isValid: true };
}

// Simple wrapper that re-exports the function with a shorter name
export const isValidVIN = validateVin;
