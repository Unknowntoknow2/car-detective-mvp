/**
 * Location-based adjustment calculator
 * Adjusts vehicle value based on geographic location
 */

<<<<<<< HEAD
interface ZipAdjustmentMap {
  [zipCode: string]: number;
}
=======
import { supabase } from "@/integrations/supabase/client";
import { getMarketMultiplier } from "../valuation/marketData";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Sample ZIP code adjustments (percentage multipliers)
// In a real implementation, this would be fetched from a database
const zipAdjustments: ZipAdjustmentMap = {
  // High-value areas (positive adjustment)
  '90210': 0.08, // Beverly Hills
  '94027': 0.07, // Atherton
  '10007': 0.06, // Manhattan
  '33109': 0.05, // Miami Beach
  
  // Medium-value areas (slight adjustment)
  '60611': 0.03, // Chicago
  '98101': 0.02, // Seattle
  '80202': 0.01, // Denver
  
  // Average areas (no adjustment)
  '75001': 0,
  '27601': 0,
  '32801': 0,
  
  // Low-value areas (negative adjustment)
  '19901': -0.02, // Dover
  '59901': -0.03, // Kalispell
  '87501': -0.03, // Santa Fe
};

// Region mapping for display purposes
const zipRegions: {[key: string]: string} = {
  '9': 'California',
  '8': 'Mountain West',
  '7': 'Central Plains',
  '6': 'South Central',
  '5': 'Midwest',
  '4': 'Northeast',
  '3': 'Mid-Atlantic',
  '2': 'Southeast',
  '1': 'New England',
  '0': 'Northeast',
};

/**
 * Get the regional market multiplier based on ZIP code
 * @param zipCode ZIP code to check
 * @returns Market multiplier for the region (percentage as decimal)
 */
export function getRegionalMarketMultiplier(zipCode: string): number {
<<<<<<< HEAD
  if (!zipCode || zipCode.length < 1) return 0;
  
  // Get the first digit for regional assessment
  const regionDigit = zipCode.substring(0, 1);
  
  // Default regional multipliers (very simplified)
  const regionalDefaults: {[key: string]: number} = {
    '9': 0.05,  // West Coast premium
    '8': 0.02,  // Mountain West
    '7': 0.01,  // Central Plains
    '6': 0,     // South Central
    '5': 0,     // Midwest
    '4': 0.03,  // Northeast
    '3': 0.02,  // Mid-Atlantic
    '2': -0.01, // Southeast
    '1': 0.04,  // New England
    '0': 0.03,  // Northeast
  };
  
  return regionalDefaults[regionDigit] || 0;
=======
  if (!zipCode) return 0;

  // Check our sync cache first
  if (syncMarketMultiplierCache.has(zipCode)) {
    return syncMarketMultiplierCache.get(zipCode)! / 100;
  }

  // Since we can't do async here, return a default value
  // The async version should be preferred where possible
  console.log(
    `Using synchronous version of getRegionalMarketMultiplier for ${zipCode}. Consider using getRegionalMarketMultiplierAsync instead.`,
  );
  return 0; // Default value for synchronous contexts
}

/**
 * Gets the regional market multiplier asynchronously
 * @param zipCode The ZIP code where the vehicle is located
 * @returns A promise resolving to a multiplier to be applied to the base value
 */
export async function getRegionalMarketMultiplierAsync(
  zipCode: string,
): Promise<number> {
  if (!zipCode) return 0;

  try {
    // Use the shared market multiplier function
    const multiplierPercentage = await getMarketMultiplier(zipCode);

    // Update sync cache for future synchronous lookups
    syncMarketMultiplierCache.set(zipCode, multiplierPercentage);

    // Return the multiplier as a decimal (divide by 100)
    return multiplierPercentage / 100;
  } catch (error) {
    console.error("Exception fetching market multiplier:", error);
    return 0;
  }
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
    "102": "New York City",
    "900": "Los Angeles",
    "941": "San Francisco",
    "981": "Seattle",
    "331": "Miami",
    "021": "Boston",
    "606": "Chicago",
    "802": "Denver",
    "303": "Atlanta",
    "372": "Nashville",
    "972": "Portland",
    "787": "Austin",
    "482": "Detroit",
    "441": "Cleveland",
    "152": "Pittsburgh",
    "711": "Shreveport",
    "276": "Raleigh",
  };

  // Try to match the first 3 digits
  const zipPrefix = zipCode.substring(0, 3);
  return zipRegionMap[zipPrefix] || "Unknown Region";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

/**
 * Get the adjustment multiplier for a specific ZIP code
 * @param zipCode ZIP code
 * @returns Adjustment multiplier (percentage as decimal)
 */
export async function getZipMultiplier(zipCode: string): Promise<number> {
  // Check if we have a direct match
  if (zipAdjustments[zipCode]) {
    return zipAdjustments[zipCode];
  }
  
  // If no direct match, try to use the first 3 digits as a region approximation
  const regionPrefix = zipCode.substring(0, 3);
  const regionMatches = Object.keys(zipAdjustments).filter(zip => zip.startsWith(regionPrefix));
  
  if (regionMatches.length > 0) {
    // Average the adjustments for the matching region
    const avgAdjustment = regionMatches.reduce((sum, zip) => sum + zipAdjustments[zip], 0) / regionMatches.length;
    return avgAdjustment;
  }
  
  // If no region matches, use the first digit for a broader region match
  const broadRegionPrefix = zipCode.substring(0, 1);
  const broadRegionMatches = Object.keys(zipAdjustments).filter(zip => zip.startsWith(broadRegionPrefix));
  
  if (broadRegionMatches.length > 0) {
    // Average the adjustments for the broad region
    const avgAdjustment = broadRegionMatches.reduce((sum, zip) => sum + zipAdjustments[zip], 0) / broadRegionMatches.length;
    return avgAdjustment;
  }
  
  // Default: no adjustment
  return 0;
}

/**
 * Calculate the dollar amount adjustment based on ZIP code
 * @param zipCode ZIP code
 * @param basePrice Base price of the vehicle
 * @returns Dollar amount adjustment
 */
<<<<<<< HEAD
export async function getZipAdjustment(zipCode: string, basePrice: number): Promise<number> {
  const multiplier = await getZipMultiplier(zipCode);
  return Math.round(basePrice * multiplier);
}

/**
 * Get a human-readable region name from a ZIP code
 * @param zipCode ZIP code
 * @returns Region name
 */
export function getRegionNameFromZip(zipCode: string): string {
  const firstDigit = zipCode.substring(0, 1);
  return zipRegions[firstDigit] || 'United States';
=======
export async function getZipAdjustment(
  zipCode: string,
  basePrice: number,
): Promise<number> {
  const multiplier = await getRegionalMarketMultiplierAsync(zipCode);
  return basePrice * multiplier;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
