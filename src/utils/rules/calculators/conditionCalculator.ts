
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const conditionRules = rulesConfig.adjustments.condition as Record<string, number>;
    const conditionValue = input.condition.toLowerCase() as keyof typeof conditionRules;
    const adjustment = conditionRules[conditionValue] !== undefined 
      ? input.basePrice * conditionRules[conditionValue] 
      : 0;
    
    return {
      label: 'Condition Impact',
      value: Math.round(adjustment),
      description: `Vehicle in ${input.condition} condition`
    };
  }
}
