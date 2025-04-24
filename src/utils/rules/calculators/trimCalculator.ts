
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';

export class TrimCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.make || !input.model || !input.trim) return null;
    
    const trimRules = rulesConfig.adjustments.trims as Record<string, Record<string, Array<{trim: string; percent: number}>>>;
    
    if (!trimRules[input.make] || !trimRules[input.make][input.model]) return null;
    
    const trimData = trimRules[input.make][input.model].find(t => 
      t.trim.toLowerCase() === input.trim.toLowerCase()
    );
    
    if (!trimData) return null;
    
    const adjustment = input.basePrice * trimData.percent;
    
    return {
      label: 'Trim Level',
      value: Math.round(adjustment),
      description: `${input.make} ${input.model} ${input.trim} trim package`
    };
  }
}
