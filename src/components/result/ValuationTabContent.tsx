
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PredictionResult } from "@/components/valuation/PredictionResult";
import { PhotoUploadAndScore } from "@/components/valuation/PhotoUploadAndScore";
import { AICondition } from "@/types/photo";

interface ValuationTabContentProps {
  valuationId?: string;
  manualData?: any;
}

export const ValuationTabContent: React.FC<ValuationTabContentProps> = ({
  valuationId,
  manualData,
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
    // Mock data for valuation
    const mockValuationData = {
      estimatedValue: 25000,
      confidenceScore: 85,
      basePrice: 22000,
      adjustments: [],
      priceRange: { min: 23000, max: 27000 },
      demandFactor: 1.1,
      vehicleInfo: {
        year: 2020,
        make: "Toyota",
        model: "Camry",
        trim: "LE",
        mileage: 45000,
        condition: "Good"
      }
    };

    return (
      <div className="space-y-8">
        <PredictionResult
          {...mockValuationData}
          onEmailReport={() => {}}
        />

        <PhotoUploadAndScore
          valuationId={valuationId}
          onScoreChange={handlePhotoScoreChange}
          isPremium
        />
      </div>
    );
  } else if (manualData) {
    const mockValuationData = {
      estimatedValue: manualData.valuation || 20000,
      confidenceScore: 75,
      basePrice: 18000,
      adjustments: [],
      priceRange: { min: 18000, max: 22000 },
      demandFactor: 1.0,
      vehicleInfo: {
        make: manualData.make,
        model: manualData.model,
        year: parseInt(manualData.year, 10),
        mileage: parseInt(manualData.mileage, 10),
        condition: manualData.condition,
      }
    };

    return (
      <PredictionResult
        {...mockValuationData}
        onEmailReport={() => {}}
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
