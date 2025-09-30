
import { useState, useCallback } from "react";
// Inline interface since manual entry types were removed
interface ManualEntryFormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  zipCode: string;
  [key: string]: any;
}

type LookupType = "vin" | "plate" | "manual" | "photo";

interface UseStepNavigationProps {
  initialStep?: number;
  totalSteps: number;
  onLookup: (type: LookupType, identifier: string, state?: string, manualData?: any) => Promise<void>;
}

export function useStepNavigation({ 
  initialStep = 1, 
  totalSteps, 
  onLookup 
}: UseStepNavigationProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = useCallback(async (
    ...args: Parameters<typeof onLookup>
  ) => {
    setIsLoading(true);
    try {
      await onLookup(...args);
    } finally {
      setIsLoading(false);
    }
  }, [onLookup]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    handleLookup,
    isLoading,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
}
