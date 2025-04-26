
import { FormData } from '@/types/premium-valuation';

export function useStepHandler(
  currentStep: number,
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  updateStepValidity: (step: number, isValid: boolean) => void,
  lookupVehicle: (identifierType: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string) => Promise<any>,
  isLoading: boolean
) {
  const handleStepChange = (step: number) => {
    switch (step) {
      case 1:
        return {
          component: 'VehicleIdentificationStep',
          props: {
            lookupVehicle,
            isLoading
          }
        };
      case 2:
        return formData.mileage === null ? {
          component: 'MileageStep',
          props: {}
        } : null;
      case 3:
        return formData.fuelType === null ? {
          component: 'FuelTypeStep',
          props: {}
        } : null;
      case 4:
        return {
          component: 'FeatureSelectionStep',
          props: {}
        };
      case 5:
        return {
          component: 'ConditionStep',
          props: {}
        };
      case 6:
        return {
          component: 'AccidentHistoryStep',
          props: {}
        };
      case 7:
        return {
          component: 'ReviewSubmitStep',
          props: {}
        };
      default:
        return null;
    }
  };

  return { handleStepChange };
}
