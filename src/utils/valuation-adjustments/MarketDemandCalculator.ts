
import { AdjustmentBreakdown, RulesEngineInput } from '../rules/types';

export class MarketDemandCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (!input.zipCode) {
      return null;
    }
    
    try {
      // In a real implementation, this would fetch data from the API
      // For now, we'll simulate market demand based on ZIP code
      const zipSum = input.zipCode.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
      
      let multiplier = 1.0;
      let demandLevel = "Average";
      
      // Simulate different market conditions based on ZIP code
      if (zipSum % 5 === 0) {
        // High demand area
        multiplier = 1.035; // +3.5%
        demandLevel = "High";
      } else if (zipSum % 5 === 1) {
        // Slightly above average
        multiplier = 1.015; // +1.5%
        demandLevel = "Above Average";
      } else if (zipSum % 5 === 3) {
        // Slightly below average
        multiplier = 0.985; // -1.5%
        demandLevel = "Below Average";
      } else if (zipSum % 5 === 4) {
        // Low demand area
        multiplier = 0.975; // -2.5%
        demandLevel = "Low";
      }
      
      const percentAdjustment = (multiplier - 1) * 100;
      const value = Math.round(input.basePrice * (multiplier - 1));
      
      return {
        name: 'Local Market Demand',
        value: value,
        percentAdjustment: percentAdjustment,
        description: `${demandLevel} demand in ZIP code ${input.zipCode} affects vehicle value`
      };
    } catch (error) {
      console.error('Error calculating market demand adjustment:', error);
      return null;
    }
  }
}
