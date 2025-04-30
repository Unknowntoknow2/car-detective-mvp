
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { VehicleIdentificationStep } from './VehicleIdentificationStep';
import { VehicleDetailsStep } from './VehicleDetailsStep';
import { FeatureSelectionStep } from './FeatureSelectionStep';
import { ConditionStep } from './ConditionStep';
import { ReviewSubmitStep } from './ReviewSubmitStep';
import { ValuationResultStep } from './ValuationResultStep';
import { ValuationResult } from '../ValuationResult';

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  valuationId?: string;
}

export function StepContent({
  currentStep,
  formData,
  setFormData,
  updateStepValidity,
  isFormValid,
  handleSubmit,
  handleReset,
  valuationId
}: StepContentProps) {
  
  switch (currentStep) {
    case 1:
      return (
        <VehicleIdentificationStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 2:
      return (
        <VehicleDetailsStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 3:
      return (
        <FeatureSelectionStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 4:
      return (
        <ConditionStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 5:
      return (
        <ReviewSubmitStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          isFormValid={isFormValid}
          onSubmit={handleSubmit}
        />
      );
    case 6:
      // Final valuation results step
      return (
        <ValuationResultStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    default:
      return null;
  }
}
