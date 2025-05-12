
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FormData } from '@/types/premium-valuation';
import { useFormValidation } from './useFormValidation';
import { useStepNavigation } from './useStepNavigation';
import { useValuationSubmit } from './useValuationSubmit';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/contexts/AuthContext';

// Number of minutes to auto-save form data
const AUTO_SAVE_INTERVAL = 1; // minutes

export const usePremiumValuationForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: 0,
    mileage: undefined,
    fuelType: null,
    features: [],
    condition: '50',  // Store as string
    conditionLabel: 'Fair',
    hasAccident: 'no',  // Store as string instead of boolean
    accidentDescription: '',
    zipCode: '',
    identifierType: 'vin',
    identifier: '',
    drivingProfile: 'Normal',  // Default driving profile
    bestPhotoUrl: undefined
  });

  const { isFormValid, stepValidities, updateStepValidity } = useFormValidation(7);  // 7 steps total
  const { currentStep, totalSteps, goToNextStep, goToPreviousStep, goToStep } = useStepNavigation(formData);
  const { valuationId, handleSubmit: submitValuation, isSubmitting, submitError } = useValuationSubmit();

  // Load saved form data from sessionStorage on component mount
  useEffect(() => {
    try {
      const savedFormData = sessionStorage.getItem('premium_form_data');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData) as FormData;
        setFormData(parsedData);
        toast.info("Restored your previously entered information", {
          duration: 3000,
          position: 'bottom-center'
        });
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }, []);

  // Auto-save form data to sessionStorage periodically
  useEffect(() => {
    const saveFormData = () => {
      try {
        sessionStorage.setItem('premium_form_data', JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    };

    // Save immediately when formData changes
    saveFormData();
    
    // Also set up periodic saving
    const intervalId = setInterval(saveFormData, AUTO_SAVE_INTERVAL * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [formData]);

  // Validation rules for each step
  const validateStep = (step: number, data: FormData): boolean => {
    switch (step) {
      case 1: // Vehicle Identification
        return !!data.make && !!data.model && !!data.year;
      
      case 2: // Vehicle Details
        return data.mileage !== undefined && data.mileage > 0 && !!data.fuelType && !!data.zipCode;
      
      case 3: // Features
        return true; // Features are optional
      
      case 4: // Condition
        // Convert string to number for comparison
        const conditionValue = data.condition ? Number(data.condition) : 0;
        return conditionValue >= 0 && conditionValue <= 100 && !!data.conditionLabel;
      
      case 5: // Photo Upload
        return true; // Photos are optional but helpful
      
      case 6: // Driving Profile
        return !!data.drivingProfile; // Must have a driving profile
      
      case 7: // Review and Submit
        // Check if all required fields are present
        return !!data.make && 
               !!data.model && 
               !!data.year && 
               data.mileage !== undefined && 
               data.mileage > 0 && 
               !!data.fuelType && 
               !!data.zipCode && 
               !!data.condition && 
               !!data.conditionLabel;
      
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
        
        // Only clear from localStorage after we've loaded it successfully
        localStorage.removeItem("premium_vehicle");
      } catch (error) {
        console.error("Error parsing saved vehicle data:", error);
      }
    }
  }, [updateStepValidity]);

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all form data? This action cannot be undone.");
    
    if (confirmReset) {
      // Clear form data
      setFormData({
        make: '',
        model: '',
        year: 0,
        mileage: undefined,
        fuelType: null,
        features: [],
        condition: '50',  // Store as string
        conditionLabel: 'Fair',
        hasAccident: 'no',  // Store as string
        accidentDescription: '',
        zipCode: '',
        identifierType: 'vin',
        identifier: '',
        drivingProfile: 'Normal',
        bestPhotoUrl: undefined
      });
      
      // Clear any cached data
      localStorage.removeItem("premium_vehicle");
      sessionStorage.removeItem("analyzed_vehicle");
      sessionStorage.removeItem("premium_form_data");
      sessionStorage.removeItem("premium_current_step");
      
      // Reset to first step
      goToStep(1);
      
      toast.info("Form data has been reset");
    }
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please sign in to submit your valuation");
      return;
    }
    
    // Instead of trying to convert our custom User type to Supabase User type,
    // pass along the required properties that the submitValuation function needs
    return submitValuation(formData, {
      id: user.id,
      email: user.email || '',
      app_metadata: user.app_metadata || {},
      user_metadata: user.user_metadata || {},
    }, isFormValid);
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
    goToStep,
    handleReset,
    isSubmitting,
    submitError,
    handleSubmit,
    validateStep
  };
};
