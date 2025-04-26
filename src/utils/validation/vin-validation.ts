
// VIN validation rules based on ISO 3779 standard
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) {
    return { isValid: false, error: "VIN is required" };
  }

  if (vin.length !== 17) {
    return { isValid: false, error: "VIN must be exactly 17 characters" };
  }

  // Check for valid characters (no I,O,Q)
  if (/[IOQ]/.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN cannot contain letters I, O, or Q" };
  }

  // Basic format validation (alphanumeric only)
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN can only contain letters A-H, J-N, P, R-Z and numbers" };
  }

  return { isValid: true };
}

