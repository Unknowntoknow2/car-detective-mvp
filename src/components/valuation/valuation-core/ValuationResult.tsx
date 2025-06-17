
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FreeValuationResultProps {
  displayMode?: string;
  vehicleInfo?: any;
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
    <Card>
      <CardHeader>
        <CardTitle>Valuation Result</CardTitle>
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
              <h4 className="font-medium">Vehicle Details</h4>
              <p>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</p>
              <p>Mileage: {vehicleInfo.mileage?.toLocaleString()} miles</p>
              <p>Condition: {vehicleInfo.condition}</p>
            </div>
          )}
          
          {priceRange[0] > 0 && (
            <div>
              <h4 className="font-medium">Price Range</h4>
              <p>${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedValuationResult;
