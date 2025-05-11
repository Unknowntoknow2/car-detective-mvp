
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { ValuationResultCard } from './prediction-review/ValuationResultCard';
import { VehicleSummaryCard } from './prediction-review/VehicleSummaryCard';
import { FeaturesDisplay } from './prediction-review/FeaturesDisplay';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function ReviewSubmitStep({
  step,
  formData,
  isFormValid,
  handleSubmit,
  handleReset
}: ReviewSubmitStepProps) {
  // Create a simple prediction of the valuation for display
  const estimatedValue = calculateEstimatedValue(formData);
  
  // Mock prediction result for display
  const predictionResult = {
    estimatedValue,
    priceRange: [Math.round(estimatedValue * 0.95), Math.round(estimatedValue * 1.05)],
    confidenceScore: 85,
    valuationFactors: [
      { factor: 'Mileage', impact: -3, description: 'Higher than average' },
      { factor: 'Condition', impact: 2, description: formData.conditionLabel || 'Good' },
      { factor: 'Location', impact: 1, description: 'High demand area' },
      { factor: 'Features', impact: formData.features?.length > 2 ? 2 : 1, description: 'Popular options' }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Information</h2>
        <p className="text-muted-foreground mt-1">
          Please review your information before getting your valuation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VehicleSummaryCard formData={formData} />
          
          {formData.features && formData.features.length > 0 && (
            <FeaturesDisplay features={formData.features} />
          )}
          
          <Card className="p-4">
            <h3 className="font-medium mb-2">Driving Profile</h3>
            <p>{formData.drivingProfile || 'Normal'}</p>
          </Card>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Form
          </Button>
        </div>
        
        <ValuationResultCard
          predictionResult={predictionResult}
          isLoading={false}
          isFormValid={isFormValid}
          handleSubmit={handleSubmit}
        />
      </div>
      
      <div className="pt-4 text-center">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full md:w-auto"
          disabled={!isFormValid}
          data-testid="submit-valuation"
        >
          <FileText className="mr-2 h-4 w-4" />
          Get Premium Valuation
        </Button>
      </div>
    </div>
  );
}

// Helper function to calculate a simple estimated value based on form data
function calculateEstimatedValue(formData: FormData): number {
  // Base values by year (newer = higher value)
  const currentYear = new Date().getFullYear();
  const yearDifference = currentYear - (formData.year || currentYear);
  let baseValue = 30000 - (yearDifference * 1500);
  
  // Adjust for mileage (higher mileage = lower value)
  const mileage = formData.mileage || 0;
  const mileageDeduction = mileage > 50000 ? 
    ((mileage - 50000) / 10000) * 500 : 0;
  
  // Adjust for condition (better condition = higher value)
  const conditionValue = formData.condition ? parseInt(formData.condition) : 50;
  const conditionMultiplier = conditionValue / 50;
  
  // Features add value
  const featuresBonus = (formData.features?.length || 0) * 250;
  
  // Calculate final value
  let estimatedValue = (baseValue - mileageDeduction) * conditionMultiplier + featuresBonus;
  
  // Set minimum value
  return Math.max(5000, Math.round(estimatedValue));
}
