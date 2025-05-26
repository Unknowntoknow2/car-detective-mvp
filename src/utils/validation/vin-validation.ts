
export interface VinValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateVIN(vin: string): VinValidationResult {
  if (!vin) {
    return { isValid: false, error: 'VIN is required' };
  }

  // Remove spaces and convert to uppercase
  const cleanVin = vin.replace(/\s/g, '').toUpperCase();

  // Must be exactly 17 characters
  if (cleanVin.length !== 17) {
    return { isValid: false, error: 'VIN must be exactly 17 characters' };
  }

  // VIN characters: letters A-Z (excluding I, O, Q) and numbers 0-9
  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinPattern.test(cleanVin)) {
    return { isValid: false, error: 'Invalid VIN format. VIN cannot contain I, O, or Q' };
  }

  return { isValid: true };
}

export function formatVinInput(input: string): string {
  // Remove invalid characters and convert to uppercase
  return input.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
}
