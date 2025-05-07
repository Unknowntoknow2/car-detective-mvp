/**
 * Validates a VIN
 * @param vin - The VIN to validate
 * @returns An object with validation result and error message if invalid
 */
export const validateVin = (vin: string): { valid: boolean; message?: string } => {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }

  // Remove any spaces and make uppercase
  const cleanVin = vin.replace(/\s+/g, '').toUpperCase();

  if (cleanVin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }

  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(cleanVin)) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }

  // Check for valid VIN format (only certain letters and numbers)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return { valid: false, message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9' };
  }

  return { valid: true };
};

/**
 * Simple function to check if a VIN is valid
 */
export const isValidVIN = (vin: string): boolean => {
  const result = validateVin(vin);
  return result.valid;
};

// Calculate and validate the VIN check digit
export function validateVinCheckDigit(vin: string): boolean {
  // Transliteration values for each position
  const transliterationValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  // Weight factors for each position
  const weightFactors = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  // If VIN is not 17 characters, don't validate check digit
  if (vin.length !== 17) return false;

  const upperVin = vin.toUpperCase();
  const checkDigit = upperVin[8];
  let sum = 0;

  // Calculate weighted sum
  for (let i = 0; i < 17; i++) {
    const char = upperVin[i];
    const value = transliterationValues[char];
    
    if (value === undefined) return false;  // Invalid character
    
    sum += value * weightFactors[i];
  }

  // Calculate check digit
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();

  return checkDigit === expectedCheckDigit;
}
