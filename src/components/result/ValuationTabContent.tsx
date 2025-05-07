
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PredictionResult } from '@/components/valuation/PredictionResult';

interface ValuationTabContentProps {
  valuationId?: string;
  manualData?: any;
}

export const ValuationTabContent: React.FC<ValuationTabContentProps> = ({ 
  valuationId, 
  manualData 
}) => {
  if (valuationId) {
    return (
      <PredictionResult 
        valuationId={valuationId} 
        manualValuation={manualData}
      />
    );
  } else if (manualData) {
    return (
      <PredictionResult 
        valuationId="" 
        manualValuation={{
          make: manualData.make,
          model: manualData.model,
          year: parseInt(manualData.year, 10),
          mileage: parseInt(manualData.mileage, 10),
          condition: manualData.condition,
          zipCode: manualData.zipCode,
          valuation: manualData.valuation
        }}
      />
    );
  } else {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Data</AlertTitle>
        <AlertDescription>
          We couldn't find valuation data for this vehicle.
        </AlertDescription>
      </Alert>
    );
  }
};
