
/**
 * Validates a VIN (Vehicle Identification Number)
 * @param vin The VIN to validate
 * @returns {boolean} True if the VIN is valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  // VIN must be 17 characters
  if (!vin || vin.length !== 17) {
    return false;
  }
  
  // VIN can only contain alphanumeric characters, and cannot contain I, O, or Q
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  return validChars.test(vin);
}

/**
 * Validates a VIN and returns a validation error message if invalid
 * @param vin The VIN to validate
 * @returns {string|null} An error message if the VIN is invalid, null otherwise
 */
export function validateVIN(vin: string): string | null {
  if (!vin) {
    return 'VIN is required';
  }
  
  if (vin.length !== 17) {
    return 'VIN must be 17 characters';
  }
  
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return 'VIN can only contain alphanumeric characters and cannot contain I, O, or Q';
  }
  
  return null;
}

/**
 * Enhanced VIN validation with detailed feedback
 * @param vin The VIN to validate
 * @returns {Object} An object with validation result and error message
 */
export function validateVin(vin: string): { valid: boolean; message?: string } {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }
  
  if (vin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }
  
  // Check for I, O, Q which are not allowed in VINs
  if (/[IOQ]/i.test(vin)) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }
  
  // Check for valid characters
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return { valid: false, message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9' };
  }
  
  return { valid: true };
}

/**
 * Check Digit Validation according to VIN standards
 * @param vin The VIN to validate the check digit for
 * @returns {boolean} True if the check digit is valid
 */
export function validateVinCheckDigit(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;
  
  // Transliteration values for each character position
  const transliterationValues: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };
  
  // Weight values for each position
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Get the check digit (9th position, index 8)
  const checkDigit = vin.charAt(8).toUpperCase();
  
  // Calculate sum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = transliterationValues[char] || 0;
    sum += value * weights[i];
  }
  
  // Calculate the remainder
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();
  
  // Compare with actual check digit
  return checkDigit === expectedCheckDigit;
}
