
export interface VinValidationResult {
  isValid: boolean;
  error?: string;
}

export function isValidVIN(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }

  // VIN should not contain I, O, or Q
  const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z0-9]{17}$/;
  return vinRegex.test(vin);
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

  if (!isValidVIN(vin)) {
    return {
      isValid: false,
      error: "Invalid VIN format (cannot contain I, O, or Q)"
    };
  }

  return {
    isValid: true
  };
}
