
import { AdjustmentBreakdown, RulesEngineInput } from '../rules/types';
import { supabase } from '@/integrations/supabase/client';

export class SeasonalCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip calculation if no sale date provided
    if (!input.saleDate) {
      return null;
    }
    
    try {
      // Get month from sale date (1-12)
      const saleDate = new Date(input.saleDate);
      const month = saleDate.getMonth() + 1; // JavaScript months are 0-11
      
      // Determine vehicle type based on body style or default to generic
      let vehicleType = 'generic';
      if (input.bodyStyle) {
        const bodyStyle = input.bodyStyle.toLowerCase();
        
        if (bodyStyle.includes('suv') || bodyStyle.includes('crossover')) {
          vehicleType = 'suv';
        } else if (bodyStyle.includes('convertible') || bodyStyle.includes('cabriolet')) {
          vehicleType = 'convertible';
        } else if (bodyStyle.includes('sport') || bodyStyle.includes('coupe')) {
          vehicleType = 'sport';
        } else if (bodyStyle.includes('truck') || bodyStyle.includes('pickup')) {
          vehicleType = 'truck';
        }
      }
      
      // Get the seasonal index from database
      const { data, error } = await supabase
        .from('seasonal_index')
        .select(`${vehicleType}, description`)
        .eq('month', month)
        .single();
      
      if (error || !data) {
        console.error('Error fetching seasonal index:', error);
        return null;
      }
      
      // Calculate adjustment based on seasonal factor
      const seasonalFactor = data[vehicleType];
      const percentAdjustment = (seasonalFactor - 1) * 100;
      const value = Math.round(input.basePrice * (seasonalFactor - 1));
      
      // Format description with details
      const description = data.description ? 
        `${data.description} (${vehicleType} vehicles ${percentAdjustment >= 0 ? '+' : ''}${percentAdjustment.toFixed(1)}%)` : 
        `Seasonal adjustment for ${vehicleType} vehicles in month ${month}: ${percentAdjustment.toFixed(1)}%`;
      
      return {
        name: 'Seasonal Market Trends',
        value: value,
        percentAdjustment: percentAdjustment,
        description: description
      };
    } catch (error) {
      console.error('Error calculating seasonal adjustment:', error);
      return null;
    }
  }
}
