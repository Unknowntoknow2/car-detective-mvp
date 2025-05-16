
import { useState, useCallback } from 'react';

export function useFormValidation(totalSteps: number) {
  const [stepValidities, setStepValidities] = useState<Record<number, boolean>>({});
  
  const updateStepValidity = useCallback((step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  }, []);

  // Modify isFormValid to make it less restrictive
  // Instead of requiring ALL steps to be valid, we'll check that the current final step is valid
  const isFormValid = (currentStep: number): boolean => {
    // For the final step, check if we have at least the first step (vehicle identification) valid
    if (currentStep === totalSteps) {
      return Boolean(stepValidities[1]);
    }
    // For other steps, check the current step's validity
    return Boolean(stepValidities[currentStep]);
  };

  return {
    stepValidities,
    updateStepValidity,
    isFormValid
  };
}
