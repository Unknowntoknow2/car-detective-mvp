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
    mileage: null,
    fuelType: null,
    features: [],
    condition: '50',  // Store as string
    conditionLabel: 'Fair',
    hasAccident: 'no',  // Store as string instead of boolean
    accidentDescription: '',
    zipCode: '',
    identifierType: 'vin',
    identifier: '',
    drivingProfile: 'Normal'  // Default driving profile
  });

  const { isFormValid, stepValidities, updateStepValidity } = useFormValidation(7);  // Updated to include driving profile step
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
      
      case 2: // Mileage
        return data.mileage !== null && data.mileage > 0;
      
      case 3: // Fuel Type
        return data.fuelType !== null && data.fuelType !== '';
      
      case 4: // Features
        return true; // Features are optional
      
      case 5: // Condition
        // Convert string to number for comparison
        const conditionValue = data.condition ? Number(data.condition) : 0;
        return conditionValue >= 0 && conditionValue <= 100 && !!data.conditionLabel;
      
      case 6: // Driving Profile
        return !!data.drivingProfile; // Must have a driving profile
      
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
        
        // Remove the data from localStorage to prevent reloading
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
        mileage: null,
        fuelType: null,
        features: [],
        condition: '50',  // Store as string
        conditionLabel: 'Fair',
        hasAccident: 'no',  // Store as string
        accidentDescription: '',
        zipCode: '',
        identifierType: 'vin',
        identifier: '',
        drivingProfile: 'Normal'
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
    handleSubmit: () => {
      if (!user) return;
      
      // Create a complete user object to satisfy the User type
      const validUser: User = {
        ...user,
        app_metadata: user.app_metadata || { provider: 'email' },
        user_metadata: user.user_metadata || { full_name: user.email.split('@')[0] },
        aud: user.aud || 'authenticated', // Provide a default value for aud if it's missing
        created_at: user.created_at || new Date().toISOString() // Ensure created_at is always present
      };
      
      return submitValuation(formData, validUser, isFormValid);
    },
    validateStep
  };
};
