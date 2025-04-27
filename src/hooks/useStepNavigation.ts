
import { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { useStepTransition } from './useStepTransition';
import { useVehicleLookup } from './useVehicleLookup';

export const useStepNavigation = (formData: FormData) => {
  // Try to restore the current step from sessionStorage
  const getSavedStep = (): number => {
    try {
      const savedStep = sessionStorage.getItem('premium_current_step');
      return savedStep ? parseInt(savedStep, 10) : 1;
    } catch (error) {
      console.error("Error reading step from sessionStorage:", error);
      return 1;
    }
  };

  const [currentStep, setCurrentStep] = useState(getSavedStep());
  const totalSteps = 7;
  
  const { isLoading, lookupVehicle } = useVehicleLookup();
  const { findNextValidStep } = useStepTransition(currentStep, formData, isLoading, lookupVehicle);

  // Save the current step to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('premium_current_step', currentStep.toString());
    } catch (error) {
      console.error("Error saving step to sessionStorage:", error);
    }
  }, [currentStep]);

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
