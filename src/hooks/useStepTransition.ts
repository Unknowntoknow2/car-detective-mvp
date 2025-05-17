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

  // Define step visibility logic - ensure all steps are properly connected
  useEffect(() => {
    setStepConfigs({
      1: {
        component: 'VehicleIdentificationStep',
        shouldShow: true,
        props: { lookupVehicle, isLoading }
      },
      2: {
        component: 'VehicleDetailsStep',
        // Step 2 should be shown as long as we have basic vehicle info
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      3: {
        component: 'AccidentHistoryStep',
        // Step 3 should follow after step 2, requiring vehicle details
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      4: {
        component: 'FeatureSelectionStep',
        // Step 4 should follow after step 3
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      5: {
        component: 'ConditionStep',
        // Step 5 should follow after step 4
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      6: {
        component: 'PhotoUploadStep',
        // Step 6 should follow after step 5
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      7: {
        component: 'DrivingBehaviorStep',
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      8: {
        component: 'ReviewSubmitStep',
        shouldShow: Boolean(formData.make && formData.model && formData.year)
      },
      9: {
        component: 'ValuationResultStep',
        shouldShow: Boolean(formData.valuationId)
      }
    });
  }, [formData.make, formData.model, formData.year, formData.valuationId, isLoading, lookupVehicle]);

  const getStepConfig = useCallback((step: number): StepConfig | null => {
    return stepConfigs[step] || null;
  }, [stepConfigs]);

  // Add the findNextValidStep method to ensure we move sequentially
  const findNextValidStep = useCallback((currentStep: number, direction: number): number => {
    // Simply increment or decrement by one to ensure sequential navigation
    return currentStep + direction;
  }, []);

  return {
    getStepConfig,
    findNextValidStep
  };
}
