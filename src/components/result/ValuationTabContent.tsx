
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { PhotoUploadAndScore } from '@/components/valuation/PhotoUploadAndScore';
import { AICondition } from '@/types/photo';

interface ValuationTabContentProps {
  valuationId?: string;
  manualData?: any;
}

export const ValuationTabContent: React.FC<ValuationTabContentProps> = ({ 
  valuationId, 
  manualData 
}) => {
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  
  const handlePhotoScoreChange = (score: number, condition?: AICondition) => {
    setPhotoScore(score);
    if (condition) {
      setAiCondition(condition);
    }
  };
  
  if (valuationId) {
    return (
      <div className="space-y-8">
        <PredictionResult 
          valuationId={valuationId} 
          manualValuation={manualData}
          // Pass condition to PredictionResult only if we have it
          {...(aiCondition && { photoCondition: aiCondition })}
        />
        
        <PhotoUploadAndScore 
          valuationId={valuationId}
          onScoreChange={handlePhotoScoreChange}
          isPremium={true}
        />
      </div>
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
