
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';

// Mock implementation of calculateAdjustments
export const calculateAdjustments = async (input: RulesEngineInput): Promise<AdjustmentBreakdown[]> => {
  const adjustments: AdjustmentBreakdown[] = [];

  // Mileage adjustment
  if (input.mileage > 100000) {
    adjustments.push({
      factor: 'High Mileage',
      impact: -1000,
      description: `Vehicle has ${input.mileage} miles, which is above average`,
      name: 'Mileage Adjustment',
      value: -1000,
      percentAdjustment: -5
    });
  }

  // Condition adjustment
  const conditionMultipliers: Record<string, number> = {
    'Excellent': 0.05,
    'Good': 0,
    'Fair': -0.10,
    'Poor': -0.25
  };

  const conditionKey = input.condition || 'Good';
  const conditionMultiplier = conditionMultipliers[conditionKey];
  if (conditionMultiplier !== 0 && input.basePrice) {
    const conditionAdjustment = input.basePrice * conditionMultiplier;
    adjustments.push({
      factor: 'Vehicle Condition',
      impact: Math.round(conditionAdjustment),
      description: `Vehicle condition is ${conditionKey}`,
      name: 'Condition Adjustment',
      value: Math.round(conditionAdjustment),
      percentAdjustment: conditionMultiplier * 100
    });
  }

  // Accident history adjustment
  if (input.accidentCount && input.accidentCount > 0) {
    const accidentAdjustment = -500 * input.accidentCount;
    adjustments.push({
      factor: 'Accident History',
      impact: accidentAdjustment,
      description: `Vehicle has ${input.accidentCount} reported accident(s)`,
      name: 'Accident Adjustment',
      value: accidentAdjustment,
      percentAdjustment: -2.5 * input.accidentCount
    });
  }

  return adjustments;
};

// Calculate the total adjustment from all individual adjustments
export const calculateTotalAdjustment = (adjustments: AdjustmentBreakdown[]): number => {
  return adjustments.reduce((total, adjustment) => total + adjustment.impact, 0);
};
