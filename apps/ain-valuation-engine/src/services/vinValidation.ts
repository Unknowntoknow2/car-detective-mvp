/**
 * VIN Validation Utilities
 * Provides comprehensive VIN format and checksum validation
 */

export interface VinValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    format: boolean;
    checksum: boolean;
    length: boolean;
    characters: boolean;
  };
}

/**
 * VIN check digit weights for validation
 */
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Valid VIN characters and their numeric values for checksum calculation
 */
const VIN_VALUES: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
  'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9, 'S': 2, 'T': 3, 'U': 4,
  'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

/**
 * Characters that are NOT allowed in VINs (I, O, Q)
 */
const INVALID_VIN_CHARS = /[IOQ]/i;

/**
 * Valid VIN character pattern (17 alphanumeric, excluding I, O, Q)
 */
const VALID_VIN_PATTERN = /^[ABCDEFGHJKLMNPRSTUVWXYZ0-9]{17}$/;

/**
 * Validates a VIN for proper format and checksum
 * @param vin - The VIN to validate
 * @returns Validation result with details
 */
export function validateVIN(vin: string): VinValidationResult {
  if (!vin || typeof vin !== 'string') {
    return {
      valid: false,
      error: 'VIN must be a non-empty string',
      details: { format: false, checksum: false, length: false, characters: false }
    };
  }

  const cleanVin = vin.trim().toUpperCase();
  
  // Check length
  const lengthValid = cleanVin.length === 17;
  if (!lengthValid) {
    return {
      valid: false,
      error: `VIN must be exactly 17 characters, got ${cleanVin.length}`,
      details: { format: false, checksum: false, length: false, characters: false }
    };
  }

  // Check for invalid characters (I, O, Q)
  const hasInvalidChars = INVALID_VIN_CHARS.test(cleanVin);
  if (hasInvalidChars) {
    return {
      valid: false,
      error: 'VIN contains invalid characters (I, O, Q are not allowed)',
      details: { format: false, checksum: false, length: true, characters: false }
    };
  }

  // Check overall character pattern
  const charactersValid = VALID_VIN_PATTERN.test(cleanVin);
  if (!charactersValid) {
    return {
      valid: false,
      error: 'VIN contains invalid characters or format',
      details: { format: false, checksum: false, length: true, characters: false }
    };
  }

  // Calculate and verify checksum (9th digit)
  const checksumValid = validateVinChecksum(cleanVin);
  if (!checksumValid) {
    return {
      valid: false,
      error: 'VIN checksum is invalid (9th digit does not match calculated value)',
      details: { format: false, checksum: false, length: true, characters: true }
    };
  }

  return {
    valid: true,
    details: { format: true, checksum: true, length: true, characters: true }
  };
}

/**
 * Validates the VIN checksum (9th digit)
 * @param vin - 17-character VIN (already validated for length and characters)
 * @returns true if checksum is valid
 */
function validateVinChecksum(vin: string): boolean {
  try {
    let sum = 0;
    
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = VIN_VALUES[char];
      
      if (value === undefined) {
        return false; // Invalid character
      }
      
      sum += value * VIN_WEIGHTS[i];
    }
    
    const calculatedCheckDigit = sum % 11;
    const actualCheckDigit = vin[8]; // 9th position (0-indexed)
    
    // Check digit can be 0-9 or X (representing 10)
    const expectedCheckDigit = calculatedCheckDigit === 10 ? 'X' : calculatedCheckDigit.toString();
    
    return actualCheckDigit === expectedCheckDigit;
  } catch (error) {
    return false;
  }
}

/**
 * Quick VIN format validation (without checksum)
 * Useful for preliminary checks before making API calls
 * @param vin - The VIN to validate
 * @returns true if VIN format is valid
 */
export function isValidVinFormat(vin: string): boolean {
  if (!vin || typeof vin !== 'string') return false;
  
  const cleanVin = vin.trim().toUpperCase();
  return cleanVin.length === 17 && 
         VALID_VIN_PATTERN.test(cleanVin) && 
         !INVALID_VIN_CHARS.test(cleanVin);
}

/**
 * Extracts VIN components for analysis
 * @param vin - Validated VIN
 * @returns VIN components
 */
export function parseVinComponents(vin: string) {
  const cleanVin = vin.trim().toUpperCase();
  
  return {
    wmi: cleanVin.substring(0, 3),    // World Manufacturer Identifier
    vds: cleanVin.substring(3, 9),    // Vehicle Descriptor Section
    checkDigit: cleanVin[8],          // Check digit
    vis: cleanVin.substring(9, 17),   // Vehicle Identifier Section
    modelYear: cleanVin[9],           // Model year code
    plantCode: cleanVin[10],          // Manufacturing plant code
    serialNumber: cleanVin.substring(11, 17) // Serial number
  };
}

/**
 * Normalizes VIN input (trim, uppercase)
 * @param vin - Raw VIN input
 * @returns Normalized VIN
 */
export function normalizeVin(vin: string): string {
  return vin?.trim()?.toUpperCase() || '';
}
