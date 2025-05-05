
/**
 * Market Adjustment Data Service
 * 
 * Provides precise market multipliers for different ZIP codes
 * for accurate regional car valuation adjustments.
 */

/**
 * Sample ZIP code market multipliers
 * In production, this data would be retrieved from a database
 */
export const marketMultipliers: Record<string, number> = {
  '94016': 4.5,  // San Francisco Bay Area
  '90001': 3.0,  // Los Angeles
  '10001': 2.5,  // New York City
  '75001': 1.0,  // Dallas
  '98101': 3.2,  // Seattle
  '60601': 2.0,  // Chicago
  '33101': 1.5,  // Miami
  '02108': 2.3,  // Boston
  '80202': 1.8,  // Denver
  '20001': 2.2   // Washington DC
};

/**
 * Gets the exact market multiplier for a given ZIP code
 * @param zipCode The ZIP code to look up
 * @returns The market multiplier as a percentage
 */
export function getMarketMultiplier(zipCode: string): number {
  return marketMultipliers[zipCode] ?? 0; // Default to 0% if ZIP not found
}

/**
 * Gets the top ZIP codes with the highest market multipliers
 * @param limit Number of ZIP codes to return
 * @returns Array of ZIP codes and their multipliers
 */
export function getHotMarkets(limit: number = 5): { zipCode: string; multiplier: number }[] {
  return Object.entries(marketMultipliers)
    .map(([zipCode, multiplier]) => ({ zipCode, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, limit);
}

/**
 * Calculates the regional market adjustment for a vehicle
 * @param zipCode Vehicle location ZIP code
 * @param baseValue Base market value of the vehicle
 * @returns Precise dollar amount adjustment for regional market
 */
export function calculateRegionalAdjustment(zipCode: string, baseValue: number): number {
  const multiplier = getMarketMultiplier(zipCode);
  return baseValue * (multiplier / 100);
}
