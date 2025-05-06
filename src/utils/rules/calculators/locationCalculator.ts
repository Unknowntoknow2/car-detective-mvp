
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';
import { supabase } from '@/integrations/supabase/client';

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
    
    // First, check if we have a specific multiplier in market_adjustments
    try {
      const { data: marketData, error: marketError } = await supabase
        .from('market_adjustments')
        .select('market_multiplier')
        .eq('zip_code', input.zipCode)
        .maybeSingle();
      
      if (!marketError && marketData && marketData.market_multiplier !== null) {
        // Convert percentage to decimal for calculation
        const multiplier = marketData.market_multiplier / 100;
        const adjustment = input.basePrice * multiplier;
        
        // Get location info for better description
        let locationName = input.zipCode;
        
        // Try to get the cached location data for better description
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
        
        return {
          name: 'Location Impact',
          value: Math.round(adjustment),
          description: `Based on market demand in ${locationName}`,
          percentAdjustment: marketData.market_multiplier
        };
      }
    } catch (err) {
      console.error('Error fetching market_adjustments data:', err);
      // Continue to use fallback if market_adjustments lookup failed
    }
    
    // Fallback to configured rules
    const zipRules = rulesConfig.adjustments.zip;
    
    let zoneType: 'hot' | 'cold' | 'default' = 'default';
    if (zipRules.hot.includes(input.zipCode)) {
      zoneType = 'hot';
    } else if (zipRules.cold.includes(input.zipCode)) {
      zoneType = 'cold';
    }
    
    const adjustment = input.basePrice * zipRules.adjustments[zoneType];
    const description = `Based on market demand in ${input.zipCode}`;
    
    return {
      name: 'Location Impact',
      value: Math.round(adjustment),
      description,
      percentAdjustment: zipRules.adjustments[zoneType] * 100 // Convert to percentage
    };
  }
}
