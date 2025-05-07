
// VIN must be 17 characters, alphanumeric, excluding I, O, Q
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Checks whether a VIN string is valid based on standard VIN rules.
 * @param vin - The Vehicle Identification Number to validate
 * @returns true if valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  if (!vin) return false;
  return VIN_REGEX.test(vin.toUpperCase());
}
