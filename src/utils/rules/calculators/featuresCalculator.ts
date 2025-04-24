
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import rulesConfig from '../../valuationRules.json';

export class FeaturesCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.premiumFeatures || input.premiumFeatures.length === 0) return null;
    
    const featureRules = rulesConfig.adjustments.premiumFeatures as Record<string, {value: number; description: string}>;
    let totalPercent = 0;
    
    input.premiumFeatures.forEach(feature => {
      const featureKey = Object.keys(featureRules).find(
        key => key.toLowerCase() === feature.toLowerCase()
      );
      
      if (featureKey) {
        totalPercent += featureRules[featureKey].value;
      }
    });
    
    const cappedPercent = Math.min(totalPercent, rulesConfig.adjustments.featureValueCap);
    const adjustment = input.basePrice * cappedPercent;
    
    return {
      label: 'Premium Features',
      value: Math.round(adjustment),
      description: `Vehicle has ${input.premiumFeatures.length} premium features`
    };
  }
}
