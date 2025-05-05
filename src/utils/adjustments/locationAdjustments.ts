
/**
 * Location Adjustment Calculator
 * Calculates value adjustments based on regional market demand and location factors.
 */

/**
 * Sample regional market demand data
 * In a production environment, this would be fetched from a database or API
 * Values represent percentage adjustments to the base value
 */
const REGIONAL_MARKET_DATA: Record<string, number> = {
  // High demand areas (urban centers, affluent areas)
  '90210': 0.05,  // Beverly Hills
  '10001': 0.04,  // Manhattan
  '94102': 0.06,  // San Francisco
  '98101': 0.05,  // Seattle
  '33139': 0.04,  // Miami Beach
  '02108': 0.04,  // Boston
  
  // Moderate demand areas
  '80202': 0.02,  // Denver
  '30303': 0.01,  // Atlanta
  '37203': 0.01,  // Nashville
  '97204': 0.02,  // Portland
  '78701': 0.02,  // Austin
  
  // Low demand areas (economically challenged or oversaturated markets)
  '48226': -0.02, // Detroit
  '44101': -0.01, // Cleveland
  '15222': -0.01, // Pittsburgh
  '71101': -0.03, // Shreveport
  '27601': -0.01  // Raleigh
};

/**
 * Gets the regional market multiplier based on the vehicle's location
 * @param zipCode The ZIP code where the vehicle is located
 * @returns A multiplier to be applied to the base value
 */
export function getRegionalMarketMultiplier(zipCode: string): number {
  // First check for direct match
  if (REGIONAL_MARKET_DATA[zipCode]) {
    return REGIONAL_MARKET_DATA[zipCode];
  }
  
  // If no direct match, check first 3 digits (ZIP code region)
  const zipRegion = zipCode.substring(0, 3);
  
  // Look for any ZIP codes in our data that start with the same region
  for (const zip in REGIONAL_MARKET_DATA) {
    if (zip.startsWith(zipRegion)) {
      return REGIONAL_MARKET_DATA[zip];
    }
  }
  
  // Default adjustment is 0 (no adjustment) if no data is available
  return 0;
}

/**
 * Gets the region name from a ZIP code
 * This is a simplified implementation and would be replaced with a more comprehensive database in production
 * @param zipCode The ZIP code
 * @returns The name of the region
 */
export function getRegionNameFromZip(zipCode: string): string {
  // This would be replaced with a ZIP code to region name database
  const zipRegionMap: Record<string, string> = {
    '102': 'New York City',
    '900': 'Los Angeles',
    '941': 'San Francisco',
    '981': 'Seattle',
    '331': 'Miami',
    '021': 'Boston',
    '606': 'Chicago',
    '802': 'Denver',
    '303': 'Atlanta',
    '372': 'Nashville',
    '972': 'Portland',
    '787': 'Austin',
    '482': 'Detroit',
    '441': 'Cleveland',
    '152': 'Pittsburgh',
    '711': 'Shreveport',
    '276': 'Raleigh'
  };
  
  // Try to match the first 3 digits
  const zipPrefix = zipCode.substring(0, 3);
  return zipRegionMap[zipPrefix] || 'Unknown Region';
}

/**
 * Calculates the monetary adjustment based on ZIP code
 * @param zipCode The ZIP code
 * @param basePrice The base price of the vehicle
 * @returns Dollar amount adjustment based on location
 */
export function getZipAdjustment(zipCode: string, basePrice: number): number {
  const multiplier = getRegionalMarketMultiplier(zipCode);
  return basePrice * multiplier;
}
