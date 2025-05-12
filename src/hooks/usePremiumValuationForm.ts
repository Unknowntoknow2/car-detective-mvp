import { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { useStepNavigation } from './useStepNavigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Initial form data
const initialFormData: FormData = {
  identifierType: 'vin',
  identifier: '',
  vin: '',
  make: '',
  model: '',
  year: 0,
  trim: '',
  mileage: undefined,
  zipCode: '',
  condition: 'Good',
  conditionLabel: 'Good',
  conditionScore: 75,
  hasAccident: 'no',
  accidentDescription: '',
  fuelType: '',
  transmission: '',
  bodyType: '',
  features: [],
  photos: [], // Removed duplicate photos property
  drivingProfile: 'average',
  isPremium: true
};

export function usePremiumValuationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [stepValidities, setStepValidities] = useState<Record<number, boolean>>({
    1: false, // Vehicle Identification
    2: false, // Vehicle Details
    3: true,  // Feature Selection (optional)
    4: true,  // Condition (default value provided)
    5: true,  // Photo Upload (optional)
    6: true,  // Driving Behavior (default value provided)
    7: true   // Review & Submit
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  
  const { 
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep
  } = useStepNavigation(formData);

  // Set a vehicleData if it's available in localStorage
  useEffect(() => {
    const storedVehicle = localStorage.getItem('premium_vehicle');
    if (storedVehicle) {
      try {
        const vehicleData = JSON.parse(storedVehicle);
        setFormData(prevData => ({
          ...prevData,
          ...vehicleData,
          identifier: vehicleData.identifier || vehicleData.vin || '',
          identifierType: vehicleData.identifierType || 'vin'
        }));
        
        // Mark step 1 as valid if we have vehicle data
        if (vehicleData.make && vehicleData.model && vehicleData.year) {
          updateStepValidity(1, true);
        }
      } catch (err) {
        console.error('Error parsing stored vehicle data:', err);
      }
    }
  }, []);

  // Update form validity when step validities change
  useEffect(() => {
    const isValid = Object.values(stepValidities).every(valid => valid);
    setIsFormValid(isValid);
  }, [stepValidities]);

  // Update a specific step's validity
  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  // Reset the form
  const handleReset = () => {
    setFormData(initialFormData);
    setStepValidities({
      1: false,
      2: false,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true
    });
    setValuationId(null);
    localStorage.removeItem('premium_valuation_form');
    localStorage.removeItem('premium_vehicle');
    goToStep(1);
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Call the car-price-prediction function to get final valuation
      const { data: predictionData, error: predictionError } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition: formData.conditionLabel || formData.condition || 'Good',
          zipCode: formData.zipCode,
          features: formData.features || [],
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          bodyType: formData.bodyType,
          hasAccident: formData.hasAccident === 'yes',
          drivingProfile: formData.drivingProfile
        }
      });
      
      if (predictionError) {
        throw new Error(`Prediction error: ${predictionError.message}`);
      }
      
      // Create valuation entry in database or update existing one
      const valuationPayload = {
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        fuel_type: formData.fuelType,
        condition_score: formData.conditionScore || 75,
        accident_count: formData.hasAccident === 'yes' ? 1 : 0,
        body_type: formData.bodyType,
        state: formData.zipCode,
        vin: formData.vin,
        is_vin_lookup: formData.identifierType === 'vin',
        estimated_value: predictionData?.estimatedValue || 0,
        confidence_score: predictionData?.confidenceScore || 85,
        base_price: predictionData?.baseValue || 0,
        premium_unlocked: true
      };
      
      let valId = formData.valuationId;
      
      if (valId) {
        // Update existing valuation
        const { error: updateError } = await supabase
          .from('valuations')
          .update(valuationPayload)
          .eq('id', valId);
          
        if (updateError) {
          throw new Error(`Update error: ${updateError.message}`);
        }
      } else {
        // Create new valuation
        const { data: newValuation, error: insertError } = await supabase
          .from('valuations')
          .insert(valuationPayload)
          .select('id')
          .single();
        
        if (insertError) {
          throw new Error(`Insert error: ${insertError.message}`);
        }
        
        valId = newValuation.id;
      }
      
      // Store vehicle features if any
      if (formData.features && formData.features.length > 0) {
        // First delete any existing features
        await supabase
          .from('vehicle_features')
          .delete()
          .eq('valuation_id', valId);
          
        // Then insert new features
        for (const feature of formData.features) {
          await supabase
            .from('vehicle_features')
            .insert({
              valuation_id: valId,
              feature_id: feature
            });
        }
      }
      
      setValuationId(valId);
      toast.success('Premium valuation completed successfully!');
      
      // Clear localStorage after successful submission
      localStorage.removeItem('premium_valuation_form');
      localStorage.removeItem('premium_vehicle');
      
      return valId;
    } catch (error: any) {
      console.error('Error submitting premium valuation:', error);
      toast.error(error.message || 'Failed to submit valuation');
      setSubmitError(error.message || 'Failed to submit valuation');
      return null;
    } finally {
      setIsSubmitting(false);
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
    handleSubmit
  };
}
