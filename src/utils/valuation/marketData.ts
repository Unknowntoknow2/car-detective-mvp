
import { supabase } from '@/integrations/supabase/client';

/**
 * Retrieves the market adjustment multiplier for a given ZIP code
 * @param zipCode The ZIP code to get the market multiplier for
 * @returns The market multiplier value (as a percentage, e.g., 3.5 means +3.5%)
 */
export async function getMarketMultiplier(zipCode: string): Promise<number> {
  try {
    if (!zipCode) {
      return 0;
    }
    
    const { data, error } = await supabase
      .from('market_adjustments')
      .select('market_multiplier')
      .eq('zip_code', zipCode)
      .single();
    
    if (error || !data) {
      console.error('Error fetching market multiplier:', error);
      return 0;
    }
    
    return data.market_multiplier;
  } catch (err) {
    console.error('Error in getMarketMultiplier:', err);
    return 0;
  }
}
