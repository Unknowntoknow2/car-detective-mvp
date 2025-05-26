
// VIN validation utilities with check digit verification
export interface VinValidationResult {
  isValid: boolean;
  error?: string;
}

// VIN character weights for check digit calculation
const VIN_WEIGHTS: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
  'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
};

// Position weights for check digit calculation
const POSITION_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Basic VIN format validation
 */
export function isValidVIN(vin: string): boolean {
  if (!vin || typeof vin !== 'string') return false;
  
  // VIN must be exactly 17 characters
  if (vin.length !== 17) return false;
  
  // VIN cannot contain I, O, or Q
  if (/[IOQ]/.test(vin.toUpperCase())) return false;
  
  // VIN must be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return false;
  
  return true;
}

/**
 * Comprehensive VIN validation with detailed error messages
 */
export function validateVIN(vin: string): VinValidationResult {
  // Check if VIN is provided
  if (!vin) {
    return { isValid: false, error: 'VIN is required' };
  }

  // Check if VIN is a string
  if (typeof vin !== 'string') {
    return { isValid: false, error: 'VIN must be a string' };
  }

  const cleanVin = vin.trim().toUpperCase();

  // Check length
  if (cleanVin.length !== 17) {
    return { 
      isValid: false, 
      error: `VIN must be exactly 17 characters (currently ${cleanVin.length})` 
    };
  }

  // Check for invalid characters (I, O, Q are not allowed)
  if (/[IOQ]/.test(cleanVin)) {
    return { 
      isValid: false, 
      error: 'VIN contains invalid characters (I, O, Q are not allowed)' 
    };
  }

  // Check for valid alphanumeric characters only
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return { 
      isValid: false, 
      error: 'VIN contains invalid characters (only letters A-Z except O,I,Q and numbers 0-9 are allowed)' 
    };
  }

  // Validate check digit
  if (!validateVinCheckDigit(cleanVin)) {
    return { 
      isValid: false, 
      error: 'Invalid VIN check digit' 
    };
  }

  return { isValid: true };
}

/**
 * Validate VIN check digit (9th position)
 */
export function validateVinCheckDigit(vin: string): boolean {
  if (!vin || vin.length !== 17) return false;
  
  const cleanVin = vin.toUpperCase();
  let sum = 0;
  
  // Calculate weighted sum
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip check digit position
    
    const char = cleanVin[i];
    const weight = VIN_WEIGHTS[char];
    const positionWeight = POSITION_WEIGHTS[i];
    
    // Check if character exists in weights
    if (weight === undefined) return false;
    
    sum += weight * positionWeight;
  }
  
  // Calculate check digit
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();
  
  return cleanVin[8] === expectedCheckDigit;
}

/**
 * Extract year from VIN (10th position)
 */
export function getYearFromVin(vin: string): number | null {
  if (!isValidVIN(vin)) return null;
  
  const yearCode = vin[9];
  const yearMap: Record<string, number> = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
    'S': 2025, 'T': 2026, 'U': 2027, 'V': 2028, 'W': 2029,
    'X': 2030, 'Y': 2031, 'Z': 2032
  };
  
  return yearMap[yearCode] || null;
}

/**
 * Format VIN for display (adds spaces for readability)
 */
export function formatVIN(vin: string): string {
  if (!vin) return '';
  const cleanVin = vin.replace(/\s/g, '').toUpperCase();
  if (cleanVin.length !== 17) return vin;
  
  return `${cleanVin.slice(0, 3)} ${cleanVin.slice(3, 6)} ${cleanVin.slice(6, 11)} ${cleanVin.slice(11)}`;
}

/**
 * Clean VIN input (remove spaces, convert to uppercase)
 */
export function cleanVIN(vin: string): string {
  return vin.replace(/\s/g, '').toUpperCase();
}
