
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/formatters';

export interface ConfidenceScoreProps {
  score: number;
  comparableVehicles: number;
}

const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ score, comparableVehicles }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Confidence Score</span>
        <span className="text-sm">{score}%</span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground mt-1">
        Based on {comparableVehicles} comparable vehicles
      </p>
    </div>
  );
};

interface ValuationSummaryProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  comparableVehicles?: number;
}

const ValuationSummary: React.FC<ValuationSummaryProps> = ({ 
  estimatedValue, 
  confidenceScore, 
  priceRange,
  comparableVehicles = 120 // Default value if not provided
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-3">Valuation Summary</h3>
        
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Estimated Value</span>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </div>
        </div>
        
        <ConfidenceScore 
          score={confidenceScore} 
          comparableVehicles={comparableVehicles}
        />
        
        <div>
          <span className="text-sm font-medium">Price Range</span>
          <div className="flex justify-between">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationSummary;
