
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';

export class LocationCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.zipCode) return null;
    
    const zipRules = rulesConfig.adjustments.zip;
    
    let zoneType: 'hot' | 'cold' | 'default' = 'default';
    if (zipRules.hot.includes(input.zipCode)) {
      zoneType = 'hot';
    } else if (zipRules.cold.includes(input.zipCode)) {
      zoneType = 'cold';
    }
    
    const adjustment = input.basePrice * zipRules.adjustments[zoneType];
    
    return {
      name: 'Location Impact',
      value: Math.round(adjustment),
      description: `Based on market demand in ${input.zipCode}`,
      percentAdjustment: zipRules.adjustments[zoneType]
    };
  }
}
