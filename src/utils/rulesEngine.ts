
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';

// Re-export types with 'export type' syntax for isolatedModules
export type { RulesEngineInput, AdjustmentBreakdown };

// Default export (placeholder for rulesEngine implementation)
export default {
  calculateAdjustments: async (input: RulesEngineInput): Promise<AdjustmentBreakdown[]> => {
    // Mock implementation
    return [
      {
        name: 'Mileage',
        value: calculateMileageAdjustment(input),
        description: getMileageAdjustmentDescription(input),
        percentAdjustment: calculateMileagePercentage(input)
      },
      {
        name: 'Condition',
        value: calculateConditionAdjustment(input),
        description: `Based on ${input.condition} condition`,
        percentAdjustment: calculateConditionPercentage(input)
      },
      {
        name: 'Market Demand',
        value: input.basePrice * 0.03,
        description: 'Current market demand in your region',
        percentAdjustment: 3
      }
    ];
  },
  calculateTotalAdjustment: (adjustments: AdjustmentBreakdown[]): number => {
    return adjustments.reduce((sum, adjustment) => sum + adjustment.value, 0);
  }
};

// Helper functions
function calculateMileageAdjustment(input: RulesEngineInput): number {
  const avgMileagePerYear = 12000;
  const vehicleAge = new Date().getFullYear() - input.year;
  const expectedMileage = vehicleAge * avgMileagePerYear;
  const mileageDifference = input.mileage - expectedMileage;
  
  if (mileageDifference <= 0) {
    return Math.min(input.basePrice * 0.05, 1500); // Bonus for low mileage
  } else {
    const excessMileagePenalty = mileageDifference * -0.05;
    return Math.max(excessMileagePenalty, input.basePrice * -0.1); // Cap at 10% penalty
  }
}

function calculateMileagePercentage(input: RulesEngineInput): number {
  const adjustment = calculateMileageAdjustment(input);
  return (adjustment / input.basePrice) * 100;
}

function getMileageAdjustmentDescription(input: RulesEngineInput): string {
  const avgMileagePerYear = 12000;
  const vehicleAge = new Date().getFullYear() - input.year;
  const expectedMileage = vehicleAge * avgMileagePerYear;
  
  if (input.mileage < expectedMileage) {
    return `Lower than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`;
  } else {
    return `Higher than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`;
  }
}

function calculateConditionAdjustment(input: RulesEngineInput): number {
  // Override with AI condition if available
  const condition = input.aiConditionOverride?.condition || input.condition;
  
  switch (condition.toLowerCase()) {
    case 'excellent':
      return input.basePrice * 0.08;
    case 'good':
      return input.basePrice * 0.02;
    case 'fair':
      return input.basePrice * -0.05;
    case 'poor':
      return input.basePrice * -0.15;
    default:
      return 0;
  }
}

function calculateConditionPercentage(input: RulesEngineInput): number {
  const adjustment = calculateConditionAdjustment(input);
  return (adjustment / input.basePrice) * 100;
}
