
/**
 * Validates a Vehicle Identification Number (VIN)
 * @param vin - The VIN to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateVIN = (vin: string): { isValid: boolean; error?: string } => {
  // Check if VIN is empty
  if (!vin) {
    return {
      isValid: false,
      error: 'VIN is required'
    };
  }
  
  // Remove any spaces or special characters
  const cleanVin = vin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // Check if the VIN is exactly 17 characters
  if (cleanVin.length !== 17) {
    return {
      isValid: false,
      error: `VIN must be exactly 17 characters (currently ${cleanVin.length})`
    };
  }
  
  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(cleanVin)) {
    return {
      isValid: false,
      error: 'VIN contains invalid characters (I, O, Q are not used in VINs)'
    };
  }
  
  // Basic format validation - more complex validation could be added
  const validVinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validVinPattern.test(cleanVin)) {
    return {
      isValid: false,
      error: 'VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)'
    };
  }
  
  // Validate check digit
  if (!validateVinCheckDigit(cleanVin)) {
    return {
      isValid: false,
      error: 'VIN check digit (9th character) is invalid'
    };
  }
  
  return { isValid: true };
};

// Add camelCase alias for backward compatibility
export const validateVin = validateVIN;

/**
 * Validates the check digit (9th character) of a VIN
 * @param vin - The VIN to validate
 * @returns Boolean indicating if the check digit is valid
 */
export const validateVinCheckDigit = (vin: string): boolean => {
  if (!vin || vin.length !== 17) return false;
  
  // VIN check digit calculation algorithm
  // This is a simplified implementation for demo purposes
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const values: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };
  
  // Calculate weighted sum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin.charAt(i).toUpperCase();
    const value = values[char] || 0;
    sum += value * weights[i];
  }
  
  // Calculate check digit
  const mod = sum % 11;
  const checkDigit = mod === 10 ? 'X' : mod.toString();
  
  // Compare with actual check digit in VIN
  return checkDigit === vin.charAt(8).toUpperCase();
};

/**
 * Checks if a VIN is valid
 * @param vin - The VIN to check
 * @returns Boolean indicating if the VIN is valid
 */
export const isValidVIN = (vin: string): boolean => {
  return validateVIN(vin).isValid;
};
