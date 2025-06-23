import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { BasePriceService } from '@/services/basePriceService';

export const calculateAdjustments = async (input: RulesEngineInput): Promise<AdjustmentBreakdown[]> => {
  const adjustments: AdjustmentBreakdown[] = [];

  // Get base price for calculations
  const basePrice = input.basePrice || BasePriceService.getBasePrice({
    make: input.make,
    model: input.model,
    year: input.year,
    mileage: input.mileage
  });

  // Condition adjustment
  const conditionMultipliers: Record<string, number> = {
    'Excellent': 0.10,
    'Very Good': 0.05,
    'Good': 0,
    'Fair': -0.15,
    'Poor': -0.30
  };

  const conditionKey = input.condition || 'Good';
  const conditionMultiplier = conditionMultipliers[conditionKey] || 0;
  if (conditionMultiplier !== 0) {
    const conditionAdjustment = Math.round(basePrice * conditionMultiplier);
    adjustments.push({
      factor: 'Vehicle Condition',
      impact: conditionAdjustment,
      description: `Vehicle condition is ${conditionKey}`,
      name: 'Condition Adjustment',
      value: conditionAdjustment,
      percentAdjustment: conditionMultiplier * 100
    });
  }

  // Accident history adjustment
  if (input.accidentCount && input.accidentCount > 0) {
    const accidentImpact = Math.round(basePrice * -0.08 * input.accidentCount);
    adjustments.push({
      factor: 'Accident History',
      impact: accidentImpact,
      description: `Vehicle has ${input.accidentCount} reported accident(s)`,
      name: 'Accident Adjustment',
      value: accidentImpact,
      percentAdjustment: -8 * input.accidentCount
    });
  }

  // High mileage adjustment (additional to base price calculation)
  const expectedMileage = (new Date().getFullYear() - input.year) * 12000;
  const excessMileage = input.mileage - expectedMileage;
  if (excessMileage > 20000) {
    const mileageAdjustment = Math.round(basePrice * -0.05);
    adjustments.push({
      factor: 'Excess Mileage',
      impact: mileageAdjustment,
      description: `${excessMileage.toLocaleString()} miles above average`,
      name: 'Mileage Adjustment',
      value: mileageAdjustment,
      percentAdjustment: -5
    });
  }

  // Fuel type bonus
  if (input.fuelType) {
    const fuelMultipliers: Record<string, number> = {
      'Electric': 0.08,
      'Hybrid': 0.05,
      'Diesel': 0.03
    };
    
    const fuelMultiplier = fuelMultipliers[input.fuelType];
    if (fuelMultiplier) {
      const fuelAdjustment = Math.round(basePrice * fuelMultiplier);
      adjustments.push({
        factor: 'Fuel Type',
        impact: fuelAdjustment,
        description: `${input.fuelType} vehicle bonus`,
        name: 'Fuel Type Adjustment',
        value: fuelAdjustment,
        percentAdjustment: fuelMultiplier * 100
      });
    }
  }

  // Always return an array, never undefined
  return adjustments;
};

export const calculateFinalValue = (basePrice: number, adjustments: AdjustmentBreakdown[]): number => {
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const finalValue = basePrice + totalAdjustments;
  
  // Ensure minimum value
  return Math.max(3000, Math.round(finalValue));
};

// Legacy function for backward compatibility
export const calculateTotalAdjustment = (adjustments: AdjustmentBreakdown[]): number => {
  return adjustments.reduce((total, adjustment) => total + adjustment.impact, 0);
};
