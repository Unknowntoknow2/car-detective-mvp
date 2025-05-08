
import { isValidVIN as baseValidation } from './vin-validation';

/**
 * Enhanced VIN validation with additional features
 */
export const validateVinEnhanced = (vin: string): boolean => {
  // Use the base validation function
  return baseValidation(vin);
};

/**
 * Check if VIN meets standard requirements
 * - Must be 17 characters
 * - No I, O, or Q characters allowed
 * - Must be alphanumeric
 */
export const validateVinFormat = (vin: string): boolean => {
  if (!vin || vin.length !== 17) {
    return false;
  }

  // Check for prohibited letters (I, O, Q)
  if (/[IOQ]/.test(vin.toUpperCase())) {
    return false;
  }

  // Check if alphanumeric
  return /^[A-HJ-NPR-Z0-9]+$/.test(vin.toUpperCase());
};

/**
 * Get VIN validation error message
 */
export const getVinValidationError = (vin: string): string | null => {
  if (!vin) {
    return 'VIN is required';
  }
  
  if (vin.length !== 17) {
    return 'VIN must be exactly 17 characters';
  }
  
  if (/[IOQ]/.test(vin.toUpperCase())) {
    return 'VIN cannot contain the letters I, O, or Q';
  }
  
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin.toUpperCase())) {
    return 'VIN must contain only letters and numbers';
  }
  
  return null;
};

/**
 * Decodes a VIN to get basic manufacturer information
 */
export const decodeVinPrefix = (vin: string): { country: string; manufacturer: string } | null => {
  if (!baseValidation(vin)) {
    return null;
  }
  
  // This is a simplified implementation
  const wmi = vin.substring(0, 3).toUpperCase();
  
  // Maps for common World Manufacturer Identifiers
  const countryMap: Record<string, string> = {
    '1': 'United States',
    '2': 'Canada',
    '3': 'Mexico',
    'J': 'Japan',
    'K': 'Korea',
    'L': 'China',
    'S': 'United Kingdom',
    'V': 'France',
    'W': 'Germany',
    'Y': 'Sweden',
    'Z': 'Italy'
  };
  
  const manufacturerMap: Record<string, string> = {
    '1G': 'General Motors',
    '1J': 'Jeep',
    '1F': 'Ford',
    '2T': 'Toyota Canada',
    '3H': 'Honda Mexico',
    'JN': 'Nissan',
    'KM': 'Hyundai',
    'WA': 'Audi',
    'WB': 'BMW',
    'WD': 'Mercedes-Benz',
    'WV': 'Volkswagen'
  };
  
  const country = countryMap[wmi[0]] || 'Unknown';
  const manufacturer = manufacturerMap[wmi.substring(0, 2)] || 'Unknown';
  
  return { country, manufacturer };
};

// Export the base validation function as well for backward compatibility
export { baseValidation as isValidVIN };
