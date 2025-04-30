
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import { supabase } from '@/integrations/supabase/client';

export class EquipmentCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no equipment data is provided
    if (!input.equipmentIds || input.equipmentIds.length === 0) {
      return null;
    }

    try {
      // Fetch equipment options from the database
      const { data, error } = await supabase
        .from('equipment_options')
        .select('*')
        .in('id', input.equipmentIds);

      if (error) {
        console.error('Error fetching equipment options:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // Calculate combined multiplier and value
      const combinedMultiplier = data.reduce(
        (total, option) => total * option.multiplier, 
        1
      );
      
      // Calculate total value add from equipment
      const totalValueAdd = data.reduce(
        (total, option) => total + option.value_add, 
        0
      );

      // Calculate the adjustment as a percentage of the base price
      const percentAdjustment = (combinedMultiplier - 1) * 100;
      const valueAdjustment = Math.round(input.basePrice * (combinedMultiplier - 1)) + totalValueAdd;

      // Create description listing selected equipment
      const equipmentNames = data.map(option => option.name).join(', ');
      const description = `Selected equipment: ${equipmentNames}`;

      return {
        name: 'Equipment & Packages',
        value: valueAdjustment,
        description,
        percentAdjustment
      };
    } catch (error) {
      console.error('Error in equipment calculator:', error);
      return null;
    }
  }
}
