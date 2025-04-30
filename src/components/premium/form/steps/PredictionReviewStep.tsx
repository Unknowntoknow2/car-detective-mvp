
import React, { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, AlertCircle, FileText } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  
  // Automatically set this step as valid
  useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  // Check if we already have valuation data
  useEffect(() => {
    if (formData.valuation && formData.confidenceScore && formData.valuationId) {
      // Already have prediction data, no need to fetch
      setPredictionResult({
        estimatedValue: formData.valuation,
        confidenceScore: formData.confidenceScore,
        id: formData.valuationId
      });
    }
  }, [formData]);

  const fetchValuationPrediction = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Call the car-price-prediction edge function
      const response = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition: formData.conditionLabel.toLowerCase(),
          fuelType: formData.fuelType || 'Gasoline',
          zipCode: formData.zipCode,
          accident: formData.hasAccident ? 'yes' : 'no',
          ...(formData.hasAccident && {
            accidentDetails: {
              count: '1', // Default to 1 for now
              severity: 'minor', // Default to minor
              area: 'general'
            }
          }),
          includeCarfax: false, // Can be expanded in the future
          exteriorColor: formData.exteriorColor,
          interiorColor: formData.interiorColor,
          bodyType: formData.bodyType,
          trim: formData.trim
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to get valuation');
      }

      const result = response.data;
      console.log('Prediction result:', result);

      setPredictionResult(result);
      
      // Update the form data with the valuation results
      setFormData(prev => ({
        ...prev,
        valuation: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        valuationId: result.id
      }));

    } catch (err: any) {
      console.error('Valuation prediction error:', err);
      setError(err.message || 'Failed to get vehicle valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatConfidenceLabel = (score: number) => {
    if (score >= 90) return 'Very High';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  const getConfidenceColorClass = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
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
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-md font-medium mb-2">Vehicle Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Year, Make, Model</span>
            <span className="font-medium">{formData.year} {formData.make} {formData.model}</span>
          </div>
          {formData.trim && (
            <div>
              <span className="text-gray-500 block">Trim</span>
              <span className="font-medium">{formData.trim}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500 block">Mileage</span>
            <span className="font-medium">{formData.mileage?.toLocaleString() || 'N/A'} miles</span>
          </div>
          <div>
            <span className="text-gray-500 block">Condition</span>
            <span className="font-medium">{formData.conditionLabel}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Fuel Type</span>
            <span className="font-medium">{formData.fuelType || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">ZIP Code</span>
            <span className="font-medium">{formData.zipCode || 'N/A'}</span>
          </div>
          {formData.exteriorColor && (
            <div>
              <span className="text-gray-500 block">Exterior Color</span>
              <span className="font-medium">{formData.exteriorColor}</span>
            </div>
          )}
          {formData.interiorColor && (
            <div>
              <span className="text-gray-500 block">Interior Color</span>
              <span className="font-medium">{formData.interiorColor}</span>
            </div>
          )}
          {formData.bodyType && (
            <div>
              <span className="text-gray-500 block">Body Type</span>
              <span className="font-medium">{formData.bodyType}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500 block">Accident History</span>
            <span className="font-medium">{formData.hasAccident ? 'Yes' : 'No'}</span>
          </div>
          {formData.features.length > 0 && (
            <div className="col-span-2">
              <span className="text-gray-500 block">Features</span>
              <span className="font-medium">{formData.features.length} premium features selected</span>
            </div>
          )}
        </div>
      </div>

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
          <Card className="p-6 border-2 border-primary/20 bg-primary/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Estimated Value</h3>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Premium</span>
              </div>
              
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(predictionResult.estimatedValue)}
              </div>
              
              {predictionResult.priceRange && (
                <div className="text-sm text-gray-600">
                  Estimated range: {formatCurrency(predictionResult.priceRange[0])} - {formatCurrency(predictionResult.priceRange[1])}
                </div>
              )}
              
              <div className="flex items-center mt-2">
                <div className="text-sm font-medium mr-2">Confidence:</div>
                <div className={`text-sm font-bold ${getConfidenceColorClass(predictionResult.confidenceScore)}`}>
                  {formatConfidenceLabel(predictionResult.confidenceScore)} ({Math.round(predictionResult.confidenceScore)}%)
                </div>
              </div>
              
              {predictionResult.valuationFactors && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Valuation Factors:</h4>
                  <ul className="text-sm space-y-1">
                    {predictionResult.valuationFactors.map((factor: any, index: number) => (
                      <li key={index} className="flex justify-between">
                        <span>{factor.factor}: {factor.description}</span>
                        <span className={factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {factor.impact >= 0 ? '+' : ''}{factor.impact}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 mt-4 text-center">
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Full Premium Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center py-8">
            <Button
              onClick={fetchValuationPrediction}
              size="lg"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating Valuation...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Get Premium Valuation
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Our AI will analyze your vehicle details and provide an accurate valuation
            </p>
          </div>
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
