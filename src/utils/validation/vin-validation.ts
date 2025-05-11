
/**
 * Basic validation for VIN (Vehicle Identification Number)
 */
export function validateVin(vin: string): { valid: boolean; message?: string } {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }

  // VINs should not contain I, O, or Q
  if (/[IOQ]/i.test(vin)) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }

  // VINs should only contain alphanumeric characters
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) {
    return { valid: false, message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9' };
  }

  // Add check digit validation
  if (!validateVinCheckDigit(vin)) {
    return { valid: false, message: 'VIN check digit validation failed' };
  }

  return { valid: true };
}

/**
 * Simple check for whether a VIN is valid (without detailed error message)
 */
export function isValidVIN(vin: string): boolean {
  return validateVin(vin).valid;
}

/**
 * Validates the check digit in a VIN (position 9)
 * This implements the standard VIN validation algorithm
 */
export function validateVinCheckDigit(vin: string): boolean {
  // If the VIN is not 17 characters, don't try to validate the check digit
  if (!vin || vin.length !== 17) {
    return false;
  }

  // Character values for check digit calculation
  const values: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  // Weights for each position in the VIN
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  // The 9th position is the check digit
  const checkDigit = vin.charAt(8).toUpperCase();

  // Calculate the sum of products
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    if (values[char] === undefined) {
      return false; // Invalid character
    }
    sum += values[char] * weights[i];
  }

  // Calculate the check digit
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();

  // Compare the calculated check digit with the actual check digit
  return checkDigit === expectedCheckDigit;
}
