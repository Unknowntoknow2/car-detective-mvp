
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { VehicleIdentificationStep } from './VehicleIdentificationStep';
import MileageStep from './MileageStep';
import { FuelTypeStep } from './FuelTypeStep';
import { FeatureSelectionStep } from './FeatureSelectionStep';
import { ConditionStep } from './ConditionStep';
import { AccidentHistoryStep } from './AccidentHistoryStep';
import { ReviewSubmitStep } from './ReviewSubmitStep';
import { ValuationResult } from './ValuationResult';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { useStepHandler } from '@/hooks/useStepHandler';

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
  const { lookupVehicle, isLoading } = useVehicleLookup();
  const { handleStepChange } = useStepHandler(
    currentStep,
    formData,
    setFormData,
    updateStepValidity,
    lookupVehicle,
    isLoading
  );

  const stepConfig = handleStepChange(currentStep);
  
  const renderStep = () => {
    const commonProps = {
      step: currentStep,
      formData,
      setFormData,
      updateValidity: updateStepValidity
    };

    switch (currentStep) {
      case 1:
        return (
          <VehicleIdentificationStep
            {...commonProps}
            lookupVehicle={lookupVehicle}
            isLoading={isLoading}
          />
        );
      case 2:
        return formData.mileage === null && <MileageStep {...commonProps} />;
      case 3:
        return formData.fuelType === null && <FuelTypeStep {...commonProps} />;
      case 4:
        return <FeatureSelectionStep {...commonProps} />;
      case 5:
        return <ConditionStep {...commonProps} />;
      case 6:
        return <AccidentHistoryStep {...commonProps} />;
      case 7:
        return (
          <ReviewSubmitStep
            {...commonProps}
            isFormValid={isFormValid}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}
      {valuationId && <ValuationResult valuationId={valuationId} />}
    </>
  );
}
