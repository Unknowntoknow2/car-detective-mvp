
import { useState, useEffect } from 'react';

export function useFeatureCalculator(selectedFeatures: string[], baseValue: number) {
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [percentageOfBase, setPercentageOfBase] = useState(0);
  
  useEffect(() => {
    if (!baseValue || !selectedFeatures || selectedFeatures.length === 0) {
      setTotalAdjustment(0);
      setPercentageOfBase(0);
      return;
    }
    
    // Calculate the value of all selected features
    // This is a simplified implementation
    const featureValue = selectedFeatures.length * 250;
    
    setTotalAdjustment(featureValue);
    setPercentageOfBase((featureValue / baseValue) * 100);
  }, [selectedFeatures, baseValue]);
  
  return {
    totalAdjustment,
    percentageOfBase
  };
}
