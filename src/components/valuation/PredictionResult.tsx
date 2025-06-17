
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PredictionResultProps {
  vehicleData?: any;
  estimatedValue?: number;
  confidenceScore?: number;
  basePrice?: number;
  adjustments?: any[];
  priceRange?: any;
  demandFactor?: number;
  vehicleInfo?: any;
  onEmailReport?: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ 
  vehicleData,
  estimatedValue = 0,
  confidenceScore = 85,
  basePrice = 0,
  adjustments = [],
  priceRange,
  demandFactor = 1,
  vehicleInfo,
  onEmailReport
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              Estimated Value: ${estimatedValue.toLocaleString()}
            </h3>
            <p className="text-muted-foreground">
              Confidence Score: {confidenceScore}%
            </p>
          </div>
          
          {vehicleInfo && (
            <div>
              <p>Vehicle: {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>
            </div>
          )}
          
          {vehicleData && (
            <div className="mt-4">
              <p>Vehicle: {vehicleData.make} {vehicleData.model}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
