
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

  return (
    <>
      {currentStep === 1 && (
        <VehicleIdentificationStep 
          step={1} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          lookupVehicle={lookupVehicle}
          isLoading={isLoading}
        />
      )}
      
      {currentStep === 2 && formData.mileage === null && (
        <MileageStep 
          step={2} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {currentStep === 3 && formData.fuelType === null && (
        <FuelTypeStep 
          step={3} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {currentStep === 4 && (
        <FeatureSelectionStep 
          step={4} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {currentStep === 5 && (
        <ConditionStep 
          step={5} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {currentStep === 6 && (
        <AccidentHistoryStep 
          step={6} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {currentStep === 7 && (
        <ReviewSubmitStep 
          step={7} 
          formData={formData}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
      )}

      {valuationId && <ValuationResult valuationId={valuationId} />}
    </>
  );
}
