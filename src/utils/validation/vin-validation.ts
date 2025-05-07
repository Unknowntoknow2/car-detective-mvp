
/**
 * Core VIN validation utilities with consistent return types
 */

// VIN validation constants
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Validates a VIN string and returns structured feedback
 * @param vin The VIN to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateVin(vin: string): { valid: boolean; message?: string } {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }

  if (/[IOQ]/.test(vin.toUpperCase())) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }

  if (!VIN_REGEX.test(vin.toUpperCase())) {
    return {
      valid: false,
      message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9',
    };
  }

  return { valid: true };
}

/**
 * Validates a VIN string with isValid/error naming convention 
 * for backward compatibility
 */
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  const result = validateVin(vin);
  return {
    isValid: result.valid,
    error: result.message
  };
}

/**
 * Checks if a VIN is valid based on standard VIN rules
 */
export function isValidVIN(vin: string): boolean {
  const result = validateVin(vin);
  return result.valid;
}

/**
 * Validates the VIN check digit (position 9)
 * @param vin The VIN to validate
 * @returns True if the check digit is valid
 */
export function validateVinCheckDigit(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }

  // Chart to convert characters to numbers
  const vinValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  // Weight factors for each position
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = vinValues[char];
    if (value === undefined) {
      return false;
    }
    sum += value * weights[i];
  }

  // Calculate check digit
  const mod = sum % 11;
  const checkDigit = mod === 10 ? 'X' : mod.toString();

  // Compare with actual check digit (position 9)
  return checkDigit === vin.charAt(8).toUpperCase();
}
