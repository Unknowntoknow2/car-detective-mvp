
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/types/premium-valuation';
import { useFormValidation } from './useFormValidation';
import { useStepNavigation } from './useStepNavigation';
import { useValuationSubmit } from './useValuationSubmit';
import { toast } from 'sonner';

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
  const { valuationId, handleSubmit: submitValuation, isSubmitting, submitError } = useValuationSubmit();

  // Validation rules for each step
  const validateStep = (step: number, data: FormData): boolean => {
    switch (step) {
      case 1: // Vehicle Identification
        return !!data.make && !!data.model && !!data.year;
      
      case 2: // Mileage
        return data.mileage !== null && data.mileage > 0;
      
      case 3: // Fuel Type
        return data.fuelType !== null && data.fuelType !== '';
      
      case 4: // Features
        return true; // Features are optional
      
      case 5: // Condition
        return data.condition >= 0 && data.condition <= 100 && !!data.conditionLabel;
      
      case 6: // Accident History
        // Only require description if hasAccident is true
        return !data.hasAccident || (data.hasAccident && !!data.accidentDescription);
      
      case 7: // Review and Submit
        return isFormValid;
      
      default:
        return false;
    }
  };

  // Update step validity whenever form data changes
  useEffect(() => {
    updateStepValidity(currentStep, validateStep(currentStep, formData));
  }, [formData, currentStep, updateStepValidity]);

  // Load any vehicle data that was identified from lookup tabs
  useEffect(() => {
    const savedVehicleData = localStorage.getItem("premium_vehicle");
    if (savedVehicleData) {
      try {
        const vehicleData = JSON.parse(savedVehicleData);
        setFormData(prev => ({
          ...prev,
          ...vehicleData
        }));
        
        // Mark the first step as valid since we have vehicle identification
        if (vehicleData.make && vehicleData.model && vehicleData.year) {
          updateStepValidity(1, true);
        }
        
        toast.success("Vehicle information loaded from previous lookup");
      } catch (error) {
        console.error("Error parsing saved vehicle data:", error);
      }
    }
  }, [updateStepValidity]);

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all form data? This action cannot be undone.");
    
    if (confirmReset) {
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
      
      // Clear any cached data
      localStorage.removeItem("premium_vehicle");
      sessionStorage.removeItem("analyzed_vehicle");
      
      toast.info("Form data has been reset");
    }
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
    isSubmitting,
    submitError,
    handleSubmit: () => submitValuation(formData, user, isFormValid),
    validateStep
  };
};
