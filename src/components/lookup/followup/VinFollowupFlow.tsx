
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useVinLookupFlow, FollowupData } from '@/hooks/useVinLookupFlow';
import { FollowupStep } from './FollowupStep';

const FOLLOWUP_STEPS = [
  {
    id: 'mileage',
    title: 'Vehicle Mileage',
    description: 'Current odometer reading',
    category: 'basic',
    weight: 15
  },
  {
    id: 'condition',
    title: 'Overall Condition',
    description: 'General condition assessment',
    category: 'basic',
    weight: 12
  },
  {
    id: 'accidents',
    title: 'Accident History',
    description: 'Number of reported accidents',
    category: 'history',
    weight: 10
  },
  {
    id: 'title',
    title: 'Title Status',
    description: 'Clean, salvage, or rebuilt title',
    category: 'history',
    weight: 8
  },
  {
    id: 'maintenance',
    title: 'Maintenance Records',
    description: 'Service history availability',
    category: 'history',
    weight: 6
  },
  {
    id: 'location',
    title: 'Vehicle Location',
    description: 'Current ZIP code for regional pricing',
    category: 'market',
    weight: 5
  },
  {
    id: 'photos',
    title: 'Vehicle Photos',
    description: 'Upload photos for AI condition analysis',
    category: 'advanced',
    weight: 8
  }
];

export const VinFollowupFlow: React.FC = () => {
  const { state, updateFollowupProgress, submitFollowup } = useVinLookupFlow();
  const [currentStep, setCurrentStep] = useState(0);
  const [followupData, setFollowupData] = useState<FollowupData>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleStepComplete = (stepId: string, data: any) => {
    const newData = { ...followupData, [stepId]: data };
    setFollowupData(newData);
    
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);

    // Calculate progress based on completed steps and their weights
    const totalWeight = FOLLOWUP_STEPS.reduce((sum, step) => sum + step.weight, 0);
    const completedWeight = FOLLOWUP_STEPS
      .filter(step => newCompleted.has(step.id))
      .reduce((sum, step) => sum + step.weight, 0);
    
    const progress = Math.round((completedWeight / totalWeight) * 100);
    updateFollowupProgress(progress);
  };

  const handleNext = () => {
    if (currentStep < FOLLOWUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the followup process
      submitFollowup(followupData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = FOLLOWUP_STEPS[currentStep];
  const isStepCompleted = completedSteps.has(currentStepData.id);
  const canProceed = isStepCompleted || currentStep === 0;

  if (!state.vehicle) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enhance Your Valuation</span>
            <span className="text-sm font-normal text-gray-500">
              {state.followupProgress}% Complete
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={state.followupProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Answer these questions to improve valuation accuracy from 75% to 100%
          </p>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isStepCompleted && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {currentStepData.title}
              </CardTitle>
              <p className="text-gray-600 mt-1">{currentStepData.description}</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {FOLLOWUP_STEPS.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FollowupStep
            step={currentStepData}
            value={followupData[currentStepData.id]}
            onComplete={(data) => handleStepComplete(currentStepData.id, data)}
            vehicle={state.vehicle}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed && currentStep > 0}
        >
          {currentStep === FOLLOWUP_STEPS.length - 1 ? (
            'Complete Valuation'
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Step Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {FOLLOWUP_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2 rounded ${
                  index === currentStep
                    ? 'bg-blue-50 border border-blue-200'
                    : completedSteps.has(step.id)
                    ? 'bg-green-50'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {completedSteps.has(step.id) ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <span className="text-xs text-gray-500">+{step.weight}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VinFollowupFlow;
