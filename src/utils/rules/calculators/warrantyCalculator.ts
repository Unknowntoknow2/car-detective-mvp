
import { AdjustmentBreakdown, RulesEngineInput } from '../types';
import { AdjustmentCalculator } from './adjustmentCalculator';
import { supabase } from '@/integrations/supabase/client';

export class WarrantyCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (input.warrantyStatus && input.warrantyStatus !== 'None') {
      try {
        // Fetch warranty factor from the database
        const { data: warrantyData } = await supabase
          .from('warranty_options')
          .select('multiplier, description')
          .eq('status', input.warrantyStatus)
          .single();
        
        if (!warrantyData) {
          return null;
        }
        
        const multiplier = warrantyData.multiplier;
        const percentAdjustment = (multiplier - 1) * 100;
        const value = Math.round(input.basePrice * (multiplier - 1));
        
        return {
          name: 'Warranty Status',
          value: value,
          percentAdjustment: percentAdjustment,
          description: warrantyData.description || `Vehicle has ${input.warrantyStatus} warranty that affects value`
        };
      } catch (error) {
        console.error('Error fetching warranty factor:', error);
        return null;
      }
    }
    
    return null;
  }
}
