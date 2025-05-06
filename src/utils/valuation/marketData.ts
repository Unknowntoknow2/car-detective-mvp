
import { supabase } from '@/integrations/supabase/client';

// Cache for market multipliers to reduce database calls
const marketMultiplierCache = new Map<string, { value: number, timestamp: number }>();
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

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
    
    // Check cache first
    const now = Date.now();
    const cached = marketMultiplierCache.get(zipCode);
    if (cached && (now - cached.timestamp < CACHE_EXPIRY)) {
      console.log(`Using cached market multiplier for ${zipCode}: ${cached.value}%`);
      return cached.value;
    }
    
    const { data, error } = await supabase
      .from('market_adjustments')
      .select('market_multiplier')
      .eq('zip_code', zipCode)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching market multiplier:', error);
      return 0;
    }
    
    const multiplier = data?.market_multiplier || 0;
    
    // Store in cache
    marketMultiplierCache.set(zipCode, { 
      value: multiplier, 
      timestamp: now 
    });
    
    console.log(`Fetched market multiplier for ${zipCode}: ${multiplier}%`);
    return multiplier;
  } catch (err) {
    console.error('Error in getMarketMultiplier:', err);
    return 0;
  }
}

/**
 * Get a friendly description of the market multiplier impact
 * @param multiplier The market multiplier percentage
 * @returns A human-readable description of the market impact
 */
export function getMarketMultiplierDescription(multiplier: number): string {
  if (multiplier > 4) {
    return "Very high demand in this area significantly increases value";
  } else if (multiplier > 2) {
    return "High demand in this area increases value";
  } else if (multiplier > 0.5) {
    return "Moderate demand in this area slightly increases value";
  } else if (multiplier > -0.5) {
    return "Average market demand in this area";
  } else if (multiplier > -2) {
    return "Lower demand in this area slightly decreases value";
  } else if (multiplier > -4) {
    return "Low demand in this area decreases value";
  } else {
    return "Very low demand in this area significantly decreases value";
  }
}
