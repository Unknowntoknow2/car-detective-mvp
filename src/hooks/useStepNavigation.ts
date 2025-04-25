
import { useState } from 'react';
import { FormData } from '@/types/premium-valuation';

export const useStepNavigation = (formData: FormData) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      let nextStep = currentStep + 1;
      while (nextStep <= totalSteps && 
             ((nextStep === 2 && formData.mileage !== null) || 
              (nextStep === 3 && formData.fuelType !== null))) {
        nextStep++;
      }
      setCurrentStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      while (prevStep >= 1 && 
             ((prevStep === 2 && formData.mileage !== null) || 
              (prevStep === 3 && formData.fuelType !== null))) {
        prevStep--;
      }
      setCurrentStep(prevStep);
    }
  };

  return {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep
  };
};
