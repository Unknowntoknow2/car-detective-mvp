
import { Calculator } from '../interfaces/Calculator';
import { AdjustmentBreakdown, RulesEngineInput } from '../types';

export class ColorCalculator implements Calculator {
  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no color information is provided
    if (!input.exteriorColor || !input.colorMultiplier) {
      return null;
    }

    // Calculate the adjustment value
    const adjustmentPercentage = (input.colorMultiplier - 1) * 100;
    const adjustmentValue = input.basePrice * (input.colorMultiplier - 1);

    // Only create an adjustment if there's an actual impact
    if (input.colorMultiplier === 1) {
      return null;
    }

    // Get the category based on the multiplier
    let category = "Neutral";
    if (input.colorMultiplier > 1) {
      category = "Rare";
    } else if (input.colorMultiplier < 1) {
      category = "Common";
    }

    return {
      name: "Exterior Color",
      value: Math.round(adjustmentValue),
      percentAdjustment: adjustmentPercentage,
      description: `${input.exteriorColor} is a ${category.toLowerCase()} color (${adjustmentPercentage > 0 ? '+' : ''}${adjustmentPercentage.toFixed(0)}% adjustment)`
    };
  }
}
