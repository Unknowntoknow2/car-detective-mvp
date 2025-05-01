
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';
import { supabase } from '@/integrations/supabase/client';

export class LocationCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (!input.zipCode) return null;
    
    // First, check our internal rules for known hot/cold zones
    const zipRules = rulesConfig.adjustments.zip;
    
    let zoneType: 'hot' | 'cold' | 'default' = 'default';
    if (zipRules.hot.includes(input.zipCode)) {
      zoneType = 'hot';
    } else if (zipRules.cold.includes(input.zipCode)) {
      zoneType = 'cold';
    }
    
    let adjustment = input.basePrice * zipRules.adjustments[zoneType];
    let description = `Based on market demand in ${input.zipCode}`;
    
    // Try to get more detailed information from our cached ZIP data
    try {
      const { data: zipData, error } = await supabase
        .from('zip_cache')
        .select('location_data')
        .eq('zip', input.zipCode)
        .single();
      
      if (!error && zipData && zipData.location_data && zipData.location_data.places && zipData.location_data.places.length > 0) {
        const place = zipData.location_data.places[0];
        const city = place['place name'];
        const state = place['state abbreviation'];
        
        // Update the description with more detailed location info
        description = `Based on market demand in ${city}, ${state} (${input.zipCode})`;
        
        // Look up more specific location factor from pricing_curves if available
        const { data: locationData, error: locationError } = await supabase
          .from('pricing_curves')
          .select('multiplier')
          .eq('zip_code', input.zipCode)
          .single();
        
        if (!locationError && locationData && locationData.multiplier) {
          // We have a specific multiplier for this ZIP code
          const specificAdjustment = input.basePrice * (locationData.multiplier - 1); // Convert from multiplier to adjustment
          return {
            name: 'Location Impact',
            value: Math.round(specificAdjustment),
            description,
            percentAdjustment: (locationData.multiplier - 1) * 100 // Convert to percentage
          };
        }
      }
    } catch (err) {
      console.error('Error retrieving location data for valuation:', err);
      // Fall back to basic location adjustment
    }
    
    // Return the basic adjustment if we couldn't get more specific data
    return {
      name: 'Location Impact',
      value: Math.round(adjustment),
      description,
      percentAdjustment: zipRules.adjustments[zoneType] * 100 // Convert to percentage
    };
  }
}
