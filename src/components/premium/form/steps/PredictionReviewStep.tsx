
import React, { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { VehicleSummary } from './prediction-review/VehicleSummary';
import { ValuationResultCard } from './prediction-review/ValuationResultCard';
import { GetValuationButton } from './prediction-review/GetValuationButton';
import { useValuation } from '@/hooks/useValuation';

interface PredictionReviewStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function PredictionReviewStep({
  step,
  formData,
  setFormData,
  updateValidity,
  isFormValid,
  handleSubmit,
  handleReset
}: PredictionReviewStepProps) {
  const { 
    isLoading, 
    error, 
    predictionResult, 
    fetchValuationPrediction 
  } = useValuation();
  
  // Automatically set this step as valid
  useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  // Check if we already have valuation data
  useEffect(() => {
    if (formData.estimatedValue && formData.confidenceScore && formData.valuationId) {
      // Already have prediction data, no need to fetch
      console.log("Using existing valuation data:", {
        estimatedValue: formData.estimatedValue,
        confidenceScore: formData.confidenceScore,
        valuationId: formData.valuationId,
        priceRange: formData.priceRange
      });
    }
  }, [formData]);

  const handleGetValuation = async () => {
    try {
      // Create a complete FormData object with all required properties
      const valuationFormData: FormData = {
        // Required properties that must be included
        identifierType: formData.identifierType || 'manual',
        identifier: formData.identifier || '',
        vin: formData.vin || '',
        make: formData.make,
        model: formData.model,
        year: formData.year,
        zipCode: formData.zipCode || '',
        hasAccident: formData.hasAccident || 'no',
        accidentDescription: formData.accidentDescription || '',
        condition: formData.condition || 'Good',
        conditionLabel: formData.conditionLabel || 'Good',
        drivingProfile: formData.drivingProfile || 'average',
        
        // Optional properties
        mileage: formData.mileage,
        fuelType: formData.fuelType || '',
        transmission: formData.transmission || '',
        bodyType: formData.bodyType || '',
        bodyStyle: formData.bodyStyle || '',
        trim: formData.trim || '',
        features: formData.features || [],
        valuationId: formData.valuationId,
        exteriorColor: formData.exteriorColor,
        interiorColor: formData.interiorColor
      };
      
      const result = await fetchValuationPrediction(valuationFormData);
      
      if (result) {
        // Update the form data with the valuation results
        setFormData(prev => ({
          ...prev,
          estimatedValue: result.estimatedValue,
          confidenceScore: result.confidenceScore,
          valuationId: result.valuationId,
          priceRange: result.priceRange
        }));
      }
    } catch (error) {
      console.error('Failed to get valuation prediction:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium Valuation</h2>
        <p className="text-gray-600 mb-6">
          Review your vehicle details and get a premium valuation estimate.
        </p>
      </div>

      {/* Vehicle Summary */}
      <VehicleSummary formData={formData} />

      {/* Valuation Results or Get Valuation Button */}
      <div className="mt-6">
        {error && (
          <FormValidationError 
            error="Valuation Error" 
            variant="error"
            details={error}
            className="mb-4"
          />
        )}
        
        {predictionResult ? (
          <ValuationResultCard
            predictionResult={predictionResult}
            isLoading={isLoading}
            isFormValid={isFormValid}
            handleSubmit={handleSubmit}
          />
        ) : (
          <GetValuationButton
            onClick={handleGetValuation}
            isLoading={isLoading}
            disabled={!isFormValid}
          />
        )}
      </div>

      {/* Reset Form button */}
      <div className="text-center mt-8">
        <Button variant="outline" onClick={handleReset}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
