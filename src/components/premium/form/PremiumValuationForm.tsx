
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import { MileageStep } from './steps/MileageStep';
import { FuelTypeStep } from './steps/FuelTypeStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { ConditionStep } from './steps/ConditionStep';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { FormStepLayout } from './FormStepLayout';
import { ValuationResult } from './ValuationResult';
import { usePremiumValuationForm } from '@/hooks/usePremiumValuationForm';

export function PremiumValuationForm() {
  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();
  const {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    isFormValid,
    valuationId,
    stepValidities,
    updateStepValidity,
    goToNextStep,
    goToPreviousStep,
    handleReset,
    handleSubmit,
    featureOptions
  } = usePremiumValuationForm();

  return (
    <FormStepLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      isStepValid={stepValidities[currentStep]}
      onNext={goToNextStep}
      onPrevious={goToPreviousStep}
    >
      <VehicleIdentificationStep 
        step={1} 
        formData={formData} 
        setFormData={setFormData}
        updateValidity={updateStepValidity}
        lookupVehicle={lookupVehicle}
        isLoading={isLoading}
      />
      
      {formData.mileage === null && (
        <MileageStep 
          step={2} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      {formData.fuelType === null && (
        <FuelTypeStep 
          step={3} 
          formData={formData} 
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      )}
      
      <FeatureSelectionStep 
        step={4} 
        formData={formData} 
        setFormData={setFormData}
        updateValidity={updateStepValidity}
        featureOptions={featureOptions}
      />
      
      <ConditionStep 
        step={5} 
        formData={formData} 
        setFormData={setFormData}
        updateValidity={updateStepValidity}
      />
      
      <AccidentHistoryStep 
        step={6} 
        formData={formData} 
        setFormData={setFormData}
        updateValidity={updateStepValidity}
      />
      
      <ReviewSubmitStep 
        step={7} 
        formData={formData}
        featureOptions={featureOptions} 
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        isFormValid={isFormValid}
      />

      <ValuationResult valuationId={valuationId} />
    </FormStepLayout>
  );
}
