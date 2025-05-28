
interface ManualVehicleInput {
  make: string;
  model: string;
  year: number;
  mileage?: number;
}

/**
 * Generates a synthetic VIN from manual vehicle input
 * This is a placeholder until we have proper VIN generation or lookup
 */
export function generateVinFromManualInput(input: ManualVehicleInput): string {
  const { make, model, year } = input;
  
  // Create a deterministic "VIN" based on the input
  // This is not a real VIN, but a consistent identifier for the vehicle
  
  // World Manufacturer Identifier (first 3 characters)
  const wmi = getWMIFromMake(make);
  
  // Vehicle Descriptor Section (characters 4-9)
  const vds = getVDSFromModel(model);
  
  // Vehicle Identifier Section (characters 10-17)
  const vis = getVISFromYear(year);
  
  const syntheticVin = wmi + vds + vis;
  
  console.log(`Generated synthetic VIN: ${syntheticVin} for ${year} ${make} ${model}`);
  
  return syntheticVin;
}

function getWMIFromMake(make: string): string {
  // Map common makes to their actual WMI codes
  const wmiMap: Record<string, string> = {
    'toyota': '1T0',
    'honda': '1HG',
    'ford': '1FA',
    'chevrolet': '1GC',
    'nissan': '1N4',
    'bmw': 'WBA',
    'mercedes': 'WDD',
    'audi': 'WAU',
    'volkswagen': 'WVW',
    'hyundai': 'KMH',
    'kia': 'KNA',
    'mazda': 'JM1',
    'subaru': 'JF1',
    'lexus': 'JTH',
    'acura': 'JH4',
    'infiniti': 'JNK',
    'volvo': 'YV1',
    'jeep': '1C4',
    'dodge': '1B3',
    'chrysler': '1C3',
    'cadillac': '1GY',
    'buick': '1G4',
    'gmc': '1GT',
    'lincoln': '1LN',
    'porsche': 'WP0',
    'tesla': '5YJ',
  };
  
  const normalizedMake = make.toLowerCase().trim();
  return wmiMap[normalizedMake] || '1XX'; // Default fallback
}

function getVDSFromModel(model: string): string {
  // Generate a 6-character code based on the model name
  const modelCode = model.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3).padEnd(3, 'X');
  
  // Add some deterministic characters
  const hash = model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const additional = String(hash % 1000).padStart(3, '0');
  
  return modelCode + additional;
}

function getVISFromYear(year: number): string {
  // Year code (10th character)
  const yearCode = getYearCode(year);
  
  // Plant code (11th character) - use 'A' as default
  const plantCode = 'A';
  
  // Sequential number (characters 12-17) - generate based on year
  const sequential = String((year * 13) % 1000000).padStart(6, '0');
  
  return yearCode + plantCode + sequential;
}

function getYearCode(year: number): string {
  // VIN year codes follow a specific pattern
  const yearCodes: Record<number, string> = {
    2024: 'R', 2023: 'P', 2022: 'N', 2021: 'M', 2020: 'L',
    2019: 'K', 2018: 'J', 2017: 'H', 2016: 'G', 2015: 'F',
    2014: 'E', 2013: 'D', 2012: 'C', 2011: 'B', 2010: 'A',
    2009: '9', 2008: '8', 2007: '7', 2006: '6', 2005: '5',
    2004: '4', 2003: '3', 2002: '2', 2001: '1', 2000: 'Y',
    1999: 'X', 1998: 'W', 1997: 'V', 1996: 'T', 1995: 'S',
    1994: 'R', 1993: 'P', 1992: 'N', 1991: 'M', 1990: 'L',
    1989: 'K', 1988: 'J', 1987: 'H', 1986: 'G', 1985: 'F',
    1984: 'E', 1983: 'D', 1982: 'C', 1981: 'B', 1980: 'A'
  };
  
  return yearCodes[year] || 'X'; // Default fallback
}
