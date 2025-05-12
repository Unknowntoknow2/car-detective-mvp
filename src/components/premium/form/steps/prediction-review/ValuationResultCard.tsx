
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';

interface ValuationResultCardProps {
  predictionResult?: any;
  estimatedValue?: number; // Add direct props for supporting both usage patterns
  confidenceScore?: number;
  priceRange?: [number, number];
  isLoading?: boolean;
  isFormValid?: boolean;
  handleSubmit?: () => void;
}

export function ValuationResultCard({ 
  predictionResult, 
  estimatedValue,
  confidenceScore,
  priceRange,
  isLoading = false, 
  isFormValid = true, 
  handleSubmit 
}: ValuationResultCardProps) {
  // Use either direct props or predictionResult
  const value = estimatedValue || (predictionResult ? predictionResult.estimatedValue : 0);
  const confidence = confidenceScore || (predictionResult ? predictionResult.confidenceScore : 80);
  const range = priceRange || (predictionResult ? predictionResult.priceRange : [
    Math.floor(value * 0.9), 
    Math.ceil(value * 1.1)
  ]);

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
    <Card className="p-6 border-2 border-primary/20 bg-primary/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Estimated Value</h3>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Premium</span>
        </div>
        
        <div className="text-4xl font-bold text-primary">
          {formatCurrency(value)}
        </div>
        
        {range && (
          <div className="text-sm text-gray-600">
            Estimated range: {formatCurrency(range[0])} - {formatCurrency(range[1])}
          </div>
        )}
        
        <div className="flex items-center mt-2">
          <div className="text-sm font-medium mr-2">Confidence:</div>
          <div className={`text-sm font-bold ${getConfidenceColorClass(confidence)}`}>
            {formatConfidenceLabel(confidence)} ({Math.round(confidence)}%)
          </div>
        </div>
        
        {predictionResult?.valuationFactors && (
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
        
        {handleSubmit && (
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
        )}
      </div>
    </Card>
  );
}
