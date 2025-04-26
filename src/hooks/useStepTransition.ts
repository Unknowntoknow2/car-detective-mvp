
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

  return { getStepConfig };
}
