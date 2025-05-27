
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowupStepManager } from './FollowupStepManager';
import { MaintenanceHistoryStep } from '@/components/premium/form/steps/MaintenanceHistoryStep';
import { AccidentHistoryStep } from '@/components/premium/form/steps/AccidentHistoryStep';
import { Button } from '@/components/ui/button';
import { FormData, ConditionLevel } from '@/types/premium-valuation';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const VinFollowupFlow: React.FC = () => {
  const { state } = useVinLookupFlow();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentVin = state.vin || searchParams.get('vin') || '';
  const { answers, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(currentVin);
  
  // Initialize formData with proper default values
  const [formData, setFormData] = useState<FormData>({
    mileage: answers.mileage || 0,
    condition: (answers.condition as ConditionLevel) || ConditionLevel.Good,
    zipCode: answers.zip_code || '',
    fuelType: '',
    transmission: '',
    conditionScore: 0,
    hasRegularMaintenance: answers.service_history ? answers.service_history !== 'unknown' : undefined,
    maintenanceNotes: '',
    hasAccident: answers.accidents?.hadAccident,
    accidentDescription: ''
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepValidities, setStepValidities] = useState<Record<number, boolean>>({});

  const followupSteps = [
    {
      id: 'maintenance',
      title: 'Maintenance History',
      description: 'Vehicle service and maintenance records',
      isCompleted: stepValidities[0] || false,
      isActive: currentStepIndex === 0,
    },
    {
      id: 'accidents',
      title: 'Accident History',
      description: 'Any accidents or damage history',
      isCompleted: stepValidities[1] || false,
      isActive: currentStepIndex === 1,
    }
  ];

  const updateValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < followupSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const calculateProgress = () => {
    const completedSteps = Object.values(stepValidities).filter(Boolean).length;
    return Math.round((completedSteps / followupSteps.length) * 100);
  };

  const handleComplete = async () => {
    console.log('Completing follow-up with data:', formData);
    
    try {
      // Update follow-up answers with completion
      const updatedAnswers = {
        ...answers,
        mileage: formData.mileage,
        condition: formData.condition,
        zip_code: formData.zipCode,
        service_history: formData.hasRegularMaintenance ? 'regular' : 'irregular',
        completion_percentage: 100,
        is_complete: true
      };

      updateAnswers(updatedAnswers);
      
      // Save the answers
      const saved = await saveAnswers(updatedAnswers);
      
      if (saved) {
        toast.success('Valuation completed! Redirecting to results...');
        
        // Navigate back to valuation page to show results
        setTimeout(() => {
          if (currentVin) {
            navigate(`/valuation/${currentVin}`);
          } else {
            navigate('/valuation');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast.error('Failed to complete valuation. Please try again.');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <MaintenanceHistoryStep
            step={0}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        );
      case 1:
        return (
          <AccidentHistoryStep
            step={1}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = stepValidities[currentStepIndex] || false;
  const isLastStep = currentStepIndex === followupSteps.length - 1;
  const allStepsComplete = Object.values(stepValidities).every(Boolean);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <FollowupStepManager
            steps={followupSteps}
            currentStepIndex={currentStepIndex}
            progress={calculateProgress()}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Enhanced Valuation - Step {currentStepIndex + 1} of {followupSteps.length}
              </CardTitle>
              <p className="text-gray-600">
                {followupSteps[currentStepIndex]?.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Info Display */}
              {(state.vehicle || currentVin) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  {state.vehicle ? (
                    <h3 className="font-semibold text-blue-900">
                      {state.vehicle.year} {state.vehicle.make} {state.vehicle.model}
                    </h3>
                  ) : (
                    <h3 className="font-semibold text-blue-900">
                      Vehicle Valuation
                    </h3>
                  )}
                  <p className="text-sm text-blue-700">VIN: {currentVin}</p>
                </div>
              )}

              {/* Current Step Content */}
              <div className="min-h-[400px]">
                {renderCurrentStep()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={handleComplete}
                    disabled={!allStepsComplete || saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      'Completing...'
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Valuation
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
