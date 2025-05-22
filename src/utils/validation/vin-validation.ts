
/**
 * Validates a Vehicle Identification Number (VIN)
 * @param vin - The VIN to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateVIN = (vin: string): { isValid: boolean; error?: string } => {
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
      error: 'VIN contains invalid characters'
    };
  }
  
  return { isValid: true };
};

/**
 * Checks if a VIN is valid
 * @param vin - The VIN to check
 * @returns Boolean indicating if the VIN is valid
 */
export const isValidVIN = (vin: string): boolean => {
  return validateVIN(vin).isValid;
};
