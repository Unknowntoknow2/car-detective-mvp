
import React, { useState, useEffect } from 'react';
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import MileageStep from './steps/MileageStep';
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
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

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
    isSubmitting,
    submitError,
    handleSubmit
  } = usePremiumValuationForm();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const [stepCompletionStatus, setStepCompletionStatus] = useState<Record<number, boolean>>({});
  const { loadSavedData, clearSavedForm } = useFormAutosave(formData);
  
  useEffect(() => {
    if (initialLoad) {
      // First, try to load from formData autosave
      const savedFormData = loadSavedData();
      
      // Then, check if we have vehicle data from the lookup tabs
      const savedVehicleData = localStorage.getItem("premium_vehicle");
      
      if (savedVehicleData) {
        try {
          const vehicleData = JSON.parse(savedVehicleData);
          // Merge with any existing form data or use the vehicle data as a base
          setFormData(prev => ({
            ...prev,
            ...vehicleData
          }));
          
          // If we loaded vehicle data from lookup, mark the first step as valid
          updateStepValidity(1, true);
          
          // Remove the data from localStorage so it doesn't persist between sessions
          localStorage.removeItem("premium_vehicle");
          
          toast.success("Vehicle information loaded from previous lookup");
        } catch (error) {
          console.error("Error parsing saved vehicle data:", error);
        }
      } else if (savedFormData) {
        setFormData(savedFormData);
      }
      
      setInitialLoad(false);
    }
  }, [initialLoad, loadSavedData, setFormData, updateStepValidity]);
  
  useEffect(() => {
    setStepCompletionStatus(prevStatus => ({
      ...prevStatus,
      [currentStep]: stepValidities[currentStep]
    }));
  }, [stepValidities, currentStep]);
  
  const handleFullReset = () => {
    handleReset();
    clearSavedForm();
  };

  const getStepEncouragementMessage = () => {
    switch (currentStep) {
      case 1: return "Start by identifying your vehicle";
      case 2: return "Great! Now let's gather some key details";
      case 3: return "Almost halfway there! Every detail helps with accuracy";
      case 4: return "You're making great progress! Let's assess condition now";
      case 5: return "Just a couple more steps to go!";
      case 6: return "Almost done! Let's finalize with features";
      case 7: return "Perfect! Review your information and get your valuation";
      default: return "";
    }
  };

  const renderStepWithAnimation = (stepContent: React.ReactNode) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={`step-${currentStep}`}
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {stepContent}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <FormStepLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      isStepValid={stepValidities[currentStep]}
      onNext={goToNextStep}
      onPrevious={goToPreviousStep}
      stepValidities={stepValidities}
      stepCompletionStatus={stepCompletionStatus}
      encouragementMessage={getStepEncouragementMessage()}
    >
      {renderStepWithAnimation(
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
              handleReset={handleFullReset}
            />
          )}

          {valuationId && <ValuationResult valuationId={valuationId} />}
        </>
      )}
    </FormStepLayout>
  );
}
