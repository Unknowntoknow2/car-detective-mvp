
/**
 * Feature Adjustment Calculator
 * 
 * Provides precise dollar values for vehicle premium features
 * to ensure accurate valuation adjustments.
 */

/**
 * Exact feature value mapping
 * Defines precise dollar value for each premium feature
 */
export const featureValueMap: Record<string, number> = {
  'Leather Seats': 300,
  'Navigation System': 250,
  'Premium Wheels': 400,
  'Sunroof': 350,
  'Backup Camera': 200,
  'Bluetooth': 150,
  'Remote Start': 250,
  'Heated Seats': 225,
  'Third Row Seating': 450,
  'Premium Sound System': 350,
  'Adaptive Cruise Control': 300,
  'Lane Departure Warning': 200,
  'Blind Spot Monitoring': 250,
  'Panoramic Roof': 500,
  'Parking Sensors': 175,
  'Power Liftgate': 200
};

/**
 * Gets the exact value of a single feature
 * @param feature The feature name
 * @returns The precise dollar value of the feature
 */
export function getFeatureValue(feature: string): number {
  return featureValueMap[feature] ?? 0;
}

/**
 * Calculates the total value of multiple features
 * @param features Array of features to calculate
 * @returns The sum of all feature values
 */
export function calculateTotalFeatureValue(features: string[]): number {
  return features.reduce((total, feature) => {
    return total + getFeatureValue(feature);
  }, 0);
}

/**
 * Gets detailed breakdown of feature values
 * @param features Array of features to calculate
 * @returns Object with each feature and its dollar value
 */
export function getFeatureValueBreakdown(features: string[]): Record<string, number> {
  return features.reduce((breakdown, feature) => {
    const value = getFeatureValue(feature);
    if (value > 0) {
      breakdown[feature] = value;
    }
    return breakdown;
  }, {} as Record<string, number>);
}
