
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  error?: string;
}

export function validateVin(vin: string): boolean {
  if (!vin || typeof vin !== 'string') return false;
  if (vin.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}

export function isValidVIN(vin: string): boolean {
  return validateVin(vin);
}

export const validateVIN = validateVin; // Alias for backwards compatibility
