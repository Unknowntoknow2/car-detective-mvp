
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FollowupStepManager } from './FollowupStepManager';
import { VehicleConditionStep } from './steps/VehicleConditionStep';
import { MaintenanceHistoryStep } from './steps/MaintenanceHistoryStep';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { supabase } from '@/integrations/supabase/client';

interface FollowupStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isOptional?: boolean;
}

export const VinFollowupFlow: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateFollowupProgress, submitFollowup } = useVinLookupFlow();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [followupData, setFollowupData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [steps, setSteps] = useState<FollowupStep[]>([
    {
      id: 'condition',
      title: 'Vehicle Condition',
      description: 'Rate exterior, interior, mechanical, and paint condition',
      isCompleted: false,
      isActive: true,
      isOptional: false
    },
    {
      id: 'maintenance',
      title: 'Maintenance History',
      description: 'Service records and maintenance frequency',
      isCompleted: false,
      isActive: false,
      isOptional: true
    },
    {
      id: 'accidents',
      title: 'Accident History',
      description: 'Any accidents, damage, or insurance claims',
      isCompleted: false,
      isActive: false,
      isOptional: false
    }
  ]);

  // Calculate progress based on completed steps
  const calculateProgress = () => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.isCompleted).length;
    const baseProgress = 60; // Starting progress from VIN lookup
    const additionalProgress = (completedSteps / totalSteps) * 40; // Up to 40% more
    return Math.min(100, baseProgress + additionalProgress);
  };

  const progress = calculateProgress();

  // Update progress when steps change
  useEffect(() => {
    updateFollowupProgress(progress);
  }, [progress, updateFollowupProgress]);

  const updateStepStatus = (stepIndex: number, isCompleted: boolean) => {
    setSteps(prev => prev.map((step, index) => {
      if (index === stepIndex) {
        return { ...step, isCompleted };
      }
      if (index === stepIndex + 1 && isCompleted) {
        return { ...step, isActive: true };
      }
      return step;
    }));
  };

  const handleStepComplete = (stepId: string, data: any) => {
    setFollowupData(prev => ({ ...prev, [stepId]: data }));
    updateStepStatus(currentStepIndex, true);
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        isActive: index === currentStepIndex + 1
      })));
    } else {
      // All steps completed, submit the final valuation
      handleFinalSubmit();
    }
  };

  const handleStepSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        isActive: index === currentStepIndex + 1
      })));
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!state.vehicle) {
      toast.error('Vehicle information not found');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit enhanced valuation with all followup data
      const { data: enhancedValuation, error } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          ...state.vehicle,
          followupData,
          isEnhanced: true,
          confidenceBoost: Math.round((progress - 60) / 40 * 20) // Up to 20% confidence boost
        }
      });

      if (error) throw error;

      // Store the enhanced result
      await submitFollowup(followupData);
      
      // Navigate to enhanced results
      navigate(`/valuation/result/${enhancedValuation.id}?enhanced=true`);
      
      toast.success('Enhanced valuation completed!');
    } catch (error) {
      console.error('Enhanced valuation error:', error);
      toast.error('Failed to complete enhanced valuation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStepIndex) {
      setCurrentStepIndex(stepIndex);
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        isActive: index === stepIndex
      })));
    }
  };

  const renderCurrentStep = () => {
    const currentStep = steps[currentStepIndex];
    
    switch (currentStep.id) {
      case 'condition':
        return (
          <VehicleConditionStep
            onComplete={(data) => handleStepComplete('condition', data)}
            onSkip={handleStepSkip}
            initialData={followupData.condition}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceHistoryStep
            onComplete={(data) => handleStepComplete('maintenance', data)}
            onSkip={handleStepSkip}
            initialData={followupData.maintenance}
          />
        );
      case 'accidents':
        return (
          <AccidentHistoryStep
            onComplete={(data) => handleStepComplete('accidents', data)}
            onSkip={handleStepSkip}
            initialData={followupData.accidents}
          />
        );
      default:
        return null;
    }
  };

  if (!state.vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No vehicle information found. Please start with a VIN lookup.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FollowupStepManager
            steps={steps}
            currentStepIndex={currentStepIndex}
            progress={progress}
            onStepClick={handleStepClick}
          />
        </div>
        
        <div className="lg:col-span-3">
          {isSubmitting ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating enhanced valuation...</p>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>
      </div>
    </div>
  );
};
