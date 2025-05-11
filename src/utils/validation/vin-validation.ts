
/**
 * Basic validation for VIN (Vehicle Identification Number)
 */
export function validateVin(vin: string): { valid: boolean; message?: string } {
  if (!vin) {
    return { valid: false, message: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { valid: false, message: 'VIN must be 17 characters long' };
  }

  // VINs should not contain I, O, or Q
  if (/[IOQ]/i.test(vin)) {
    return { valid: false, message: 'VIN cannot contain the letters I, O, or Q' };
  }

  // VINs should only contain alphanumeric characters
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) {
    return { valid: false, message: 'VIN can only contain alphanumeric characters' };
  }

  return { valid: true };
}

/**
 * Simple check for whether a VIN is valid (without detailed error message)
 */
export function isValidVIN(vin: string): boolean {
  return validateVin(vin).valid;
}
