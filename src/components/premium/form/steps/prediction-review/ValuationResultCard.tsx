
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ValuationResultCardProps {
  predictionResult: {
    estimatedValue?: number;
    confidenceScore?: number;
    priceRange?: [number, number];
    [key: string]: any;
  };
  isLoading: boolean;
  isFormValid: boolean;
  handleSubmit: () => void;
}

export function ValuationResultCard({
  predictionResult,
  isLoading,
  isFormValid,
  handleSubmit
}: ValuationResultCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const estimatedValue = predictionResult.estimatedValue || 0;
  const confidenceScore = predictionResult.confidenceScore || 0;
  const priceRange = predictionResult.priceRange || [0, 0];

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-2">Premium Valuation Result</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Price Range</p>
            <p className="text-md font-medium">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${confidenceScore}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{confidenceScore}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className="px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Valuation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
