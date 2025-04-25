
import { useCallback, useState } from 'react';

export function useFormSteps(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep
  };
}
