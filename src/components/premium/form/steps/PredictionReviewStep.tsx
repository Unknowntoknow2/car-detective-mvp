
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
    if (formData.valuation && formData.confidenceScore && formData.valuationId) {
      // Already have prediction data, no need to fetch
      const existingResult = {
        estimatedValue: formData.valuation,
        confidenceScore: formData.confidenceScore,
        id: formData.valuationId,
        priceRange: formData.priceRange
      };
      // This would update the predictionResult state in the useValuation hook
    }
  }, [formData]);

  const handleGetValuation = async () => {
    const result = await fetchValuationPrediction(formData);
    
    if (result) {
      // Update the form data with the valuation results
      setFormData(prev => ({
        ...prev,
        valuation: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        valuationId: result.id,
        priceRange: result.priceRange
      }));
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
            details={error} 
            className="mb-4" 
            variant="error" 
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
            isLoading={isLoading}
            isFormValid={isFormValid}
            onGetValuation={handleGetValuation}
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
