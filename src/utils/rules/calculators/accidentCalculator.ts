
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';

export class AccidentCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (input.accidentCount === undefined || input.accidentCount === 0) return null;
    
    const accidentRules = rulesConfig.adjustments.accidents;
    const rule = accidentRules.find(r => r.count === Math.min(input.accidentCount!, 3)) || 
                 accidentRules[accidentRules.length - 1];
    
    const adjustment = input.basePrice * rule.percent;
    
    return {
      factor: 'Accident History',
      impact: Math.round(adjustment),
      name: 'Accident History', // For backward compatibility
      value: Math.round(adjustment), // For backward compatibility
      description: `Vehicle has ${input.accidentCount} reported accident${input.accidentCount > 1 ? 's' : ''}`,
      percentAdjustment: rule.percent
    };
  }
}
