/**
 * Market Adjustment Data Service
 * 
 * Provides real-time market multipliers for different ZIP codes
 * for accurate regional car valuation adjustments.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the market multiplier for a given ZIP code from the database
 * @param zipCode The ZIP code to look up
 * @returns The market multiplier as a percentage
 */
export async function getMarketMultiplier(zipCode: string): Promise<number> {
  if (!zipCode) return 0;
  
  try {
    const { data, error } = await supabase
      .from('market_adjustments')
      .select('market_multiplier')
      .eq('zip_code', zipCode)
      .single();
    
    if (error) {
      console.error('Error fetching market multiplier:', error);
      return 0;
    }
    
    return data?.market_multiplier || 0;
  } catch (error) {
    console.error('Exception fetching market multiplier:', error);
    return 0;
  }
}

/**
 * Gets the top ZIP codes with the highest market multipliers
 * @param limit Number of ZIP codes to return
 * @returns Array of ZIP codes and their multipliers
 */
export async function getHotMarkets(limit: number = 5): Promise<{ zipCode: string; multiplier: number }[]> {
  try {
    const { data, error } = await supabase
      .from('market_adjustments')
      .select('zip_code, market_multiplier')
      .order('market_multiplier', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching hot markets:', error);
      return [];
    }
    
    return data.map(item => ({
      zipCode: item.zip_code,
      multiplier: item.market_multiplier
    }));
  } catch (error) {
    console.error('Exception fetching hot markets:', error);
    return [];
  }
}

/**
 * Calculates the regional market adjustment for a vehicle
 * @param zipCode Vehicle location ZIP code
 * @param baseValue Base market value of the vehicle
 * @returns Precise dollar amount adjustment for regional market
 */
export async function calculateRegionalAdjustment(zipCode: string, baseValue: number): Promise<number> {
  const multiplier = await getMarketMultiplier(zipCode);
  return baseValue * (multiplier / 100);
}
