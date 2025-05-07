// src/utils/validation/vin-validation-helpers.ts
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export function isValidVIN(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;
  return VIN_REGEX.test(vin.toUpperCase());
}

export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) return { isValid: false, error: "VIN is required" };
  if (vin.length !== 17) return { isValid: false, error: "VIN must be exactly 17 characters" };
  if (/[IOQ]/.test(vin.toUpperCase())) return { isValid: false, error: "VIN cannot contain I, O, or Q" };
  if (!VIN_REGEX.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN contains invalid characters" };
  }
  return { isValid: true };
}
