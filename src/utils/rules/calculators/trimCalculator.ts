
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
// Import rules dynamically to avoid TypeScript error
const rulesConfig = require('../../valuationRules.json');

export class TrimCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    if (!input.make || !input.model || !input.trim) {
      return {
        factor: 'Trim Level',
        impact: 0,
        description: 'No trim level specified',
        name: 'Trim Level',
        value: 0,
        percentAdjustment: 0
      };
    }
    
    const trimRules = rulesConfig.adjustments.trims as Record<string, Record<string, Array<{trim: string; percent: number}>>>;
    
    if (!trimRules[input.make] || !trimRules[input.make][input.model]) {
      return {
        factor: 'Trim Level',
        impact: 0,
        description: `No trim data for ${input.make} ${input.model}`,
        name: 'Trim Level',
        value: 0,
        percentAdjustment: 0
      };
    }
    
    const trimData = trimRules[input.make][input.model].find(t => 
      t.trim.toLowerCase() === input.trim?.toLowerCase()
    );
    
    if (!trimData) {
      return {
        factor: 'Trim Level',
        impact: 0,
        description: `Unknown trim: ${input.trim}`,
        name: 'Trim Level',
        value: 0,
        percentAdjustment: 0
      };
    }
    
    const basePrice = input.basePrice || 0;
    const adjustment = basePrice * trimData.percent;
    const factor = 'Trim Level';
    const impact = Math.round(adjustment);
    
    return {
      name: 'Trim Level',
      value: Math.round(adjustment),
      description: `${input.make} ${input.model} ${input.trim} trim package`,
      percentAdjustment: trimData.percent,
      factor,
      impact
    };
  }
}
