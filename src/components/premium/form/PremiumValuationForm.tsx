
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { toast } from 'sonner';

interface PremiumValuationFormProps {
  vehicle?: any;
  onComplete?: (valuationId: string) => void;
}

export function PremiumValuationForm({ vehicle, onComplete }: PremiumValuationFormProps) {
  const initialFormData: FormData = {
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || 0,
    mileage: vehicle?.mileage || 0,
    condition: 'good',
    zipCode: '',
    vin: vehicle?.vin || '',
    bodyType: vehicle?.bodyType || '',
    transmission: vehicle?.transmission || '',
    fuelType: vehicle?.fuelType || '',
    trim: vehicle?.trim || '',
    identifierType: vehicle ? 'manual' : undefined,
    identifier: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : undefined
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({});
  const { isLoading, lookupVehicle } = useVehicleLookup();
  
  const {
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep
  } = useStepNavigation(formData);

  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidity(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  const isCurrentStepValid = () => {
    return stepValidity[currentStep] || false;
  };

  const isFormValid = Object.values(stepValidity).every(Boolean) && 
    Object.keys(stepValidity).length === totalSteps;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app, this would submit the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock valuation ID
      const valuationId = `prem-${Date.now()}`;
      
      toast.success('Premium valuation completed successfully!');
      
      if (onComplete) {
        onComplete(valuationId);
      }
      
      return valuationId;
    } catch (error) {
      console.error('Error submitting valuation:', error);
      toast.error('Failed to submit valuation');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    goToStep(1);
    setStepValidity({});
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleIdentificationStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
            lookupVehicle={lookupVehicle}
            isLoading={isLoading}
            goToNextStep={goToNextStep}
          />
        );
      // Placeholder for other steps - in a real app, you would implement these
      case 2:
        return (
          <Card className="animate-in fade-in duration-500">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
              <p className="text-muted-foreground mb-6">
                Confirm and add additional details about your {formData.year} {formData.make} {formData.model}.
              </p>
              <Button onClick={() => {
                updateStepValidity(currentStep, true);
                goToNextStep();
              }}>
                Continue
              </Button>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="animate-in fade-in duration-500">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Accident History</h2>
              <p className="text-muted-foreground mb-6">
                Please provide information about any accidents or damage.
              </p>
              <Button onClick={() => {
                updateStepValidity(currentStep, true);
                goToNextStep();
              }}>
                Continue
              </Button>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="animate-in fade-in duration-500">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
              <p className="text-muted-foreground mb-6">
                Review your information before submitting for a premium valuation.
              </p>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Premium Valuation'
                )}
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // If vehicle is provided, skip step 1
  React.useEffect(() => {
    if (vehicle && currentStep === 1) {
      updateStepValidity(1, true);
      goToNextStep();
    }
  }, [vehicle, currentStep]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Premium Valuation</h1>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-secondary h-2 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = stepValidity[stepNum] || false;
            const isCurrent = currentStep === stepNum;
            
            return (
              <button
                key={stepNum}
                onClick={() => goToStep(stepNum)}
                disabled={!isCompleted && !isCurrent}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs
                  ${isCompleted 
                    ? 'bg-primary text-white' 
                    : isCurrent 
                      ? 'bg-primary/20 text-primary border border-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }
                `}
              >
                {stepNum}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {currentStep < totalSteps && (
          <Button
            onClick={goToNextStep}
            disabled={!isCurrentStepValid() || isSubmitting}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
