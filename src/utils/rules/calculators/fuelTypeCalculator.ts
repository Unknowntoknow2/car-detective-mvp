
import { Calculator } from '../interfaces/Calculator';
import { AdjustmentBreakdown, RulesEngineInput } from '../types';

export class FuelTypeCalculator implements Calculator {
  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no fuel type information is provided
    if (!input.fuelType || !input.fuelTypeMultiplier) {
      return null;
    }

    // Calculate the adjustment value
    const adjustmentPercentage = (input.fuelTypeMultiplier - 1) * 100;
    const adjustmentValue = input.basePrice * (input.fuelTypeMultiplier - 1);

    // Only create an adjustment if there's an actual impact
    if (input.fuelTypeMultiplier === 1) {
      return null;
    }

    // Get the category based on the multiplier
    let category = "Standard";
    if (input.fuelTypeMultiplier > 1) {
      category = "Premium";
    } else if (input.fuelTypeMultiplier < 1) {
      category = "Discount";
    }

    return {
      name: "Fuel Type",
      value: Math.round(adjustmentValue),
      percentAdjustment: adjustmentPercentage,
      description: `${input.fuelType} is a ${category.toLowerCase()} fuel type (${adjustmentPercentage > 0 ? '+' : ''}${adjustmentPercentage.toFixed(0)}% adjustment)`
    };
  }
}
