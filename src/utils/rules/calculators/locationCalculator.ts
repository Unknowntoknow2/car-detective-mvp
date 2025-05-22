
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
// Import rules dynamically to avoid TypeScript error
const rulesConfig = require('../../valuationRules.json');

/**
 * Calculator to adjust vehicle price based on location
 * This calculator uses zip code to determine regional pricing differences
 */
export class LocationCalculator implements AdjustmentCalculator {
  /**
   * Calculate location-based adjustment
   * @param input Input data including zip code
   * @returns Adjustment breakdown or null if no zip code
   */
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown> {
    if (!input.zipCode) {
      return {
        factor: 'Location',
        impact: 0,
        description: 'No location data provided',
        name: 'Location',
        value: 0,
        percentAdjustment: 0
      };
    }

    try {
      const basePrice = input.basePrice || 0;
      
      // In a real implementation, we would fetch location-specific
      // market data here based on the zip code
      
      // For now, we'll use a simple formula that gives a slight
      // premium to coastal and urban areas
      
      // Get the first digit of the zip code to determine region
      const region = parseInt(input.zipCode.charAt(0));
      
      // Apply regional adjustments
      let percentAdjustment = 0;
      
      switch (region) {
        case 0: // Northeastern US
        case 1:
          percentAdjustment = 0.03;
          break;
        case 2: // Eastern US
          percentAdjustment = 0.02;
          break;
        case 3: // Southeastern US
          percentAdjustment = 0.01;
          break;
        case 4: // Midwestern US
          percentAdjustment = -0.01;
          break;
        case 5: // South Central US
          percentAdjustment = 0;
          break;
        case 6: // North Central US
          percentAdjustment = -0.02;
          break;
        case 7: // Mountain states
          percentAdjustment = -0.01;
          break;
        case 8: // Western US
        case 9: // West Coast
          percentAdjustment = 0.04;
          break;
        default:
          percentAdjustment = 0;
      }
      
      // Apply the adjustment
      const adjustment = basePrice * percentAdjustment;
      
      return {
        factor: 'Location',
        impact: Math.round(adjustment),
        description: `Regional market adjustment for ZIP ${input.zipCode}`,
        name: 'Location',
        value: Math.round(adjustment),
        percentAdjustment
      };
    } catch (error) {
      console.error('Error calculating location adjustment:', error);
      
      // Return a neutral adjustment in case of error
      return {
        factor: 'Location',
        impact: 0,
        description: 'Error calculating location adjustment',
        name: 'Location',
        value: 0,
        percentAdjustment: 0
      };
    }
  }
}
