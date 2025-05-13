
/**
 * Formats a VIN by adding spacing for better readability
 * @param vin The Vehicle Identification Number to format
 * @returns A formatted VIN string
 */
export const formatVin = (vin: string): string => {
  // Remove any non-alphanumeric characters
  const cleaned = vin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // If we have a standard 17-character VIN, format it into groups
  if (cleaned.length === 17) {
    // Group by WMI (3) - VDS (6) - VIS (8)
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 9)}-${cleaned.slice(9)}`;
  }
  
  // Return original if it's not a standard length
  return cleaned;
};
