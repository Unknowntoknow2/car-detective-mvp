
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { ValuationResult } from '@/types/valuation';

export interface ValuationSummaryProps {
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
  showEstimatedValue?: boolean;
  valuation?: ValuationResult; // Add valuation prop
}

export function ValuationSummary({
  estimatedValue,
  confidenceScore = 85,
  priceRange = [0, 0],
  year,
  make,
  model,
  mileage,
  condition,
  showEstimatedValue = true,
  valuation
}: ValuationSummaryProps) {
  // Use valuation data if provided, otherwise fall back to individual props
  const displayValue = valuation?.estimatedValue || valuation?.estimated_value || estimatedValue || 0;
  const displayConfidence = valuation?.confidenceScore || valuation?.confidence_score || confidenceScore || 0;
  const displayYear = valuation?.year || year;
  const displayMake = valuation?.make || make;
  const displayModel = valuation?.model || model;
  const displayMileage = valuation?.mileage || mileage;
  const displayCondition = valuation?.condition || condition;
  
  const calculatedPriceRange = priceRange && priceRange[0] > 0 
    ? priceRange 
    : [
        Math.round(displayValue * 0.95),
        Math.round(displayValue * 1.05)
      ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg text-primary">
          {displayYear} {displayMake} {displayModel}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        {showEstimatedValue && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Value</h3>
            <p className="text-3xl font-bold">{formatCurrency(displayValue)}</p>
            
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Value Range</span>
                <p>
                  {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Confidence</span>
                <p>
                  {displayConfidence && displayConfidence >= 80 
                    ? 'High' 
                    : displayConfidence && displayConfidence >= 60 
                    ? 'Medium' 
                    : 'Low'
                  }
                  {displayConfidence ? ` (${displayConfidence}%)` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {displayYear && (
            <div>
              <span className="text-muted-foreground">Year</span>
              <p>{displayYear}</p>
            </div>
          )}
          
          {displayMake && (
            <div>
              <span className="text-muted-foreground">Make</span>
              <p>{displayMake}</p>
            </div>
          )}
          
          {displayModel && (
            <div>
              <span className="text-muted-foreground">Model</span>
              <p>{displayModel}</p>
            </div>
          )}
          
          {displayMileage !== undefined && (
            <div>
              <span className="text-muted-foreground">Mileage</span>
              <p>{formatNumber(displayMileage)} miles</p>
            </div>
          )}
          
          {displayCondition && (
            <div>
              <span className="text-muted-foreground">Condition</span>
              <p className="capitalize">{displayCondition}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
