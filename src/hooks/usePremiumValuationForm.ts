
import { useState } from 'react';

// Initialize the form state
const initialFormState = {
  zipCode: '',
  condition: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
  year: new Date().getFullYear(),
  make: '',
  model: '',
  mileage: 0,
  // Additional fields can be added as optional properties
  isPremium: false
};

export function usePremiumValuationForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Steps for the form
  const steps = [
    { id: 'vehicle-details', label: 'Vehicle Details' },
    { id: 'condition', label: 'Condition' },
    { id: 'features', label: 'Features' },
    { id: 'photos', label: 'Photos' },
    { id: 'review', label: 'Review' },
  ];
  
  // Update form data
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };
  
  // Move to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Move to a specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentStep(0);
    setIsValid(false);
  };
  
  // Upgrade to premium
  const upgradeToPremium = () => {
    setIsPremium(true);
    setFormData(prev => ({
      ...prev,
      isPremium: true
    }));
  };
  
  // Submit the form
  const submitForm = async () => {
    // Implementation for form submission
    return { success: true, data: formData };
  };
  
  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    steps,
    isValid,
    setIsValid,
    resetForm,
    submitForm,
    isPremium,
    upgradeToPremium,
  };
}
