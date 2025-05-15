
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { useValuation } from '@/hooks/useValuation';
import { Loader2, Check, X } from 'lucide-react';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { ValuationResult } from '@/types/valuation';

interface PredictionReviewStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export function PredictionReviewStep({
  step,
  formData,
  setFormData,
  updateValidity,
  goToNextStep,
  goToPreviousStep
}: PredictionReviewStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const { generateValuation } = useValuation();

  // Fetch prediction on component mount
  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        // Use the valuation service to generate a prediction
        const response = await generateValuation({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition: formData.condition,
          zipCode: formData.zipCode,
          trim: formData.trim,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          bodyType: formData.bodyType,
          isPremium: true
        });
        
        if (response && response.success) {
          // Set result and update form data with valuation
          setResult(response as unknown as ValuationResult);
          setFormData(prev => ({
            ...prev,
            estimatedValue: response.valuation || 0,
            confidenceScore: response.confidenceScore || 0,
            priceRange: response.priceRange as [number, number]
          }));
          updateValidity(step, true);
        } else {
          updateValidity(step, false);
        }
      } catch (error) {
        console.error('Error fetching prediction:', error);
        updateValidity(step, false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrediction();
  }, [formData.make, formData.model, formData.year, step]);
  
  const handleAccept = () => {
    goToNextStep();
  };
  
  const handleReject = () => {
    goToPreviousStep();
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6 space-y-6">
        <h2 className="text-2xl font-semibold">Review Valuation</h2>
        <p className="text-muted-foreground">
          We've analyzed your vehicle details and generated an estimated valuation.
          Please review and continue if you're satisfied, or go back to make changes.
        </p>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your valuation...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-1">Vehicle Information</h3>
              <p className="text-lg font-semibold">
                {formData.year} {formData.make} {formData.model} {formData.trim}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mileage:</span> {formData.mileage?.toLocaleString()} miles
                </div>
                <div>
                  <span className="text-muted-foreground">Condition:</span> {formData.condition}
                </div>
                <div>
                  <span className="text-muted-foreground">ZIP Code:</span> {formData.zipCode}
                </div>
                {formData.transmission && (
                  <div>
                    <span className="text-muted-foreground">Transmission:</span> {formData.transmission}
                  </div>
                )}
              </div>
            </div>
            
            <ValuationSummary 
              estimatedValue={result.estimatedValue || 0}
              confidenceScore={result.confidenceScore}
              vehicleInfo={{
                make: formData.make,
                model: formData.model,
                year: formData.year,
                mileage: formData.mileage
              }}
            />
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            <p className="font-medium">Unable to generate valuation</p>
            <p className="text-sm mt-1">Please check your vehicle details and try again.</p>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Revise Details
          </Button>
          
          <Button
            onClick={handleAccept}
            disabled={isLoading || !result}
          >
            <Check className="mr-2 h-4 w-4" />
            Accept Valuation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
