
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/types/premium-valuation';
import { featureOptions } from '@/utils/feature-calculations';
import { useFormValidation } from './useFormValidation';
import { useStepNavigation } from './useStepNavigation';
import { useValuationSubmit } from './useValuationSubmit';

export const usePremiumValuationForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    identifierType: 'vin',
    identifier: '',
    make: '',
    model: '',
    year: 0,
    mileage: null,
    fuelType: null,
    features: [],
    condition: 50,
    conditionLabel: 'Fair',
    hasAccident: false,
    accidentDescription: '',
    zipCode: ''
  });

  const { isFormValid, stepValidities, updateStepValidity } = useFormValidation(7);
  const { currentStep, totalSteps, goToNextStep, goToPreviousStep } = useStepNavigation(formData);
  const { valuationId, handleSubmit } = useValuationSubmit();

  const handleReset = () => {
    setFormData({
      identifierType: 'vin',
      identifier: '',
      make: '',
      model: '',
      year: 0,
      mileage: null,
      fuelType: null,
      features: [],
      condition: 50,
      conditionLabel: 'Fair',
      hasAccident: false,
      accidentDescription: '',
      zipCode: ''
    });
  };

  return {
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
    handleSubmit: () => handleSubmit(formData, user, isFormValid),
    featureOptions
  };
};
