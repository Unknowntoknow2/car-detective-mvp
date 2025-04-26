
import { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { useStepTransition } from './useStepTransition';
import { useVehicleLookup } from './useVehicleLookup';

export const useStepNavigation = (formData: FormData) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const { isLoading, lookupVehicle } = useVehicleLookup();
  const { findNextValidStep } = useStepTransition(currentStep, formData, isLoading, lookupVehicle);

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      const nextStep = findNextValidStep(currentStep, 1);
      setCurrentStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = findNextValidStep(currentStep, -1);
      setCurrentStep(prevStep);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep
  };
};
