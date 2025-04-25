
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type FeatureOption = {
  id: string;
  name: string;
  icon: string;
  value: number;
};

export type FormData = {
  identifierType: 'vin' | 'plate';
  identifier: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  fuelType: string | null;
  features: string[];
  condition: number;
  conditionLabel: string;
  hasAccident: boolean;
  accidentDescription: string;
  zipCode: string;
};

export const usePremiumValuationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);
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
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepValidities, setStepValidities] = useState({
    1: false,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  useEffect(() => {
    const allStepsValid = Object.values(stepValidities).every(valid => valid);
    setIsFormValid(allStepsValid);
  }, [stepValidities]);

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      let nextStep = currentStep + 1;
      while (nextStep <= totalSteps && 
             ((nextStep === 2 && formData.mileage !== null) || 
              (nextStep === 3 && formData.fuelType !== null))) {
        nextStep++;
      }
      setCurrentStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      while (prevStep >= 1 && 
             ((prevStep === 2 && formData.mileage !== null) || 
              (prevStep === 3 && formData.fuelType !== null))) {
        prevStep--;
      }
      setCurrentStep(prevStep);
    }
  };

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
    setCurrentStep(1);
    setStepValidities({
      1: false,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true
    });
    setValuationId(undefined);
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const featureValueTotal = calculateFeatureValue(formData.features);
        const accidentCount = formData.hasAccident ? 1 : 0;
        const zipDemandFactor = 1.0;
        const basePrice = formData.year * 100 + 5000;
        const dealerAvgPrice = basePrice * 1.15;
        const auctionAvgPrice = basePrice * 0.9;
        
        const { data, error } = await supabase
          .from('valuations')
          .insert({
            make: formData.make,
            model: formData.model,
            year: formData.year,
            mileage: formData.mileage || 0,
            condition_score: formData.condition,
            accident_count: accidentCount,
            zip_demand_factor: zipDemandFactor,
            dealer_avg_price: dealerAvgPrice,
            auction_avg_price: auctionAvgPrice,
            feature_value_total: featureValueTotal,
            base_price: basePrice,
            state: formData.zipCode ? formData.zipCode.substring(0, 2) : null,
            is_vin_lookup: formData.identifierType === 'vin',
            vin: formData.identifierType === 'vin' ? formData.identifier : null,
            plate: formData.identifierType === 'plate' ? formData.identifier : null,
            user_id: '00000000-0000-0000-0000-000000000000'
          })
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        
        setValuationId(data.id);
        
        toast({
          title: "Valuation Complete",
          description: "Your premium valuation has been generated successfully.",
        });
        
        console.log("Valuation saved with ID:", data.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save valuation';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        console.error("Valuation error:", err);
      }
    }
  };

  const totalSteps = 7;

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
    handleSubmit
  };
};
