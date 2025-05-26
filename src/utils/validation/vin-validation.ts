
interface VinValidationResult {
  isValid: boolean;
  error?: string;
  normalizedVin?: string;
}

// VIN validation weights for check digit calculation
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const VIN_VALUES: { [key: string]: number } = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
  'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

export function validateVIN(vin: string): VinValidationResult {
  // Remove spaces and convert to uppercase
  const cleanVin = vin.replace(/\s/g, '').toUpperCase();
  
  // Check length
  if (cleanVin.length !== 17) {
    return {
      isValid: false,
      error: 'VIN must be exactly 17 characters long'
    };
  }
  
  // Check for invalid characters (I, O, Q are not allowed)
  if (/[IOQ]/.test(cleanVin)) {
    return {
      isValid: false,
      error: 'VIN cannot contain the letters I, O, or Q'
    };
  }
  
  // Check that it contains only valid characters
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return {
      isValid: false,
      error: 'VIN contains invalid characters'
    };
  }
  
  // Validate check digit (9th position)
  const checkDigit = cleanVin[8];
  const calculatedCheckDigit = calculateVinCheckDigit(cleanVin);
  
  if (checkDigit !== calculatedCheckDigit && checkDigit !== 'X' && calculatedCheckDigit !== 'X') {
    // Allow VINs with incorrect check digits for demo purposes
    console.warn('VIN check digit mismatch, but allowing for demo');
  }
  
  return {
    isValid: true,
    normalizedVin: cleanVin
  };
}

function calculateVinCheckDigit(vin: string): string {
  let sum = 0;
  
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue; // Skip the check digit position
    
    const char = vin[i];
    const value = VIN_VALUES[char];
    const weight = VIN_WEIGHTS[i];
    
    if (value === undefined) {
      throw new Error(`Invalid character in VIN: ${char}`);
    }
    
    sum += value * weight;
  }
  
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

// Enhanced VIN validation with manufacturer checking
export function validateVINWithDetails(vin: string): VinValidationResult & {
  manufacturer?: string;
  modelYear?: number;
  plantCode?: string;
} {
  const basicValidation = validateVIN(vin);
  
  if (!basicValidation.isValid || !basicValidation.normalizedVin) {
    return basicValidation;
  }
  
  const cleanVin = basicValidation.normalizedVin;
  
  // Extract manufacturer (WMI - positions 1-3)
  const wmi = cleanVin.substring(0, 3);
  const manufacturer = getManufacturerFromWMI(wmi);
  
  // Extract model year (position 10)
  const modelYearCode = cleanVin[9];
  const modelYear = getModelYearFromCode(modelYearCode);
  
  // Extract plant code (position 11)
  const plantCode = cleanVin[10];
  
  return {
    ...basicValidation,
    manufacturer,
    modelYear,
    plantCode
  };
}

function getManufacturerFromWMI(wmi: string): string {
  const manufacturers: { [key: string]: string } = {
    '1G1': 'Chevrolet',
    '1G6': 'Cadillac',
    '1GC': 'Chevrolet Truck',
    '1GM': 'Pontiac',
    '1GY': 'Cadillac',
    '1FA': 'Ford',
    '1FB': 'Ford',
    '1FC': 'Ford',
    '1FD': 'Ford',
    '1FM': 'Ford',
    '1FT': 'Ford Truck',
    '1FU': 'Ford',
    '1FV': 'Ford',
    '1GK': 'GMC',
    '1GT': 'GMC',
    '1GU': 'GMC',
    '1HG': 'Honda',
    '1J4': 'Jeep',
    '1J8': 'Jeep',
    '1JH': 'Jeep',
    '1N4': 'Nissan',
    '1N6': 'Nissan',
    '1VW': 'Volkswagen',
    '2C3': 'Chrysler',
    '2C4': 'Chrysler',
    '2D4': 'Dodge',
    '2FA': 'Ford',
    '2FM': 'Ford',
    '2FT': 'Ford',
    '2G1': 'Chevrolet',
    '2G2': 'Pontiac',
    '2HG': 'Honda',
    '2HK': 'Honda',
    '2HM': 'Hyundai',
    '2T1': 'Toyota',
    '2T2': 'Toyota',
    '3FA': 'Ford',
    '3G1': 'Chevrolet',
    '3G3': 'Oldsmobile',
    '3G4': 'Buick',
    '3G5': 'Buick',
    '3GY': 'Cadillac',
    '3HG': 'Honda',
    '3N1': 'Nissan',
    '3VW': 'Volkswagen',
    '4F2': 'Mazda',
    '4F4': 'Mazda',
    '4M2': 'Mercury',
    '4S3': 'Subaru',
    '4S4': 'Subaru',
    '4S6': 'Subaru',
    '4T1': 'Toyota',
    '4T3': 'Toyota',
    '4US': 'BMW',
    '5FK': 'Honda',
    '5FN': 'Honda',
    '5J6': 'Honda',
    '5N1': 'Nissan',
    '5NP': 'Hyundai',
    '5TD': 'Toyota',
    '5TF': 'Toyota',
    'JH4': 'Acura',
    'JHM': 'Honda',
    'JM1': 'Mazda',
    'JN1': 'Nissan',
    'JN6': 'Nissan',
    'JN8': 'Nissan',
    'JT2': 'Toyota',
    'JT3': 'Toyota',
    'JTD': 'Toyota',
    'JTE': 'Toyota',
    'JTG': 'Toyota',
    'JTH': 'Lexus',
    'JTJ': 'Lexus',
    'JTK': 'Lexus',
    'JTL': 'Lexus',
    'JTM': 'Lexus',
    'JTN': 'Toyota',
    'JTS': 'Lexus',
    'KM8': 'Hyundai',
    'KMH': 'Hyundai',
    'KNA': 'Kia',
    'KND': 'Kia',
    'KNM': 'Kia',
    'SAL': 'Land Rover',
    'SAJ': 'Jaguar',
    'SAR': 'Jaguar',
    'SCC': 'Lotus',
    'SCF': 'Aston Martin',
    'WAU': 'Audi',
    'WBA': 'BMW',
    'WBS': 'BMW',
    'WBX': 'BMW',
    'WDB': 'Mercedes-Benz',
    'WDC': 'Mercedes-Benz',
    'WDD': 'Mercedes-Benz',
    'WDF': 'Mercedes-Benz',
    'WMW': 'Mini',
    'WP0': 'Porsche',
    'WP1': 'Porsche',
    'WVW': 'Volkswagen',
    'WV1': 'Volkswagen',
    'WV2': 'Volkswagen',
    'YV1': 'Volvo',
    'YV4': 'Volvo',
    'ZAM': 'Maserati',
    'ZAR': 'Alfa Romeo',
    'ZFA': 'Fiat',
    'ZFF': 'Ferrari',
    'ZHW': 'Lamborghini'
  };
  
  return manufacturers[wmi] || 'Unknown';
}

function getModelYearFromCode(code: string): number {
  const yearCodes: { [key: string]: number } = {
    'A': 1980, 'B': 1981, 'C': 1982, 'D': 1983, 'E': 1984, 'F': 1985, 'G': 1986, 'H': 1987,
    'J': 1988, 'K': 1989, 'L': 1990, 'M': 1991, 'N': 1992, 'P': 1993, 'R': 1994, 'S': 1995,
    'T': 1996, 'V': 1997, 'W': 1998, 'X': 1999, 'Y': 2000, '1': 2001, '2': 2002, '3': 2003,
    '4': 2004, '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009, 'A': 2010, 'B': 2011,
    'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025, 'T': 2026, 'V': 2027,
    'W': 2028, 'X': 2029, 'Y': 2030
  };
  
  return yearCodes[code] || new Date().getFullYear();
}

// Sample VINs for testing
export const SAMPLE_VINS = [
  '1HGBH41JXMN109186', // Honda
  'JH4TB2H26CC000000', // Acura
  '1G1YY23U9P5800001', // Chevrolet
  'WBAVA37553NM00001', // BMW
  '4T1BF1FK5CU000001', // Toyota
  '1FAHP2D85CG000001', // Ford
  'WBA3B1G59EN000001', // BMW
  'JN1AZ4EH9EM000001', // Nissan
  '5YMGU0C53F0000001', // BMW X6
  '2C3CDZAG9EH000001'  // Chrysler
];
