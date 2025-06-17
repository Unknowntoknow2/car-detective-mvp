
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FreeValuationResultProps {
  displayMode?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
  };
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: any[];
}

const UnifiedValuationResult: React.FC<FreeValuationResultProps> = ({
  displayMode = 'full',
  vehicleInfo,
  estimatedValue = 0,
  confidenceScore = 85,
  priceRange = [0, 0],
  adjustments = []
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleInfo && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </h3>
              <p>Mileage: {vehicleInfo.mileage.toLocaleString()} miles</p>
              <p>Condition: {vehicleInfo.condition}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-green-600">
              ${estimatedValue.toLocaleString()}
            </h4>
            <p className="text-muted-foreground">
              Confidence Score: {confidenceScore}%
            </p>
            {priceRange[0] > 0 && priceRange[1] > 0 && (
              <p className="text-sm">
                Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </p>
            )}
          </div>
          
          {adjustments.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Value Adjustments</h5>
              <div className="space-y-1">
                {adjustments.map((adj, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{adj.factor}:</span> {adj.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedValuationResult;
