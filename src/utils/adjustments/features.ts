
import { ValuationAdjustment } from '@/utils/valuation/types';

// Add the getFeatureAdjustments function that was missing
export const getFeatureAdjustments = (
  features: string[] = [], 
  baseValue: number = 0, 
  valueMultiplier: number = 1.0
): number => {
  // If no features or invalid values, return 0
  if (!features || features.length === 0 || !baseValue || baseValue <= 0) {
    return 0;
  }
  
  // Calculate total feature value
  const featureValueAdjustment = calculateTotalFeatureValue(features);
  
  // Return the weighted adjustment
  return valueMultiplier * featureValueAdjustment;
};

export const calculateFeatureAdjustments = (
  baseValue: number,
  features: string[] = [], // Default to empty array if undefined
  valueMultiplier: number = 1.0 // Default to 1.0 if undefined
): ValuationAdjustment[] => {
  const adjustments: ValuationAdjustment[] = [];
  
  // If no features or invalid values, return empty adjustments
  if (!features || features.length === 0 || !baseValue || baseValue <= 0) {
    return adjustments;
  }
  
  // Feature value adjustment
  const featureValueAdjustment = calculateTotalFeatureValue(features);
  if (featureValueAdjustment > 0) {
    adjustments.push({
      factor: 'Premium Features',
      impact: valueMultiplier * featureValueAdjustment,
      description: `${features.length} premium features adding value`,
      percentAdjustment: (featureValueAdjustment / baseValue) * 100,
      adjustment: valueMultiplier * featureValueAdjustment
    });
  }
  
  return adjustments;
};

function calculateTotalFeatureValue(features: string[]): number {
  // Map of feature values
  const featureValues: Record<string, number> = {
    'leather': 800,
    'sunroof': 600,
    'navigation': 500,
    'premium_audio': 700,
    'heated_seats': 400,
    'power_seats': 350,
    'third_row': 1000,
    'awd': 1200,
    'alloy_wheels': 450,
    'tow_package': 800
  };
  
  return features.reduce((total, feature) => {
    return total + (featureValues[feature] || 0);
  }, 0);
}
