
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { Loader2, AlertCircle } from 'lucide-react';
import { VehicleSummary } from './review/VehicleSummary';
import { VehicleDetailsSummary } from './review/VehicleDetailsSummary';
import { FeaturesSummary } from './review/FeaturesSummary';
import { ConditionSummary } from './review/ConditionSummary';
import { PhotosSummary } from './review/PhotosSummary';
import { DrivingBehaviorSummary } from './review/DrivingBehaviorSummary';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function ReviewSubmitStep({
  step,
  formData,
  setFormData,
  updateValidity,
  isFormValid,
  handleSubmit,
  handleReset
}: ReviewSubmitStepProps) {
  // Always set this step as valid when it's rendered
  useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  // Check if we have enough information to submit
  const canSubmit = Boolean(
    formData.make && 
    formData.model && 
    formData.year
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Review Your Information</h2>
            <p className="text-muted-foreground">
              Please review all the information below before submitting your premium valuation request.
            </p>
          </div>
          
          <div className="space-y-8">
            <VehicleSummary formData={formData} />
            
            <VehicleDetailsSummary formData={formData} />
            
            <FeaturesSummary formData={formData} />
            
            <ConditionSummary formData={formData} />
            
            <PhotosSummary formData={formData} />
            
            <DrivingBehaviorSummary formData={formData} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="sm:order-1"
        >
          Reset Form
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="sm:order-2"
          data-testid="submit-valuation"
        >
          Submit Premium Valuation
        </Button>
      </div>
      
      {!canSubmit && (
        <div className="flex items-start gap-2 p-4 border rounded-md bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-700">
              Please complete at least the Vehicle Identification step before submitting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
