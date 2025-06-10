
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ValuationResultDisplay } from '@/modules/valuation-result/ValuationResultDisplay';

interface PredictionResultProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice: number;
  adjustments: any[];
  priceRange: { min: number; max: number };
  demandFactor: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: string;
  };
  onEmailReport: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments,
  priceRange,
  demandFactor,
  vehicleInfo,
  onEmailReport,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-green-600">
              {formatCurrency(estimatedValue)}
            </h3>
            <p className="text-sm text-muted-foreground">
              Estimated Market Value
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Confidence Score</p>
              <p className="text-lg">{confidenceScore}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Price Range</p>
              <p className="text-sm">
                {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
              </p>
            </div>
          </div>

          <ValuationResultDisplay
            vehicleInfo={vehicleInfo}
            estimatedValue={estimatedValue}
            confidenceScore={confidenceScore}
            onEmailReport={onEmailReport}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
