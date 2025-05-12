
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ValuationResultCardProps {
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  predictionResult?: any;
  isLoading?: boolean;
  isFormValid?: boolean;
  handleSubmit?: () => void;
}

export function ValuationResultCard({
  estimatedValue,
  confidenceScore,
  priceRange,
  predictionResult,
  isLoading,
  isFormValid,
  handleSubmit
}: ValuationResultCardProps) {
  // If we have a prediction result object, extract its properties
  const value = predictionResult?.estimatedValue || estimatedValue;
  const score = predictionResult?.confidenceScore || confidenceScore;
  const range = predictionResult?.priceRange || priceRange;

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <CardContent className="pt-6 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Calculating valuation...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Estimated Value</h3>
            <p className="text-3xl font-bold text-primary">
              ${value?.toLocaleString()}
            </p>
          </div>
          {score && (
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-primary font-medium">{score}% Confidence</span>
              </div>
            </div>
          )}
        </div>
        
        {range && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Estimated Price Range</h4>
            <div className="flex items-center space-x-2">
              <span className="font-medium">${range[0]?.toLocaleString()}</span>
              <span className="text-gray-400">to</span>
              <span className="font-medium">${range[1]?.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {handleSubmit && (
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full gap-2 h-12 text-base"
            >
              {isFormValid ? (
                <>
                  Continue to Report <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                'Please complete all required fields'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
