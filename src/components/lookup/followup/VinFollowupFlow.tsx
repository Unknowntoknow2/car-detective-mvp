
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { FollowupStepManager } from './FollowupStepManager';
import { AccidentHistoryStep } from '@/components/premium/form/steps/AccidentHistoryStep';
import { MaintenanceHistoryStep } from '@/components/premium/form/steps/MaintenanceHistoryStep';
import { FormData } from '@/types/premium-valuation';

interface FollowupStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isOptional?: boolean;
}

export const VinFollowupFlow: React.FC = () => {
  const { state, updateFollowupProgress, submitFollowup, reset } = useVinLookupFlow();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [stepValidities, setStepValidities] = useState<Record<number, boolean>>({});

  const steps: FollowupStep[] = [
    {
      id: 'accident-history',
      title: 'Accident History',
      description: 'Previous accidents and damage',
      isCompleted: currentStep > 0,
      isActive: currentStep === 0,
    },
    {
      id: 'maintenance-history',
      title: 'Maintenance Records',
      description: 'Service and maintenance history',
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      id: 'final-review',
      title: 'Review & Submit',
      description: 'Finalize enhanced valuation',
      isCompleted: false,
      isActive: currentStep === 2,
    }
  ];

  useEffect(() => {
    // Calculate progress based on completed steps
    const completedSteps = steps.filter(step => step.isCompleted).length;
    const progress = Math.round((completedSteps / steps.length) * 100);
    updateFollowupProgress(progress);
  }, [currentStep, updateFollowupProgress]);

  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({ ...prev, [step]: isValid }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    try {
      await submitFollowup(formData);
      // Navigation will be handled by the hook
    } catch (error) {
      console.error('Failed to submit followup:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AccidentHistoryStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
          />
        );
      case 1:
        return (
          <MaintenanceHistoryStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
              <p className="text-gray-600 mb-6">
                Review your information and submit for enhanced valuation.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Summary</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Accident History:</span>{' '}
                  {formData.hasAccident === 'yes' ? 'Has accidents' : 'No accidents'}
                </div>
                <div>
                  <span className="font-medium">Maintenance:</span>{' '}
                  {formData.hasRegularMaintenance === 'yes' ? 'Regular maintenance' : 'Irregular maintenance'}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Processing...' : 'Submit Enhanced Valuation'}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = stepValidities[currentStep] !== false;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={reset}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Enhanced Valuation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Manager Sidebar */}
        <div className="lg:col-span-1">
          <FollowupStepManager
            steps={steps}
            currentStepIndex={currentStep}
            progress={state.followupProgress}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
              </CardTitle>
              <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStepContent()}

              {currentStep < 2 && (
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
