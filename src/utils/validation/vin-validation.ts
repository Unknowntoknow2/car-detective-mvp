
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
