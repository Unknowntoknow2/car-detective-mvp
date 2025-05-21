
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/formatters';

export interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
  showEstimatedValue?: boolean;
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
  showEstimatedValue = true
}: ValuationSummaryProps) {
  const calculatedPriceRange = priceRange && priceRange[0] > 0 
    ? priceRange 
    : [
        Math.round(estimatedValue * 0.95),
        Math.round(estimatedValue * 1.05)
      ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg text-primary">
          {year} {make} {model}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        {showEstimatedValue && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Value</h3>
            <p className="text-3xl font-bold">{formatCurrency(estimatedValue)}</p>
            
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
                  {confidenceScore && confidenceScore >= 80 
                    ? 'High' 
                    : confidenceScore && confidenceScore >= 60 
                    ? 'Medium' 
                    : 'Low'
                  }
                  {confidenceScore ? ` (${confidenceScore}%)` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {year && (
            <div>
              <span className="text-muted-foreground">Year</span>
              <p>{year}</p>
            </div>
          )}
          
          {make && (
            <div>
              <span className="text-muted-foreground">Make</span>
              <p>{make}</p>
            </div>
          )}
          
          {model && (
            <div>
              <span className="text-muted-foreground">Model</span>
              <p>{model}</p>
            </div>
          )}
          
          {mileage !== undefined && (
            <div>
              <span className="text-muted-foreground">Mileage</span>
              <p>{formatNumber(mileage)} miles</p>
            </div>
          )}
          
          {condition && (
            <div>
              <span className="text-muted-foreground">Condition</span>
              <p className="capitalize">{condition}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
