
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
    return { valid: false, message: 'VIN can only contain letters A-Z (except I,O,Q) and numbers 0-9' };
  }
  
  // Basic checksum validation - this would be more comprehensive in a production app
  // but for demo purposes we'll return valid if it passes the basic checks
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
