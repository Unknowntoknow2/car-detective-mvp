
export function isValidVIN(vin: string): boolean {
  // Basic VIN validation - 17 characters, alphanumeric except for I, O, Q
  if (!vin || vin.length !== 17) {
    return false;
  }
  
  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(vin)) {
    return false;
  }
  
  // Check for valid alphanumeric characters
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export interface VinValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateVin(vin: string): VinValidationResult {
  if (!vin) {
    return { 
      isValid: false, 
      error: "VIN is required" 
    };
  }
  
  if (vin.length !== 17) {
    return { 
      isValid: false, 
      error: "VIN must be exactly 17 characters" 
    };
  }
  
  if (/[IOQ]/.test(vin)) {
    return { 
      isValid: false, 
      error: "VIN cannot contain letters I, O, or Q" 
    };
  }
  
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { 
      isValid: false, 
      error: "VIN can only contain letters A-H, J-N, P, R-Z and numbers 0-9" 
    };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates the VIN check digit (position 9)
 * This is a more advanced validation that checks if the 9th character matches the
 * calculated check digit based on the other characters in the VIN
 */
export function validateVinCheckDigit(vin: string): boolean {
  if (!isValidVIN(vin)) {
    return false;
  }
  
  // Character values for check digit calculation
  const values: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };
  
  // Weights for each position
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i !== 8) { // Skip check digit position
      const char = vin.charAt(i);
      sum += values[char] * weights[i];
    }
  }
  
  // Calculate mod 11
  const remainder = sum % 11;
  
  // Expected check digit
  const checkDigit = remainder === 10 ? 'X' : remainder.toString();
  
  // Compare with actual check digit (position 9)
  return vin.charAt(8) === checkDigit;
}
