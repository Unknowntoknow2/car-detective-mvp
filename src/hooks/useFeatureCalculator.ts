<<<<<<< HEAD

import { useState, useEffect } from 'react';

export function useFeatureCalculator(selectedFeatures: string[], baseValue: number) {
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [percentageOfBase, setPercentageOfBase] = useState(0);
  
=======
import { useCallback, useEffect, useState } from "react";
import { getFeatureAdjustments } from "@/utils/adjustments/features";

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
  initialMileage = 50000,
}: FeatureCalculatorProps = {}) {
  const [basePrice, setBasePrice] = useState(initialBasePrice);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialFeatures,
  );
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
    baseValue: initialBasePrice,
  });

  // Reset calculation status when inputs change
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  useEffect(() => {
    if (!baseValue || !selectedFeatures || selectedFeatures.length === 0) {
      setTotalAdjustment(0);
      setPercentageOfBase(0);
      return;
    }
<<<<<<< HEAD
    
    // Calculate the value of all selected features
    // This is a simplified implementation
    const featureValue = selectedFeatures.length * 250;
    
    setTotalAdjustment(featureValue);
    setPercentageOfBase((featureValue / baseValue) * 100);
  }, [selectedFeatures, baseValue]);
  
  return {
    totalAdjustment,
    percentageOfBase
=======
  }, [basePrice, selectedFeatures, mileage]);

  const calculate = useCallback(() => {
    setIsCalculating(true);

    // Simulate API delay for visual feedback
    setTimeout(() => {
      // Calculate feature adjustments
      const featureAdjustments = getFeatureAdjustments({
        features: selectedFeatures,
        basePrice,
      });

      // Calculate mileage impact (simple formula for demonstration)
      const mileageAdjustment = Math.round(
        (100000 - mileage) * 0.00002 * basePrice,
      );

      // Calculate final value
      const totalValue = basePrice + featureAdjustments.totalAdjustment +
        mileageAdjustment;

      setResults({
        totalValue,
        featureValues: featureAdjustments.featuresApplied,
        mileageAdjustment,
        baseValue: basePrice,
      });

      setIsCalculating(false);
      setHasCalculated(true);
    }, 800);
  }, [basePrice, selectedFeatures, mileage]);

  const toggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
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
    results,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
