
import { Calculator } from '../interfaces/Calculator';
import { AdjustmentBreakdown, RulesEngineInput } from '../types';

export class TransmissionCalculator implements Calculator {
  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no transmission type information is provided
    if (!input.transmissionType || !input.transmissionMultiplier) {
      return null;
    }

    // Calculate the adjustment value
    const adjustmentPercentage = (input.transmissionMultiplier - 1) * 100;
    const adjustmentValue = input.basePrice * (input.transmissionMultiplier - 1);
    const factor = "Transmission";
    const impact = Math.round(adjustmentValue);

    // Only create an adjustment if there's an actual impact
    if (input.transmissionMultiplier === 1) {
      return null;
    }

    // Get the category based on the multiplier
    let category = "Standard";
    if (input.transmissionMultiplier > 1) {
      category = "Premium";
    } else if (input.transmissionMultiplier < 1) {
      category = "Discount";
    }

    return {
      name: "Transmission",
      value: Math.round(adjustmentValue),
      percentAdjustment: adjustmentPercentage,
      description: `${input.transmissionType} is a ${category.toLowerCase()} transmission type (${adjustmentPercentage > 0 ? '+' : ''}${adjustmentPercentage.toFixed(0)}% adjustment)`,
      factor,
      impact
    };
  }
}
