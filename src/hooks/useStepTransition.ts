
import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/premium-valuation';

interface StepConfig {
  component: string;
  shouldShow: boolean;
  props?: any;
}

export function useStepTransition(
  currentStep: number,
  formData: FormData,
  isLoading: boolean,
  lookupVehicle: (type: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, manualData?: any) => Promise<any>
) {
  const [stepConfigs, setStepConfigs] = useState<Record<number, StepConfig>>({});

  // Define step visibility logic
  useEffect(() => {
    setStepConfigs({
      1: {
        component: 'VehicleIdentificationStep',
        shouldShow: true,
        props: { lookupVehicle, isLoading }
      },
      2: {
        component: 'MileageStep',
        shouldShow: !!formData.make && !!formData.model && !!formData.year
      },
      3: {
        component: 'FuelTypeStep',
        shouldShow: formData.mileage !== null && formData.mileage > 0
      },
      4: {
        component: 'FeatureSelectionStep',
        shouldShow: !!formData.fuelType
      },
      5: {
        component: 'ConditionStep',
        shouldShow: true
      },
      6: {
        component: 'VehicleDetailsStep', // Added VehicleDetailsStep
        shouldShow: true
      },
      7: {
        component: 'PredictionReviewStep', // Added PredictionReviewStep 
        shouldShow: true
      }
    });
  }, [formData.make, formData.model, formData.year, formData.mileage, formData.fuelType, isLoading, lookupVehicle]);

  const getStepConfig = useCallback((step: number): StepConfig | null => {
    return stepConfigs[step] || null;
  }, [stepConfigs]);

  return {
    getStepConfig
  };
}
