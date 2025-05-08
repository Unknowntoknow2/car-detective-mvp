
import { RulesEngineInput } from '../rules/types';

// Mapping of features to their impact values
export const featureImpacts = {
  'leather_seats': 0.03,        // 3%
  'navigation': 0.02,           // 2%
  'premium_audio': 0.015,       // 1.5%
  'panoramic_roof': 0.025,      // 2.5%
  'third_row_seating': 0.02,    // 2%
  'heated_seats': 0.01,         // 1%
  'cooled_seats': 0.015,        // 1.5%
  'advanced_safety': 0.02,      // 2%
  'towing_package': 0.03,       // 3%
  'off_road_package': 0.04,     // 4%
  'performance_package': 0.05   // 5%
};

export const featureDescriptions = {
  'leather_seats': 'Leather Seating',
  'navigation': 'Navigation System',
  'premium_audio': 'Premium Audio System',
  'panoramic_roof': 'Panoramic Sunroof',
  'third_row_seating': 'Third Row Seating',
  'heated_seats': 'Heated Seats',
  'cooled_seats': 'Ventilated/Cooled Seats',
  'advanced_safety': 'Advanced Safety Features',
  'towing_package': 'Towing Package',
  'off_road_package': 'Off-Road Package',
  'performance_package': 'Performance Package'
};

export const getFeatureAdjustments = (input: RulesEngineInput): { 
  totalAdjustment: number;
  featuresApplied: Array<{name: string; impact: number}>;
} => {
  // Use premiumFeatures if provided or fall back to features
  const features = Array.isArray(input.premiumFeatures) ? input.premiumFeatures : 
                  (Array.isArray(input.features) ? input.features : []);
  
  let totalAdjustment = 0;
  const featuresApplied = [];
  
  for (const feature of features) {
    const featureKey = typeof feature === 'string' ? 
      feature.toLowerCase().replace(/\s+/g, '_') : '';
      
    if (featureKey && featureImpacts[featureKey as keyof typeof featureImpacts]) {
      const impact = featureImpacts[featureKey as keyof typeof featureImpacts] * input.basePrice;
      totalAdjustment += impact;
      featuresApplied.push({
        name: featureDescriptions[featureKey as keyof typeof featureDescriptions] || featureKey,
        impact
      });
    }
  }
  
  // Apply cap to total adjustment (max 15% of base price)
  const maxAdjustment = input.basePrice * 0.15;
  if (totalAdjustment > maxAdjustment) {
    const ratio = maxAdjustment / totalAdjustment;
    totalAdjustment = maxAdjustment;
    
    // Scale down each feature impact proportionally
    for (let i = 0; i < featuresApplied.length; i++) {
      featuresApplied[i].impact *= ratio;
    }
  }
  
  return {
    totalAdjustment,
    featuresApplied
  };
};
