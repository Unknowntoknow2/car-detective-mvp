
import React, { useState } from 'react';
import { FormStepLayout } from './FormStepLayout';
import { FormInitializer } from './initialization/FormInitializer';
import { StepContent } from './steps/StepContent';
import { usePremiumValuationForm } from '@/hooks/usePremiumValuationForm';
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { motion } from 'framer-motion';
import { FormSteps } from './FormSteps';

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export function PremiumValuationForm() {
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

  React.useEffect(() => {
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
      case 3: return "Tell us about any accident history";
      case 4: return "Select premium features for your vehicle";
      case 5: return "Let's assess the condition of your vehicle";
      case 6: return "Share some photos for a more accurate valuation";
      case 7: return "Tell us about your driving behavior";
      case 8: return "Perfect! Review your information and get your valuation";
      default: return "";
    }
  };

  // Use stepValidities directly as a boolean value
  const currentStepValid = stepValidities[currentStep];

  return (
    <div className="px-2 sm:px-4">
      <FormStepLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        isStepValid={currentStepValid}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
        stepValidities={stepValidities}
        stepCompletionStatus={stepCompletionStatus}
        encouragementMessage={getStepEncouragementMessage()}
      >
        <FormInitializer
          initialLoad={initialLoad}
          setInitialLoad={setInitialLoad}
          loadSavedData={loadSavedData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
        />
        
        <FormSteps currentStep={currentStep}>
          <StepContent
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateStepValidity={updateStepValidity}
            isFormValid={currentStepValid}
            handleSubmit={handleSubmit}
            handleReset={handleFullReset}
            valuationId={valuationId}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        </FormSteps>
      </FormStepLayout>
    </div>
  );
}
