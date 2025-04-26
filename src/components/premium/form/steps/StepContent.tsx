
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
import { useStepTransition } from '@/hooks/useStepTransition';

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
  const { getStepConfig } = useStepTransition(currentStep, formData, isLoading, lookupVehicle);

  const commonProps = {
    step: currentStep,
    formData,
    setFormData,
    updateValidity: updateStepValidity
  };

  const renderComponent = () => {
    const config = getStepConfig(currentStep);
    if (!config || !config.shouldShow) return null;

    const stepProps = { ...commonProps, ...config.props };

    switch (config.component) {
      case 'VehicleIdentificationStep':
        return <VehicleIdentificationStep {...stepProps} lookupVehicle={lookupVehicle} isLoading={isLoading} />;
      case 'MileageStep':
        return <MileageStep {...stepProps} />;
      case 'FuelTypeStep':
        return <FuelTypeStep {...stepProps} />;
      case 'FeatureSelectionStep':
        return <FeatureSelectionStep {...stepProps} />;
      case 'ConditionStep':
        return <ConditionStep {...stepProps} />;
      case 'AccidentHistoryStep':
        return <AccidentHistoryStep {...stepProps} />;
      case 'ReviewSubmitStep':
        return <ReviewSubmitStep {...stepProps} isFormValid={isFormValid} handleSubmit={handleSubmit} handleReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderComponent()}
      {valuationId && <ValuationResult valuationId={valuationId} />}
    </>
  );
}
