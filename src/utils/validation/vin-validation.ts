
/**
 * Validates a Vehicle Identification Number (VIN)
 * @param vin The VIN to validate
 * @returns An object containing isValid (boolean) and error (string if invalid)
 */
export function validateVin(vin: string): { isValid: boolean; error: string | null } {
  // Check if VIN is provided
  if (!vin || vin.trim() === '') {
    return { isValid: false, error: 'VIN is required' };
  }

  // Check for correct length (17 characters)
  if (vin.length !== 17) {
    return {
      isValid: false,
      error: `VIN must be exactly 17 characters (currently ${vin.length})`
    };
  }

  // Check for valid characters (exclude O, I, Q as they're not valid in modern VINs)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin)) {
    return {
      isValid: false,
      error: 'VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)'
    };
  }
  
  // Check the VIN check digit
  const isCheckDigitValid = validateVinCheckDigit(vin);
  if (!isCheckDigitValid) {
    return {
      isValid: false,
      error: 'Invalid VIN check digit - this VIN appears to be incorrectly formatted'
    };
  }

  // Check for proper year character
  const yearChar = vin.charAt(9);
  if (!isValidYearChar(yearChar)) {
    return {
      isValid: false,
      error: 'Invalid year character in VIN position 10'
    };
  }

  // All checks passed
  return { isValid: true, error: null };
}

/**
 * Validates the check digit (9th position) of a VIN
 * @param vin The VIN to validate
 * @returns Boolean indicating if the check digit is valid
 */
export function validateVinCheckDigit(vin: string): boolean {
  if (vin.length !== 17) return false;
  
  // Weights for each position in the VIN
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Transliteration values for characters
  const transliterationValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };
  
  // Check digit (position 9)
  const checkDigit = vin.charAt(8);
  let checkDigitValue = checkDigit === 'X' ? 10 : parseInt(checkDigit, 10);
  
  // Calculate the weighted sum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i !== 8) { // Skip the check digit position
      const char = vin.charAt(i).toUpperCase();
      const value = transliterationValues[char] || 0;
      sum += value * weights[i];
    }
  }
  
  // Calculate the remainder
  const remainder = sum % 11;
  
  // Compare with check digit
  return remainder === checkDigitValue;
}

/**
 * Checks if a character is a valid VIN year character
 * @param char The character to check
 * @returns Boolean indicating if it's a valid year character
 */
function isValidYearChar(char: string): boolean {
  // Valid year characters for modern VINs
  const validYearChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return validYearChars.includes(char.toUpperCase());
}
