
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { TitleStatusSelector } from '@/components/title-ownership/TitleStatusSelector';
import { PreviousUseSelector } from '@/components/valuation/enhanced-followup/PreviousUseSelector';

export function VinFollowupFlow() {
  const { state } = useVinLookupFlow();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { answers, updateAnswers, saving } = useFollowUpAnswers(state.vin || '');

  const steps = [
    { title: 'Mileage', key: 'mileage' },
    { title: 'Condition', key: 'condition' },
    { title: 'Accidents', key: 'accidents' },
    { title: 'Modifications', key: 'modifications' },
    { title: 'Dashboard Lights', key: 'dashboard_lights' },
    { title: 'Title Status', key: 'title_status' },
    { title: 'Previous Use', key: 'previous_use' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!state.vin) {
      navigate('/vin-lookup');
    }
  }, [state.vin, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast.success('Follow-up questions completed!');
    const vinParam = state.vin ? `?vin=${state.vin}` : '';
    navigate(`/valuation-result${vinParam}`);
  };

  const handleMileageChange = (value: number) => {
    updateAnswers({ mileage: value });
  };

  const handleConditionChange = (value: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateAnswers({ condition: value });
  };

  const handleAccidentChange = (value: any) => {
    updateAnswers({ accidents: value });
  };

  const handleModificationsChange = (value: any) => {
    updateAnswers({ modifications: value });
  };

  const handleDashboardLightsChange = (value: string[]) => {
    updateAnswers({ dashboard_lights: value });
  };

  const handleTitleStatusChange = (value: string) => {
    updateAnswers({ title_status: value });
  };

  const handlePreviousUseChange = (value: string) => {
    updateAnswers({ previous_use: value });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.key) {
      case 'mileage':
        return (
          <MileageInput
            value={answers.mileage}
            onChange={handleMileageChange}
          />
        );
      case 'condition':
        return (
          <ConditionSelector
            value={answers.condition}
            onChange={handleConditionChange}
          />
        );
      case 'accidents':
        return (
          <AccidentSection
            value={answers.accidents}
            onChange={handleAccidentChange}
          />
        );
      case 'modifications':
        return (
          <ModificationsSection
            value={answers.modifications}
            onChange={handleModificationsChange}
          />
        );
      case 'dashboard_lights':
        return (
          <DashboardLightsSection
            value={answers.dashboard_lights}
            onChange={handleDashboardLightsChange}
          />
        );
      case 'title_status':
        return (
          <TitleStatusSelector
            value={answers.title_status}
            onChange={handleTitleStatusChange}
          />
        );
      case 'previous_use':
        return (
          <PreviousUseSelector
            value={answers.previous_use}
            onChange={handlePreviousUseChange}
          />
        );
      default:
        return null;
    }
  };

  if (!state.vin) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Vehicle Assessment</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={saving}
            >
              {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
