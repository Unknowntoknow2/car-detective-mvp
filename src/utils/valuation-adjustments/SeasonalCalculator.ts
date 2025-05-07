
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../rules/types';

export class SeasonalCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no sale date is provided
    if (!input.saleDate) {
      return null;
    }
    
    try {
      // Parse the sale date
      const saleDate = new Date(input.saleDate);
      const month = saleDate.getMonth(); // 0-11
      
      // Default seasonal adjustment
      let seasonalMultiplier = 1.0;
      let bodyTypeCategory = 'generic';
      
      // Determine vehicle body type category
      if (input.bodyStyle) {
        const bodyStyleLower = input.bodyStyle.toLowerCase();
        if (bodyStyleLower.includes('convertible')) {
          bodyTypeCategory = 'convertible';
        } else if (bodyStyleLower.includes('suv')) {
          bodyTypeCategory = 'suv';
        } else if (bodyStyleLower.includes('truck') || bodyStyleLower.includes('pickup')) {
          bodyTypeCategory = 'truck';
        } else if (bodyStyleLower.includes('sport') || bodyStyleLower.includes('coupe')) {
          bodyTypeCategory = 'sport';
        }
      }
      
      // Seasonal adjustment logic based on month and vehicle type
      // This would typically come from a database or configuration
      // Just using hardcoded values for simplicity
      const seasonalIndex = {
        convertible: [0.96, 0.97, 1.02, 1.05, 1.07, 1.05, 1.03, 1.01, 0.98, 0.96, 0.95, 0.95], // Peaks in summer
        suv: [1.02, 1.01, 1.00, 0.99, 0.98, 0.97, 0.98, 0.99, 1.00, 1.01, 1.02, 1.03], // Peaks in winter
        truck: [1.01, 1.01, 1.00, 1.00, 0.99, 0.99, 0.99, 0.99, 1.00, 1.01, 1.01, 1.02], // Slight winter peak
        sport: [0.97, 0.98, 1.01, 1.03, 1.04, 1.03, 1.02, 1.01, 1.00, 0.98, 0.97, 0.96], // Peaks in spring/summer
        generic: [1.00, 1.00, 1.00, 1.01, 1.01, 1.00, 1.00, 1.00, 1.01, 1.00, 1.00, 1.00]  // Minimal seasonal impact
      };
      
      // Get the appropriate multiplier
      seasonalMultiplier = seasonalIndex[bodyTypeCategory as keyof typeof seasonalIndex][month];
      
      // Calculate the adjustment
      const adjustment = input.basePrice * (seasonalMultiplier - 1);
      
      // Skip if adjustment is negligible
      if (Math.abs(adjustment) < 50) {
        return null;
      }
      
      // Generate description
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const direction = adjustment > 0 ? 'higher' : 'lower';
      const bodyTypeDisplay = bodyTypeCategory === 'generic' ? 'vehicles' : `${bodyTypeCategory} vehicles`;
      const description = `${bodyTypeDisplay.charAt(0).toUpperCase() + bodyTypeDisplay.slice(1)} tend to sell for ${direction} prices in ${monthNames[month]}`;
      
      return {
        name: 'Seasonal Adjustment',
        value: Math.round(adjustment),
        description,
        percentAdjustment: seasonalMultiplier - 1
      };
    } catch (error) {
      console.error('Error in SeasonalCalculator:', error);
      return null;
    }
  }
}
