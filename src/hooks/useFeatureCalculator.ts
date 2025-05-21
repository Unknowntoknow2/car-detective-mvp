
import { useState, useEffect } from 'react';
import { getFeatureAdjustments } from '@/utils/adjustments/features';

export interface FeatureAdjustmentResult {
  totalValue: number;
  features: string[];
  featuresApplied: number;
  totalAdjustment: number;
}

export const useFeatureCalculator = (
  selectedFeatures: string[] = [],
  baseValue: number = 0
) => {
  const [featureAdjustment, setFeatureAdjustment] = useState<FeatureAdjustmentResult>({
    totalValue: 0,
    features: [],
    featuresApplied: 0,
    totalAdjustment: 0
  });

  // Calculate the feature adjustments whenever selected features change
  useEffect(() => {
    if (!selectedFeatures || selectedFeatures.length === 0 || !baseValue) {
      setFeatureAdjustment({
        totalValue: 0,
        features: [],
        featuresApplied: 0,
        totalAdjustment: 0
      });
      return;
    }
    
    // Calculate feature value using the utility function
    const totalValue = getFeatureAdjustments(selectedFeatures, baseValue);
    
    // Create an adjustment result
    const result: FeatureAdjustmentResult = {
      totalValue,
      features: selectedFeatures,
      featuresApplied: selectedFeatures.length,
      totalAdjustment: totalValue
    };
    
    setFeatureAdjustment(result);
  }, [selectedFeatures, baseValue]);

  return {
    totalValue: featureAdjustment.totalValue,
    totalAdjustment: featureAdjustment.totalAdjustment,
    features: featureAdjustment.features,
    featuresApplied: featureAdjustment.featuresApplied,
    percentageOfBase: baseValue > 0 ? (featureAdjustment.totalValue / baseValue) * 100 : 0
  };
};
