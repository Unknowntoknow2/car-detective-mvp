
/**
 * Validates a VIN (Vehicle Identification Number)
 * @param vin The VIN to validate
 * @returns An object with valid flag and optional error message
 */
export function validateVin(vin: string): { valid: boolean; message?: string } {
  // Normalize input by removing spaces and converting to uppercase
  vin = vin.replace(/\s/g, '').toUpperCase();
  
  // Basic length check
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }
  
  if (vin.length !== 17) {
    return { valid: false, message: 'VIN must be exactly 17 characters' };
  }
  
  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(vin)) {
    return { valid: false, message: 'VIN cannot contain letters I, O, or Q' };
  }
  
  // Character set validation (alphanumeric excluding I, O, Q)
  const validChars = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validChars.test(vin)) {
    return { valid: false, message: 'VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9' };
  }
  
  // Check the check digit (position 9) if available
  if (!validateVinCheckDigit(vin)) {
    return { valid: false, message: 'VIN check digit (position 9) is invalid' };
  }
  
  return { valid: true };
}

/**
 * Simple check if the string looks like a VIN
 * @param input String to check
 * @returns true if the string looks like a VIN
 */
export function isValidVIN(input: string): boolean {
  return validateVin(input).valid;
}

/**
 * Searches for a VIN-like pattern in a string
 * @param text Text to search for VIN patterns
 * @returns The first VIN-like string found or null
 */
export function extractVinFromText(text: string): string | null {
  // Normalize input by removing spaces and converting to uppercase
  const normalized = text.replace(/\s/g, '').toUpperCase();
  
  // Match VIN pattern (17 alphanumeric chars excluding I, O, Q)
  const vinPattern = /[A-HJ-NPR-Z0-9]{17}/;
  const match = normalized.match(vinPattern);
  
  return match ? match[0] : null;
}

/**
 * Validates the VIN check digit at position 9
 * @param vin The VIN to validate
 * @returns true if the check digit is valid
 */
export function validateVinCheckDigit(vin: string): boolean {
  // Normalize input
  vin = vin.replace(/\s/g, '').toUpperCase();
  
  if (vin.length !== 17) {
    return false;
  }
  
  // Define the transliteration values for each character
  const transliterationValues: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };
  
  // Define position weights
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Get the check digit (9th position, index 8)
  const checkDigit = vin.charAt(8);
  
  // Calculate the weighted sum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i !== 8) { // Skip the check digit position
      const char = vin.charAt(i);
      const value = transliterationValues[char];
      if (value === undefined) {
        return false; // Invalid character
      }
      sum += value * weights[i];
    }
  }
  
  // Calculate the expected check digit
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();
  
  // Compare with the actual check digit
  return checkDigit === expectedCheckDigit;
}

