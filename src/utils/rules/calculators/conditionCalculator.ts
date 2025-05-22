
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
// Import rules dynamically to avoid TypeScript error
const rulesConfig = require('../../valuationRules.json');

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const conditionRules = rulesConfig.adjustments.condition as Record<string, number>;
    const conditionValue = (input.condition || 'good').toLowerCase() as keyof typeof conditionRules;
    const adjustment = conditionRules[conditionValue] !== undefined && input.basePrice !== undefined
      ? input.basePrice * conditionRules[conditionValue] 
      : 0;
    
    return {
      factor: 'Condition Impact',
      impact: Math.round(adjustment),
      name: 'Condition Impact', // For backward compatibility
      value: Math.round(adjustment), // For backward compatibility
      description: `Vehicle in ${input.condition || 'good'} condition`,
      percentAdjustment: conditionRules[conditionValue] || 0
    };
  }
}
