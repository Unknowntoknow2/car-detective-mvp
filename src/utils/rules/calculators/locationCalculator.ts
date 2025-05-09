
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';
import { supabase } from '@/integrations/supabase/client';
import { getMarketMultiplier, getMarketMultiplierDescription } from '../../valuation/marketData';

interface ZipLocationData {
  places: {
    'place name': string;
    'state abbreviation': string;
    latitude?: string;
    longitude?: string;
  }[];
}

export class LocationCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (!input.zipCode) return null;
    
    try {
      // Get market multiplier from our utility function
      const marketMultiplier = await getMarketMultiplier(input.zipCode);
      
      // Early return if we have a valid multiplier
      if (marketMultiplier !== 0) {
        // Convert percentage to decimal for calculation
        const multiplier = marketMultiplier / 100;
        const adjustment = input.basePrice * multiplier;
        
        // Get location info for better description
        let locationName = input.zipCode;
        
        // Try to get the cached location data for better description
        try {
          const { data: zipData } = await supabase
            .from('zip_cache')
            .select('location_data')
            .eq('zip', input.zipCode)
            .maybeSingle();
          
          if (zipData?.location_data) {
            const locationData = zipData.location_data as unknown as ZipLocationData;
            if (locationData.places && locationData.places.length > 0) {
              const place = locationData.places[0];
              locationName = `${place['place name']}, ${place['state abbreviation']}`;
            }
          }
        } catch (err) {
          // If there's an error with zip_cache, just use the ZIP code as the location name
          console.log('Error fetching location data from zip_cache:', err);
        }
        
        const factor = 'Location Impact';
        const impact = Math.round(adjustment);
        
        return {
          name: 'Location Impact',
          value: impact,
          description: `${getMarketMultiplierDescription(marketMultiplier)} (${locationName})`,
          percentAdjustment: marketMultiplier,
          factor,
          impact
        };
      }
    } catch (err) {
      console.error('Error in LocationCalculator market_adjustments:', err);
      // Fall through to default calculation
    }
    
    // Fallback to configured rules if no market data found
    const zipRules = rulesConfig.adjustments.zip;
    
    let zoneType: 'hot' | 'cold' | 'default' = 'default';
    if (zipRules.hot.includes(input.zipCode)) {
      zoneType = 'hot';
    } else if (zipRules.cold.includes(input.zipCode)) {
      zoneType = 'cold';
    }
    
    const adjustment = input.basePrice * zipRules.adjustments[zoneType];
    const description = `Based on market demand in ${input.zipCode}`;
    const factor = 'Location Impact';
    const impact = Math.round(adjustment);
    
    return {
      name: 'Location Impact',
      value: impact,
      description,
      percentAdjustment: zipRules.adjustments[zoneType] * 100, // Convert to percentage
      factor,
      impact
    };
  }
}
