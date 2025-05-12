
import React, { useState } from 'react';
import { VehicleIdentificationStep } from './VehicleIdentificationStep';
import { FormData } from '@/types/premium-valuation';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { VehicleDetailsStep } from './VehicleDetailsStep';
import { FeatureSelectionStep } from './FeatureSelectionStep';
import { ConditionStep } from './ConditionStep';
import { PhotoUploadStep } from './PhotoUploadStep';
import { DrivingBehaviorStep } from './DrivingBehaviorStep';
import { ReviewSubmitStep } from './ReviewSubmitStep';
import { ValuationResult } from './ValuationResult';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  valuationId: string | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export function StepContent({
  currentStep,
  formData,
  setFormData,
  updateStepValidity,
  isFormValid,
  handleSubmit,
  handleReset,
  valuationId,
  goToNextStep,
  goToPreviousStep
}: StepContentProps) {
  const { isLoading, lookupVehicle } = useVehicleLookup();
  const [photoProcessing, setPhotoProcessing] = useState(false);

  // If we have a valuation ID, show the result instead of the form
  if (valuationId) {
    return <ValuationResult valuationId={valuationId} />;
  }

  // Function to handle AI condition scoring from photos
  const handlePhotoUpload = async (photos: File[]) => {
    if (!photos.length) return;
    
    setPhotoProcessing(true);
    
    try {
      // Create a temporary valuation ID if we don't have one yet
      let currentValuationId = formData.valuationId;
      
      if (!currentValuationId) {
        // Create preliminary valuation entry to attach photos to
        const { data: valData, error: valError } = await supabase
          .from('valuations')
          .insert({
            make: formData.make || 'Unknown',
            model: formData.model || 'Unknown',
            year: formData.year || 0,
            user_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000'
          })
          .select('id')
          .single();
          
        if (valError) {
          console.error('Error creating preliminary valuation:', valError);
          toast.error('Failed to create valuation record');
          setPhotoProcessing(false);
          return;
        }
        
        currentValuationId = valData.id;
        setFormData(prev => ({ ...prev, valuationId: currentValuationId }));
      }
      
      // Upload photos and trigger AI analysis
      const formData = new FormData();
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      formData.append('valuationId', currentValuationId);
      
      // Call edge function to process photos
      const result = await supabase.functions.invoke('score-image', {
        body: { photos: photos.map(p => URL.createObjectURL(p)), valuationId: currentValuationId }
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Update form data with AI condition results
      if (result.data?.aiCondition) {
        setFormData(prev => ({
          ...prev,
          condition: result.data.aiCondition.condition,
          conditionScore: result.data.aiCondition.confidenceScore,
          photoAnalysisResult: result.data
        }));
        
        toast.success('Photos analyzed successfully');
      }
    } catch (error) {
      console.error('Photo processing error:', error);
      toast.error('Failed to process photos. Using default condition assessment.');
    } finally {
      setPhotoProcessing(false);
    }
  };
  
  // Handle call to car-price-prediction
  const triggerPricePrediction = async () => {
    if (!formData.make || !formData.model || !formData.year) {
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: { 
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition: formData.condition || 'Good',
          zipCode: formData.zipCode || '10001',
          features: formData.features || [],
          fuelType: formData.fuelType || 'Gasoline',
          transmission: formData.transmission || 'Automatic'
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update form with prediction results
      if (data?.estimatedValue) {
        setFormData(prev => ({
          ...prev,
          estimatedValue: data.estimatedValue,
          confidenceScore: data.confidenceScore || 85,
          priceRange: data.priceRange || [data.estimatedValue * 0.9, data.estimatedValue * 1.1],
          adjustments: data.adjustments || []
        }));
      }
    } catch (error) {
      console.error('Price prediction error:', error);
      toast.error('Failed to get price prediction. Using estimate.');
    }
  };

  // Render appropriate step based on currentStep
  switch (currentStep) {
    case 1:
      return (
        <VehicleIdentificationStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          lookupVehicle={lookupVehicle}
          isLoading={isLoading}
          goToNextStep={goToNextStep}
        />
      );
    case 2:
      return (
        <VehicleDetailsStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          onComplete={triggerPricePrediction}
        />
      );
    case 3:
      return (
        <FeatureSelectionStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          onFeaturesChange={triggerPricePrediction}
        />
      );
    case 4:
      return (
        <ConditionStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          onConditionChange={triggerPricePrediction}
        />
      );
    case 5:
      return (
        <PhotoUploadStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
          onPhotoUpload={handlePhotoUpload}
          isProcessing={photoProcessing}
        />
      );
    case 6:
      return (
        <DrivingBehaviorStep
          step={currentStep}
          formData={formData}
          setFormData={setFormData}
          updateValidity={updateStepValidity}
        />
      );
    case 7:
      return (
        <ReviewSubmitStep
          step={currentStep}
          formData={formData}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
        />
      );
    default:
      return <div>Step not implemented</div>;
  }
}
