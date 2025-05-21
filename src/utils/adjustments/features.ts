
/**
 * Calculate feature adjustments for a vehicle based on selected features and base value
 * @param selectedFeatures Array of feature identifiers
 * @param baseValue Base value of the vehicle
 * @returns Total adjustment amount
 */
export const getFeatureAdjustments = (selectedFeatures: string[], baseValue: number): number => {
  if (!selectedFeatures || selectedFeatures.length === 0 || !baseValue) {
    return 0;
  }
  
  // Feature adjustment values as a percentage of the base value
  const featureValues: Record<string, number> = {
    'leather_seats': 0.03,
    'sunroof': 0.02,
    'navigation': 0.015,
    'premium_audio': 0.02,
    'heated_seats': 0.01,
    'bluetooth': 0.005,
    'backup_camera': 0.01,
    'third_row': 0.025,
    'alloy_wheels': 0.01,
    'remote_start': 0.01,
    'towing_package': 0.03,
    'lane_assist': 0.015,
    'blind_spot': 0.015,
    'parking_sensors': 0.01,
    'adaptive_cruise': 0.02,
    'premium_package': 0.05
  };
  
  // Calculate total adjustment
  let totalAdjustment = 0;
  
  selectedFeatures.forEach(feature => {
    if (featureValues[feature]) {
      totalAdjustment += baseValue * featureValues[feature];
    }
  });
  
  // Apply a diminishing return for large numbers of features
  if (selectedFeatures.length > 5) {
    const diminishingFactor = 1 - ((selectedFeatures.length - 5) * 0.05);
    totalAdjustment *= Math.max(0.7, diminishingFactor);
  }
  
  return Math.round(totalAdjustment);
};
