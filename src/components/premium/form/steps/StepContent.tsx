import React from 'react';
import { VehicleIdentificationStep } from './VehicleIdentificationStep';
import { FormData } from '@/types/premium-valuation';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';

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
        <ReviewSubmitStep
          step={currentStep}
          formData={formData}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
      );
    case 6:
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Driving Behavior Analysis</h2>
          <p className="text-muted-foreground">
            Your driving habits can affect vehicle value. Upload telematics data or use the slider to indicate your driving style.
          </p>
          
          <DrivingBehaviorInput
            value={formData.drivingProfile || 'Normal'}
            onChange={(value) => setFormData({ ...formData, drivingProfile: value })}
          />
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Conservative driving tends to preserve vehicle components, while aggressive driving may increase wear and tear.
            </p>
          </div>
        </div>
      );
    default:
      return <div>Step not implemented</div>;
  }
}
