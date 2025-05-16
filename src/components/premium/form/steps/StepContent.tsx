
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { VehicleIdentificationForm } from './vehicle-identification/VehicleIdentificationForm';
import { VehicleDetailsForm } from './vehicle-details/VehicleDetailsForm';
import { FeatureSelectionForm } from './feature-selection/FeatureSelectionForm';
import { ConditionForm } from './condition/ConditionForm';
import { PhotoUploadForm } from './photo-upload/PhotoUploadForm';
import { DrivingBehaviorForm } from './driving-behavior/DrivingBehaviorForm';
import { ReviewSubmitForm } from './review/ReviewSubmitForm';
import { AccidentHistoryForm } from './accident-history/AccidentHistoryForm';

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => Promise<string | null>;
  handleReset: () => void;
  valuationId?: string | null;
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
  switch (currentStep) {
    case 1:
      return (
        <VehicleIdentificationForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 2:
      return (
        <VehicleDetailsForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 3:
      return (
        <AccidentHistoryForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 4:
      return (
        <FeatureSelectionForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 5:
      return (
        <ConditionForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 6:
      return (
        <PhotoUploadForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 7:
      return (
        <DrivingBehaviorForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
          goToNextStep={goToNextStep}
          step={currentStep}
        />
      );
    case 8:
      return (
        <ReviewSubmitForm
          formData={formData}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          valuationId={valuationId}
          step={currentStep}
        />
      );
    default:
      return null;
  }
}
