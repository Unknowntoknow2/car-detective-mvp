
import React, { useState } from 'react';
import { FormStepLayout } from './FormStepLayout';
import { FormInitializer } from './initialization/FormInitializer';
import { StepContent } from './steps/StepContent';
import { usePremiumValuationForm } from '@/hooks/usePremiumValuationForm';
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { motion } from 'framer-motion';

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
      case 3: return "Almost halfway there! Every detail helps with accuracy";
      case 4: return "You're making great progress! Let's assess condition now";
      case 5: return "Just a couple more steps to go!";
      case 6: return "Almost done! Let's finalize with features";
      case 7: return "Perfect! Review your information and get your valuation";
      default: return "";
    }
  };

  return (
    <div className="px-2 sm:px-4">
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
        <FormInitializer
          initialLoad={initialLoad}
          setInitialLoad={setInitialLoad}
          loadSavedData={loadSavedData}
          setFormData={setFormData}
          updateStepValidity={updateStepValidity}
        />
        
        <motion.div
          key={`step-${currentStep}`}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full"
        >
          <StepContent
            currentStep={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateStepValidity={updateStepValidity}
            isFormValid={isFormValid}
            handleSubmit={handleSubmit}
            handleReset={handleFullReset}
            valuationId={valuationId}
          />
        </motion.div>
      </FormStepLayout>
    </div>
  );
}
