
import { useState, useCallback } from 'react';

export function useFormValidation(totalSteps: number) {
  const [stepValidities, setStepValidities] = useState<Record<number, boolean>>({});
  
  const updateStepValidity = useCallback((step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  }, []);

  const isFormValid = Object.values(stepValidities).length === totalSteps && 
    Object.values(stepValidities).every(Boolean);

  return {
    stepValidities,
    updateStepValidity,
    isFormValid
  };
}
