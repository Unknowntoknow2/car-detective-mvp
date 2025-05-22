
import { ValidationResult } from './types';

// Basic VIN validation - check for 17 alphanumeric characters
export function validateVin(vin: string): ValidationResult {
  if (!vin) {
    return { isValid: false, message: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { isValid: false, message: 'VIN must be exactly 17 characters' };
  }

  // Check for invalid characters
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin)) {
    return { 
      isValid: false, 
      message: 'VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)'
    };
  }

  // Check the VIN check digit
  if (!validateVinCheckDigit(vin)) {
    return { 
      isValid: false, 
      message: 'Invalid VIN check digit (position 9)'
    };
  }

  return { isValid: true };
}

// VIN check digit validation
export function validateVinCheckDigit(vin: string): boolean {
  // VIN check digit validation logic
  // Position 9 is the check digit
  const vinMap: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = vinMap[char];
    
    if (value === undefined) {
      return false;
    }
    
    sum += value * weights[i];
  }

  const checkDigit = sum % 11;
  const correctCheckDigit = checkDigit === 10 ? 'X' : checkDigit.toString();
  return vin.charAt(8).toUpperCase() === correctCheckDigit;
}

// Simple wrapper function for compatibility
export const isValidVIN = (vin: string): boolean => validateVin(vin).isValid;
