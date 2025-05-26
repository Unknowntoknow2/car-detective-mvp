
export interface VinValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateVIN(vin: string): VinValidationResult {
  if (!vin) {
    return { isValid: false, error: 'VIN is required' };
  }

  // Remove spaces and convert to uppercase
  const cleanVin = vin.replace(/\s/g, '').toUpperCase();

  // Must be exactly 17 characters
  if (cleanVin.length !== 17) {
    return { isValid: false, error: `VIN must be exactly 17 characters (currently ${cleanVin.length})` };
  }

  // VIN characters: letters A-Z (excluding I, O, Q) and numbers 0-9
  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinPattern.test(cleanVin)) {
    return { isValid: false, error: 'VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)' };
  }

  return { isValid: true };
}

export function formatVinInput(input: string): string {
  // Remove invalid characters and convert to uppercase
  return input.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
}

// Add the missing isValidVIN function that other files expect
export function isValidVIN(vin: string): boolean {
  const result = validateVIN(vin);
  return result.isValid;
}

// Add the missing validateVinCheckDigit function that tests expect
export function validateVinCheckDigit(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }

  const cleanVin = vin.toUpperCase();
  
  // VIN weight factors for positions 1-8 and 10-17 (position 9 is check digit)
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Character to number mapping for VIN
  const charToNum: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
    'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip check digit position
    
    const char = cleanVin[i];
    const value = charToNum[char];
    
    if (value === undefined) {
      return false; // Invalid character
    }
    
    sum += value * weights[i];
  }

  const checkDigit = sum % 11;
  const expectedCheckChar = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  return cleanVin[8] === expectedCheckChar;
}
