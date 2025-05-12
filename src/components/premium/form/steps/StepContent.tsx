
import React from 'react';
import { VehicleIdentificationStep } from './VehicleIdentificationStep';
import { FormData } from '@/types/premium-valuation';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { VehicleDetailsStep } from './VehicleDetailsStep';
import { FeatureSelectionStep } from './FeatureSelectionStep';
import { ConditionStep } from './ConditionStep';
import { PhotoUploadStep } from './PhotoUploadStep';
import { DrivingBehaviorStep } from './DrivingBehaviorStep';
import { ReviewSubmitStep } from './ReviewSubmitStep';
import { ValuationResult } from './ValuationResult';

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  valuationId: string | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export function StepContent({
  currentStep,
  formData,
  setFormData,
  updateStepValidity,
  isFormValid,
  handleSubmit,
  handleReset,
  valuationId,
  goToNextStep,
  goToPreviousStep
}: StepContentProps) {
  const { isLoading, lookupVehicle } = useVehicleLookup();

  // If we have a valuation ID, show the result instead of the form
  if (valuationId) {
    return <ValuationResult valuationId={valuationId} />;
  }

  // Render appropriate step based on currentStep
  switch (currentStep) {
    case 1:
      return (
        <VehicleIdentificationStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          lookupVehicle={lookupVehicle}
          isLoading={isLoading}
          goToNextStep={goToNextStep}
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
        <PhotoUploadStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 6:
      return (
        <DrivingBehaviorStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 7:
      return (
        <ReviewSubmitStep
          step={currentStep}
          formData={formData}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
      );
    default:
      return <div>Step not implemented</div>;
  }
}
