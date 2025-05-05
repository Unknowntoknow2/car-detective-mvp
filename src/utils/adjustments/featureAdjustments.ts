
/**
 * Feature Adjustment Calculator
 * Calculates value adjustments based on premium vehicle features.
 */

/**
 * Premium feature value data
 * Values represent both percentage and fixed amount adjustments to the base value
 */
interface FeatureValue {
  name: string;
  percentValue: number;  // Percentage adjustment
  fixedValue: number;    // Fixed dollar adjustment
  description: string;   // Description of the feature
}

/**
 * Premium feature value database
 * In a production environment, this would be fetched from a database or API
 */
const PREMIUM_FEATURES: Record<string, FeatureValue> = {
  // Safety features
  'adaptive cruise control': {
    name: 'Adaptive Cruise Control',
    percentValue: 0.01,
    fixedValue: 300,
    description: 'Automatically adjusts speed to maintain safe following distance'
  },
  'blind spot monitoring': {
    name: 'Blind Spot Monitoring',
    percentValue: 0.005,
    fixedValue: 250,
    description: 'Alerts driver when vehicles are in blind spots'
  },
  'lane departure warning': {
    name: 'Lane Departure Warning',
    percentValue: 0.005,
    fixedValue: 200,
    description: 'Alerts driver when vehicle drifts out of lane'
  },
  'automatic emergency braking': {
    name: 'Automatic Emergency Braking',
    percentValue: 0.01,
    fixedValue: 300,
    description: 'Automatically applies brakes to prevent collisions'
  },
  
  // Comfort features
  'leather seats': {
    name: 'Leather Seats',
    percentValue: 0.015,
    fixedValue: 800,
    description: 'Premium leather upholstery'
  },
  'heated seats': {
    name: 'Heated Seats',
    percentValue: 0.01,
    fixedValue: 400,
    description: 'Seats with heating elements for cold weather comfort'
  },
  'ventilated seats': {
    name: 'Ventilated Seats',
    percentValue: 0.01,
    fixedValue: 450,
    description: 'Seats with cooling ventilation for hot weather comfort'
  },
  'heated steering wheel': {
    name: 'Heated Steering Wheel',
    percentValue: 0.005,
    fixedValue: 200,
    description: 'Steering wheel with heating elements'
  },
  
  // Technology features
  'navigation system': {
    name: 'Navigation System',
    percentValue: 0.01,
    fixedValue: 500,
    description: 'Built-in GPS navigation system'
  },
  'premium audio': {
    name: 'Premium Audio System',
    percentValue: 0.015,
    fixedValue: 700,
    description: 'High-end branded audio system with enhanced sound quality'
  },
  'head-up display': {
    name: 'Head-Up Display',
    percentValue: 0.01,
    fixedValue: 400,
    description: 'Projects information onto windshield in driver\'s line of sight'
  },
  'wireless charging': {
    name: 'Wireless Charging',
    percentValue: 0.005,
    fixedValue: 150,
    description: 'Wireless smartphone charging pad'
  },
  
  // Exterior features
  'sunroof': {
    name: 'Sunroof/Moonroof',
    percentValue: 0.01,
    fixedValue: 600,
    description: 'Opening roof panel for light and ventilation'
  },
  'panoramic roof': {
    name: 'Panoramic Roof',
    percentValue: 0.015,
    fixedValue: 900,
    description: 'Extended glass roof covering most of vehicle ceiling'
  },
  'alloy wheels': {
    name: 'Premium Alloy Wheels',
    percentValue: 0.005,
    fixedValue: 350,
    description: 'Upgraded alloy wheel design'
  },
  'led headlights': {
    name: 'LED Headlights',
    percentValue: 0.005,
    fixedValue: 300,
    description: 'Advanced LED lighting technology'
  }
};

/**
 * Maximum combined feature adjustment as percentage of base value
 * This prevents overvaluation due to features
 */
const MAX_FEATURE_ADJUSTMENT_PERCENT = 0.12; // 12% maximum

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
 * Gets standardized feature names from raw input
 * Helps match user input to our feature database
 * @param rawFeatures Array of raw feature names
 * @returns Array of standardized feature names
 */
export function standardizeFeatureNames(rawFeatures: string[]): string[] {
  return rawFeatures.map(feature => {
    const normalizedFeature = feature.toLowerCase().trim();
    
    // Map common variations to standard names
    if (normalizedFeature.includes('leather')) return 'leather seats';
    if (normalizedFeature.includes('sun') && normalizedFeature.includes('roof')) return 'sunroof';
    if (normalizedFeature.includes('moon') && normalizedFeature.includes('roof')) return 'sunroof';
    if (normalizedFeature.includes('pano') && normalizedFeature.includes('roof')) return 'panoramic roof';
    if (normalizedFeature.includes('nav')) return 'navigation system';
    if (normalizedFeature.includes('premium') && normalizedFeature.includes('sound')) return 'premium audio';
    if (normalizedFeature.includes('premium') && normalizedFeature.includes('audio')) return 'premium audio';
    if (normalizedFeature.includes('heated') && normalizedFeature.includes('seat')) return 'heated seats';
    if (normalizedFeature.includes('cool') && normalizedFeature.includes('seat')) return 'ventilated seats';
    if (normalizedFeature.includes('vent') && normalizedFeature.includes('seat')) return 'ventilated seats';
    
    // Return as-is if no mapping found
    return normalizedFeature;
  });
}

/**
 * Gets information about a specific feature
 * @param featureName The feature name
 * @returns Feature information or undefined if not found
 */
export function getFeatureInfo(featureName: string): FeatureValue | undefined {
  const normalizedFeature = featureName.toLowerCase().trim();
  return PREMIUM_FEATURES[normalizedFeature];
}

/**
 * Alias for getFeatureAdjustments to maintain compatibility with existing code
 */
export function getPremiumFeaturesAdjustment(features: string[], baseValue: number): number {
  return getFeatureAdjustments(features, baseValue);
}
