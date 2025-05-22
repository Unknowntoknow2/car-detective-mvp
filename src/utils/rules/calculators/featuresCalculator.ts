
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
// Import rules dynamically to avoid TypeScript error
const rulesConfig = require('../../valuationRules.json');

export class FeaturesCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    if (!input.features || (Array.isArray(input.features) && input.features.length === 0) || 
        (!Array.isArray(input.features) && Object.keys(input.features).length === 0)) {
      return {
        factor: 'Features',
        impact: 0,
        description: 'No special features',
        name: 'Features',
        value: 0,
        percentAdjustment: 0
      };
    }
    
    const featureRules = rulesConfig.adjustments.features as Record<string, number>;
    let totalPercentAdjustment = 0;
    const featuresFound: string[] = [];
    
    // Handle features as array
    if (Array.isArray(input.features)) {
      input.features.forEach(feature => {
        const featureKey = feature.toLowerCase();
        if (featureRules[featureKey] !== undefined) {
          totalPercentAdjustment += featureRules[featureKey];
          featuresFound.push(feature);
        }
      });
    } 
    // Handle features as object
    else {
      Object.entries(input.features).forEach(([feature, hasFeature]) => {
        if (hasFeature && typeof feature === 'string') {
          const featureKey = feature.toLowerCase();
          if (featureRules[featureKey] !== undefined) {
            totalPercentAdjustment += featureRules[featureKey];
            featuresFound.push(feature);
          }
        }
      });
    }
    
    const basePrice = input.basePrice || 0;
    const impact = Math.round(basePrice * totalPercentAdjustment);
    
    // Cap the total adjustment to prevent unrealistic values
    const cappedPercentAdjustment = Math.min(totalPercentAdjustment, 0.15);
    const cappedImpact = Math.round(basePrice * cappedPercentAdjustment);
    
    return {
      factor: 'Features',
      impact: cappedImpact,
      description: featuresFound.length > 0 
        ? `Added value for ${featuresFound.join(', ')}` 
        : 'No valuable features detected',
      name: 'Features',
      value: cappedImpact,
      percentAdjustment: cappedPercentAdjustment
    };
  }
}
