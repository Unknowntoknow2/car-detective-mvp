
import { useState, useEffect } from 'react';
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
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { toast } from 'sonner';

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
  
  // Initialize form data from localStorage
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    const savedData = localStorage.getItem('valuationForm');
    if (savedData && initialLoad) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && parsedData.identifierType) {
          setFormData(parsedData);
          toast.info("Restored your previous form data");
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem('valuationForm');
      }
      setInitialLoad(false);
    }
  }, [initialLoad, setFormData]);
  
  // Auto-save form data
  const { clearSavedForm } = useFormAutosave(formData);
  
  // Enhanced reset function
  const handleFullReset = () => {
    handleReset();
    clearSavedForm();
    toast.success("Form has been reset");
  };

  return (
    <FormStepLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      isStepValid={stepValidities[currentStep]}
      onNext={goToNextStep}
      onPrevious={goToPreviousStep}
      stepValidities={stepValidities}
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
        handleReset={handleFullReset}
        isFormValid={isFormValid}
      />

      <ValuationResult valuationId={valuationId} />
    </FormStepLayout>
  );
}
