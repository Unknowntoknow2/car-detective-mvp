import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { supabase } from '@/integrations/supabase/client';

interface PredictionReviewStepProps {
  step: number;
  formData: any;
  updateValidity: (step: number, isValid: boolean) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Define a type for valuation result
interface ValuationResult {
  isLoading: boolean;
  error: string | null;
  predictionResult?: any;
  fetchValuationPrediction: (data: any) => Promise<any>;
}

// Real valuation hook that connects to actual valuation engine
const useValuation = (): ValuationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const fetchValuationPrediction = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create valuation request using actual form data
      const { data: valuationRequest, error: requestError } = await supabase
        .from('valuation_requests')
        .insert({
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          zip_code: data.zipCode,
          trim: data.trim,
          status: 'pending'
        })
        .select('*')
        .single();

      if (requestError) {
        throw new Error(requestError.message);
      }

      // Get valuation result using the actual valuation-result edge function
      const { data: resultData, error: resultError } = await supabase.functions.invoke('valuation-result', {
        body: { requestId: valuationRequest.id }
      });

      if (resultError) {
        throw new Error(resultError.message);
      }

      if (resultData?.success && resultData?.valuation_result) {
        const result = {
          estimatedValue: resultData.valuation_result.estimated_value,
          confidenceScore: resultData.valuation_result.confidence_score,
          priceRange: {
            low: resultData.valuation_result.price_range_low,
            high: resultData.valuation_result.price_range_high,
          },
          adjustments: resultData.valuation_result.adjustments || [],
          compCount: resultData.valuation_result.comp_count || 0
        };
        
        setPredictionResult(result);
        return result;
      } else {
        throw new Error('No valuation result available');
      }
    } catch (err) {
      console.error('Valuation error:', err);
      setError(err instanceof Error ? err.message : "Failed to generate valuation");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, predictionResult, fetchValuationPrediction };
};

export function PredictionReviewStep({
  step,
  formData,
  updateValidity,
  goToNextStep,
  goToPreviousStep,
}: PredictionReviewStepProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const { isLoading, error, predictionResult, fetchValuationPrediction } =
    useValuation();

  // Mark step as valid once prediction is made
  useEffect(() => {
    updateValidity(step, Boolean(prediction));
  }, [prediction, step, updateValidity]);

  // Generate prediction on mount if not already generated
  useEffect(() => {
    if (!prediction && !isLoading) {
      handleGeneratePrediction();
    }
     
  }, []);

  // Update prediction if the valuation result changes
  useEffect(() => {
    if (predictionResult) {
      setPrediction(predictionResult);
    }
  }, [predictionResult]);

  const handleGeneratePrediction = async () => {
    // Extract relevant data for valuation
    const valuationData = {
      year: formData.year,
      make: formData.make,
      model: formData.model,
      trim: formData.trim,
      mileage: formData.mileage || 0,
      condition: formData.condition,
      zipCode: formData.zipCode,
      features: formData.selectedFeatures || [],
      accident: formData.accidentDetails?.hasAccident || false,
      accidentSeverity: formData.accidentDetails?.severity,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      color: formData.color,
    };

    const result = await fetchValuationPrediction(valuationData);

    if (result) {
      setPrediction(result);
    }
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6 pb-2">
        <h2 className="text-2xl font-semibold mb-6">Valuation Prediction</h2>

        {isLoading
          ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">
                Generating Your Valuation...
              </p>
              <p className="text-muted-foreground mt-2">
                Analyzing vehicle data and market conditions
              </p>
            </div>
          )
          : error
          ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleGeneratePrediction} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )
          : prediction
          ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">
                  Estimated Value
                </p>
                <p className="text-4xl font-bold">
                  {formatCurrency(prediction.estimatedValue)}
                </p>
                {prediction.priceRange && (
                  <p className="text-muted-foreground mt-2">
                    Range: {formatCurrency(prediction.priceRange.low)} -{" "}
                    {formatCurrency(prediction.priceRange.high)}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">
                    {prediction.confidenceScore}% Confidence Score
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-muted-foreground">
                    Year, Make, Model:
                  </div>
                  <div>{formData.year} {formData.make} {formData.model}</div>

                  <div className="text-muted-foreground">Trim:</div>
                  <div>{formData.trim || "Standard"}</div>

                  <div className="text-muted-foreground">Mileage:</div>
                  <div>{formData.mileage?.toLocaleString() || "N/A"} miles</div>

                  <div className="text-muted-foreground">Condition:</div>
                  <div>{formData.condition}</div>

                  <div className="text-muted-foreground">Location:</div>
                  <div>{formData.zipCode}</div>
                </div>
              </div>
            </div>
          )
          : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isLoading}
        >
          Back
        </Button>

        <Button
          onClick={goToNextStep}
          disabled={isLoading || !prediction}
          className="gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PredictionReviewStep;
