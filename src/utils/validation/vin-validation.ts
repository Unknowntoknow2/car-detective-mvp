<<<<<<< HEAD
=======
/**
 * Validates a Vehicle Identification Number (VIN)
 * @param vin The VIN to validate
 * @returns An object containing isValid (boolean) and error (string if invalid)
 */
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface VinValidationResult {
  isValid: boolean;
  error?: string;
}

<<<<<<< HEAD
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
=======
export function validateVin(vin: string): VinValidationResult {
  // Remove any whitespace
  const trimmedVin = vin.trim().toUpperCase();

  // Basic validation: VIN should be 17 characters long
  if (trimmedVin.length !== 17) {
    return {
      isValid: false,
      message: "VIN must be exactly 17 characters",
    };
  }

  // Check for invalid characters
  const validChars = /^[A-HJ-NPR-Z0-9]+$/; // excludes I, O, Q
  if (!validChars.test(trimmedVin)) {
    return {
      isValid: false,
      message: "VIN contains invalid characters",
    };
  }

  // Additional checks could be implemented here
  // - Check digit validation
  // - Year validation
  // - Manufacturer code validation

  return {
    isValid: true,
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD
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

=======
  if (vin.length !== 17) return false;

  // Weights for each position in the VIN
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  // Transliteration values for characters
  const transliterationValues: { [key: string]: number } = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4,
    "E": 5,
    "F": 6,
    "G": 7,
    "H": 8,
    "J": 1,
    "K": 2,
    "L": 3,
    "M": 4,
    "N": 5,
    "P": 7,
    "R": 9,
    "S": 2,
    "T": 3,
    "U": 4,
    "V": 5,
    "W": 6,
    "X": 7,
    "Y": 8,
    "Z": 9,
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
  };

  // Check digit (position 9)
  const checkDigit = vin.charAt(8);
  let checkDigitValue = checkDigit === "X" ? 10 : parseInt(checkDigit, 10);

  // Calculate the weighted sum
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD

  const checkDigit = sum % 11;
  const expectedCheckChar = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  return cleanVin[8] === expectedCheckChar;
=======

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
  const validYearChars = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "R",
    "S",
    "T",
    "V",
    "W",
    "X",
    "Y",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  return validYearChars.includes(char.toUpperCase());
}

/**
 * Simple VIN validation function (without detailed error messages)
 * @param vin The VIN to validate
 * @returns Boolean indicating if the VIN is valid
 */
export function isValidVIN(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;

  // Check for valid characters (exclude O, I, Q as they're not valid in modern VINs)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin)) return false;

  // For basic validation, we could just check the format,
  // but for enhanced security, also validate the check digit
  return validateVinCheckDigit(vin);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
