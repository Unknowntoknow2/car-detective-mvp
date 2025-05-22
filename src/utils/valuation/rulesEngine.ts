
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';

/**
 * Calculate adjustments based on input parameters
 */
export const calculateAdjustments = async (input: RulesEngineInput): Promise<AdjustmentBreakdown[]> => {
  const adjustments: AdjustmentBreakdown[] = [];
  
  // Mileage adjustment
  if (input.mileage) {
    const avgMileage = input.year ? (new Date().getFullYear() - input.year) * 12000 : 60000;
    const mileageDiff = input.mileage - avgMileage;
    let mileageImpact = 0;
    
    if (mileageDiff > 0) {
      // Higher mileage = lower value
      mileageImpact = -Math.min(3000, mileageDiff * 0.05);
    } else if (mileageDiff < 0) {
      // Lower mileage = higher value
      mileageImpact = Math.min(2000, Math.abs(mileageDiff) * 0.03);
    }
    
    if (mileageImpact !== 0) {
      adjustments.push({
        factor: 'Mileage',
        impact: mileageImpact,
        description: `Adjustment for ${input.mileage.toLocaleString()} miles vs average ${avgMileage.toLocaleString()} miles`
      });
    }
  }
  
  // Condition adjustment
  if (input.condition) {
    let conditionImpact = 0;
    const baseValue = input.basePrice || 20000;
    
    switch (input.condition.toLowerCase()) {
      case 'excellent':
        conditionImpact = baseValue * 0.05; // +5%
        break;
      case 'good':
        conditionImpact = 0; // baseline
        break;
      case 'fair':
        conditionImpact = -baseValue * 0.07; // -7%
        break;
      case 'poor':
        conditionImpact = -baseValue * 0.15; // -15%
        break;
    }
    
    if (conditionImpact !== 0) {
      adjustments.push({
        factor: 'Condition',
        impact: conditionImpact,
        description: `${input.condition} condition adjustment`
      });
    }
  }
  
  // Add additional adjustments as needed...
  
  return adjustments;
};

/**
 * Calculate the total adjustment from all adjustment items
 */
export const calculateTotalAdjustment = (adjustments: AdjustmentBreakdown[]): number => {
  return adjustments.reduce((total, adjustment) => total + adjustment.impact, 0);
};
