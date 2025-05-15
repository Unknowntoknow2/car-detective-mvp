
/**
 * Formats a VIN (Vehicle Identification Number)
 * @param vin The VIN to format
 * @returns The formatted VIN
 */
export function formatVin(vin: string): string {
  if (!vin) return '';
  
  // Convert to uppercase and remove spaces
  return vin.toUpperCase().replace(/\s/g, '');
}
