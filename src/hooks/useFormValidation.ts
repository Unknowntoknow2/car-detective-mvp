
import { useState, useEffect } from 'react';

export const useFormValidation = (totalSteps: number) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepValidities, setStepValidities] = useState({
    1: false,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  useEffect(() => {
    const allStepsValid = Object.values(stepValidities).every(valid => valid);
    setIsFormValid(allStepsValid);
  }, [stepValidities]);

  return {
    isFormValid,
    stepValidities,
    updateStepValidity
  };
};
