
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { MileageCalculator } from './rules/calculators/mileageCalculator';
import { ConditionCalculator } from './rules/calculators/conditionCalculator';
import { LocationCalculator } from './rules/calculators/locationCalculator';
import { TrimCalculator } from './rules/calculators/trimCalculator';
import { FuelTypeCalculator } from './rules/calculators/fuelTypeCalculator';
import { PhotoScoreCalculator } from './rules/calculators/photoScoreCalculator';

export async function calculateAdjustments(input: RulesEngineInput): Promise<{
  adjustments: AdjustmentBreakdown[];
  finalValue: number;
  totalAdjustment: number;
}> {
  const calculators = [
    new MileageCalculator(),
    new ConditionCalculator(),
    new LocationCalculator(),
    new TrimCalculator(),
    new FuelTypeCalculator(),
    new PhotoScoreCalculator(),
    // Add other calculators as needed
  ];

  const adjustments: AdjustmentBreakdown[] = [];
  let totalAdjustment = 0;

  // Make sure basePrice has a default value
  const basePrice = input.basePrice || input.baseValue || 0;
  input.basePrice = basePrice;
  input.baseValue = basePrice;

  for (const calculator of calculators) {
    try {
      const adjustment = await calculator.calculate(input);
      if (adjustment) {
        adjustments.push(adjustment);
        totalAdjustment += adjustment.impact || 0;
        
        // For calculators that use percentAdjustment
        if (adjustment.percentAdjustment && adjustment.value !== undefined) {
          totalAdjustment += adjustment.value;
        }
      }
    } catch (error) {
      console.error(`Error in calculator ${calculator.constructor.name}:`, error);
    }
  }

  const finalValue = Math.max(0, basePrice + totalAdjustment);

  return {
    adjustments,
    finalValue,
    totalAdjustment,
  };
}
