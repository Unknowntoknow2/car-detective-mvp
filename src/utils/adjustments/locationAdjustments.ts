
/**
 * Location Adjustment Calculator
 * Calculates value adjustments based on regional market demand and location factors.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the regional market multiplier based on the vehicle's location
 * This synchronous version is used in flow that cannot be async
 * @param zipCode The ZIP code where the vehicle is located
 * @returns A multiplier to be applied to the base value
 */
export function getRegionalMarketMultiplier(zipCode: string): number {
  if (!zipCode) return 0;
  
  // Since we can't do async here, return a default value
  // The async version should be preferred where possible
  console.log(`Using synchronous version of getRegionalMarketMultiplier for ${zipCode}. Consider using getRegionalMarketMultiplierAsync instead.`);
  return 0; // Default value for synchronous contexts
}

/**
 * Gets the regional market multiplier asynchronously
 * @param zipCode The ZIP code where the vehicle is located
 * @returns A promise resolving to a multiplier to be applied to the base value
 */
export async function getRegionalMarketMultiplierAsync(zipCode: string): Promise<number> {
  if (!zipCode) return 0;
  
  try {
    // Fetch multiplier from Supabase market_adjustments table
    const { data, error } = await supabase
      .from('market_adjustments')
      .select('market_multiplier')
      .eq('zip_code', zipCode)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching market multiplier:', error);
      return 0;
    }
    
    // Return the multiplier if found, otherwise return 0
    return data?.market_multiplier ? data.market_multiplier / 100 : 0;
  } catch (error) {
    console.error('Exception fetching market multiplier:', error);
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
export async function getZipAdjustment(zipCode: string, basePrice: number): Promise<number> {
  const multiplier = await getRegionalMarketMultiplierAsync(zipCode);
  return basePrice * multiplier;
}
