
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  error?: string;
}

export function validateVin(vin: string): ValidationResult {
  if (!vin) {
    return {
      isValid: false,
      message: 'VIN is required',
      error: 'VIN is required'
    };
  }

  if (vin.length !== 17) {
    return {
      isValid: false,
      message: 'VIN must be exactly 17 characters',
      error: 'VIN must be exactly 17 characters'
    };
  }

  // Check for invalid characters (I, O, Q are not allowed in VINs)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return {
      isValid: false,
      message: 'VIN contains invalid characters. I, O, and Q are not allowed.',
      error: 'VIN contains invalid characters'
    };
  }

  return {
    isValid: true,
    message: 'Valid VIN format'
  };
}

// Alias for backward compatibility
export const validateVIN = validateVin;
export const isValidVIN = (vin: string): boolean => validateVin(vin).isValid;
