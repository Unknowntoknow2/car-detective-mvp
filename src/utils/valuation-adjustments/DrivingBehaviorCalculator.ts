
import { AdjustmentBreakdown, RulesEngineInput } from '../rules/types';
import { supabase } from '@/integrations/supabase/client';

export class DrivingBehaviorCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip calculation if no driving profile provided
    if (!input.drivingProfile) {
      return null;
    }
    
    try {
      // Get the multiplier from database based on the profile
      const { data, error } = await supabase
        .from('driving_profile')
        .select('multiplier, description')
        .eq('profile', input.drivingProfile)
        .single();
      
      if (error || !data) {
        console.error('Error fetching driving profile:', error);
        return null;
      }
      
      // Calculate adjustment based on driving profile multiplier
      const drivingMultiplier = data.multiplier;
      const percentAdjustment = (drivingMultiplier - 1) * 100;
      const value = Math.round(input.basePrice * (drivingMultiplier - 1));
      
      // Build description text
      const descriptionText = data.description ? 
        `${data.description} (${percentAdjustment >= 0 ? '+' : ''}${percentAdjustment.toFixed(1)}%)` : 
        `Driving behavior adjustment: ${percentAdjustment.toFixed(1)}%`;
      
      return {
        name: 'Driving Behavior',
        value: value,
        percentAdjustment: percentAdjustment,
        description: descriptionText
      };
    } catch (error) {
      console.error('Error calculating driving behavior adjustment:', error);
      return null;
    }
  }
}
