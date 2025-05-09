
import { useState, useCallback, useEffect } from 'react';
import { getFeatureAdjustments } from '@/utils/adjustments/features';

interface FeatureCalculatorProps {
  initialBasePrice?: number;
  initialFeatures?: string[];
  initialMileage?: number;
}

interface FeatureValue {
  name: string;
  impact: number;
}

export function useFeatureCalculator({
  initialBasePrice = 25000,
  initialFeatures = [],
  initialMileage = 50000
}: FeatureCalculatorProps = {}) {
  const [basePrice, setBasePrice] = useState(initialBasePrice);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);
  const [mileage, setMileage] = useState(initialMileage);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState<{
    totalValue: number;
    featureValues: FeatureValue[];
    mileageAdjustment: number;
    baseValue: number;
  }>({
    totalValue: initialBasePrice,
    featureValues: [],
    mileageAdjustment: 0,
    baseValue: initialBasePrice
  });

  // Reset calculation status when inputs change
  useEffect(() => {
    if (hasCalculated) {
      setHasCalculated(false);
    }
  }, [basePrice, selectedFeatures, mileage]);

  const calculate = useCallback(() => {
    setIsCalculating(true);
    
    // Simulate API delay for visual feedback
    setTimeout(() => {
      // Calculate feature adjustments
      const featureAdjustments = getFeatureAdjustments({
        features: selectedFeatures,
        basePrice
      });
      
      // Calculate mileage impact (simple formula for demonstration)
      const mileageAdjustment = Math.round((100000 - mileage) * 0.00002 * basePrice);
      
      // Calculate final value
      const totalValue = basePrice + featureAdjustments.totalAdjustment + mileageAdjustment;
      
      setResults({
        totalValue,
        featureValues: featureAdjustments.featuresApplied,
        mileageAdjustment,
        baseValue: basePrice
      });
      
      setIsCalculating(false);
      setHasCalculated(true);
    }, 800);
  }, [basePrice, selectedFeatures, mileage]);

  const toggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) 
        : [...prev, featureId]
    );
  }, []);

  const reset = useCallback(() => {
    setBasePrice(initialBasePrice);
    setSelectedFeatures(initialFeatures);
    setMileage(initialMileage);
    setHasCalculated(false);
  }, [initialBasePrice, initialFeatures, initialMileage]);

  return {
    // Inputs
    basePrice,
    setBasePrice,
    selectedFeatures,
    setSelectedFeatures,
    toggleFeature,
    mileage,
    setMileage,
    
    // Actions
    calculate,
    reset,
    isCalculating,
    hasCalculated,
    
    // Results
    results
  };
}
