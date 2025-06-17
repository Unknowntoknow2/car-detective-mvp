
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PredictionResultProps {
  vehicleData?: any;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ vehicleData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Prediction results would be displayed here</p>
        {vehicleData && (
          <div className="mt-4">
            <p>Vehicle: {vehicleData.make} {vehicleData.model}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
