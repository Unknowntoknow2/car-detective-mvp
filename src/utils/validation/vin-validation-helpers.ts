
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Validates a Vehicle Identification Number (VIN)
 * @param vin The VIN to validate
 * @returns Object with validation result and error message
 */
export function validateVIN(vin: string): { isValid: boolean; error: string } {
  // Early return if empty - this might be valid for a form that doesn't require VIN
  if (!vin || vin.trim() === '') {
    return { isValid: false, error: 'VIN is required' };
  }

  // Check length
  if (vin.length !== 17) {
    return { isValid: false, error: 'VIN must be exactly 17 characters' };
  }

  // Check for invalid characters (VINs only use alphanumeric except I, O, Q)
  const validVinRegex = /^[A-HJ-NPR-Z0-9]+$/;
  if (!validVinRegex.test(vin)) {
    return { 
      isValid: false, 
      error: 'VIN contains invalid characters (only alphanumeric allowed, excluding I, O, Q)' 
    };
  }

  // Check digit validation (for North American VINs)
  try {
    if (!validateVinCheckDigit(vin)) {
      return { isValid: false, error: 'Invalid VIN check digit - this is not a valid VIN' };
    }
  } catch (error) {
    console.error('Error validating VIN check digit:', error);
    return { isValid: false, error: 'Error validating VIN format' };
  }

  return { isValid: true, error: '' };
}

/**
 * Validates the check digit (9th character) of a VIN using the standard algorithm
 * @param vin The VIN to validate
 * @returns Boolean indicating if the check digit is valid
 */
function validateVinCheckDigit(vin: string): boolean {
  if (vin.length !== 17) return false;
  
  // Character values for check digit calculation
  const charValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  // Weight factors for each position
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Calculate weighted sum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = charValues[char];
    
    if (value === undefined) return false; // Invalid character
    
    sum += value * weights[i];
  }
  
  // Calculate check digit
  const remainder = sum % 11;
  const checkDigit = remainder === 10 ? 'X' : remainder.toString();
  
  // 9th position (index 8) should match calculated check digit
  return vin.charAt(8).toUpperCase() === checkDigit;
}

/**
 * React component that provides helpful information about VIN format
 */
export const VinInfoMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-1.5 mt-1.5 text-muted-foreground text-xs">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
      <span>
        A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every vehicle.
        It's typically found on the driver's side dashboard, door jamb, or vehicle registration.
      </span>
    </div>
  );
};
