
import { FormData } from '@/types/premium-valuation';
import { StepConfig } from '@/types/steps';

export function useStepTransition(
  currentStep: number,
  formData: FormData,
  isLoading: boolean,
  lookupVehicle: (identifierType: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string) => Promise<any>
) {
  const getStepConfig = (step: number): StepConfig | null => {
    switch (step) {
      case 1:
        return {
          component: 'VehicleIdentificationStep',
          shouldShow: true,
          props: {
            lookupVehicle,
            isLoading
          }
        };
      case 2:
        return {
          component: 'MileageStep',
          shouldShow: formData.mileage === null,
          props: {}
        };
      case 3:
        return {
          component: 'FuelTypeStep',
          shouldShow: formData.fuelType === null,
          props: {}
        };
      case 4:
        return {
          component: 'FeatureSelectionStep',
          shouldShow: true,
          props: {}
        };
      case 5:
        return {
          component: 'ConditionStep',
          shouldShow: true,
          props: {}
        };
      case 6:
        return {
          component: 'AccidentHistoryStep',
          shouldShow: true,
          props: {}
        };
      case 7:
        return {
          component: 'ReviewSubmitStep',
          shouldShow: true,
          props: {}
        };
      default:
        return null;
    }
  };

  /**
   * Determines if a step should be skipped based on form data
   * @param step Step number to check
   * @returns Boolean indicating if step should be skipped
   */
  const shouldSkipStep = (step: number): boolean => {
    const config = getStepConfig(step);
    return config ? !config.shouldShow : false;
  };

  /**
   * Finds the next valid step that should be shown
   * @param currentStep Current step number
   * @param direction Direction to move (1 for forward, -1 for backward)
   * @returns Next valid step number
   */
  const findNextValidStep = (currentStep: number, direction: 1 | -1 = 1): number => {
    let nextStep = currentStep + direction;
    
    // Find the next step that should be shown
    while (nextStep >= 1 && nextStep <= 7) {
      if (!shouldSkipStep(nextStep)) {
        return nextStep;
      }
      nextStep += direction;
    }
    
    // If no valid step found, return the current step
    return currentStep;
  };

  return { 
    getStepConfig,
    shouldSkipStep,
    findNextValidStep
  };
}
