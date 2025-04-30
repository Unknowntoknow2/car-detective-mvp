
import { AdjustmentBreakdown, RulesEngineInput } from '../types';
import { AdjustmentCalculator } from './adjustmentCalculator';
import { supabase } from '@/integrations/supabase/client';

export class RecallCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (input.hasOpenRecall) {
      try {
        // Fetch recall factor from the database
        const { data: recallData } = await supabase
          .from('recall_factor')
          .select('multiplier, description')
          .eq('has_open_recall', true)
          .single();
        
        if (!recallData) {
          return null;
        }
        
        const multiplier = recallData.multiplier;
        const percentAdjustment = (multiplier - 1) * 100;
        const value = Math.round(input.basePrice * (multiplier - 1));
        
        return {
          name: 'Open Recall',
          value: value,
          percentAdjustment: percentAdjustment,
          description: recallData.description || 'Vehicle has an open recall that affects value'
        };
      } catch (error) {
        console.error('Error fetching recall factor:', error);
        // Default to 10% decrease if database fetch fails
        const percentAdjustment = -10;
        const value = Math.round(input.basePrice * -0.1);
        
        return {
          name: 'Open Recall',
          value: value,
          percentAdjustment: percentAdjustment,
          description: 'Vehicle has an open recall that affects value'
        };
      }
    }
    
    return null;
  }
}
