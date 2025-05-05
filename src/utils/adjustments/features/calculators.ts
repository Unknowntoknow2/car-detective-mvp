
import { PREMIUM_FEATURES } from './database';
import { MAX_FEATURE_ADJUSTMENT_PERCENT } from './types';

/**
 * Gets the total feature adjustments based on the vehicle's premium features
 * @param features Array of feature names
 * @param baseValue The base market value
 * @returns The total dollar impact of all features on the vehicle value
 */
export function getFeatureAdjustments(features: string[], baseValue: number): number {
  let totalPercentAdjustment = 0;
  let totalFixedAdjustment = 0;
  
  // Process each feature
  features.forEach(feature => {
    const normalizedFeature = feature.toLowerCase().trim();
    const featureData = PREMIUM_FEATURES[normalizedFeature];
    
    // If we have data for this feature, add its value
    if (featureData) {
      totalPercentAdjustment += featureData.percentValue;
      totalFixedAdjustment += featureData.fixedValue;
    }
  });
  
  // Apply cap to percentage adjustment
  totalPercentAdjustment = Math.min(totalPercentAdjustment, MAX_FEATURE_ADJUSTMENT_PERCENT);
  
  // Calculate total adjustment (percentage-based + fixed amount)
  return (baseValue * totalPercentAdjustment) + totalFixedAdjustment;
}

/**
 * Gets information about a specific feature
 * @param featureName The feature name
 * @returns Feature information or undefined if not found
 */
export function getFeatureInfo(featureName: string) {
  const normalizedFeature = featureName.toLowerCase().trim();
  return PREMIUM_FEATURES[normalizedFeature];
}

/**
 * Alias for getFeatureAdjustments to maintain compatibility with existing code
 */
export function getPremiumFeaturesAdjustment(features: string[], baseValue: number): number {
  return getFeatureAdjustments(features, baseValue);
}
