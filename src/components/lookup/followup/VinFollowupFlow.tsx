
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { ServiceHistorySelector } from '@/components/valuation/enhanced-followup/ServiceHistorySelector';
import { MaintenanceStatusSelector } from '@/components/valuation/enhanced-followup/MaintenanceStatusSelector';
import { AccidentHistorySection } from '@/components/valuation/enhanced-followup/AccidentHistorySection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { TireConditionSelector } from '@/components/valuation/enhanced-followup/TireConditionSelector';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { TitleStatusSelector } from '@/components/title-ownership/TitleStatusSelector';
import { PreviousUseSelector } from '@/components/valuation/enhanced-followup/PreviousUseSelector';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';

export function VinFollowupFlow() {
  const { state, startFollowup } = useVinLookupFlow();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { answers, updateAnswers, saving } = useFollowUpAnswers(state.vin || '');

  const steps = [
    { title: 'Mileage', key: 'mileage' },
    { title: 'Condition', key: 'condition' },
    { title: 'Accident History', key: 'accidents' },
    { title: 'Service History', key: 'serviceHistory' },
    { title: 'Maintenance Status', key: 'maintenanceStatus' },
    { title: 'Title Status', key: 'titleStatus' },
    { title: 'Previous Use', key: 'previousUse' },
    { title: 'Tire Condition', key: 'tireCondition' },
    { title: 'Dashboard Lights', key: 'dashboardLights' },
    { title: 'Modifications', key: 'modifications' }
  ];

  useEffect(() => {
    if (!state.vin) {
      navigate('/vin-lookup');
    }
  }, [state.vin, navigate]);

  const handleStartFollowup = () => {
    console.log('Starting followup flow...');
    startFollowup();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Assessment completed');
      navigate('/valuation-result');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.key) {
      case 'mileage':
        return (
          <MileageInput
            value={answers.mileage}
            onChange={(mileage) => updateAnswers({ mileage })}
          />
        );
      
      case 'condition':
        return (
          <ConditionSelector
            value={answers.condition}
            onChange={(condition) => updateAnswers({ condition })}
          />
        );
      
      case 'accidents':
        return (
          <AccidentHistorySection
            value={answers.accidents}
            onChange={(accidents) => updateAnswers({ accidents })}
          />
        );
      
      case 'serviceHistory':
        return (
          <ServiceHistorySelector
            value={answers.service_history}
            onChange={(service_history) => updateAnswers({ service_history })}
          />
        );
      
      case 'maintenanceStatus':
        return (
          <MaintenanceStatusSelector
            value={answers.maintenance_status}
            onChange={(maintenance_status) => updateAnswers({ maintenance_status })}
          />
        );
      
      case 'titleStatus':
        return (
          <TitleStatusSelector
            value={answers.title_status}
            onChange={(title_status) => updateAnswers({ title_status })}
          />
        );
      
      case 'previousUse':
        return (
          <PreviousUseSelector
            value={answers.previous_use}
            onChange={(previous_use) => updateAnswers({ previous_use })}
          />
        );
      
      case 'tireCondition':
        return (
          <TireConditionSelector
            value={answers.tire_condition}
            onChange={(tire_condition) => updateAnswers({ tire_condition })}
          />
        );
      
      case 'dashboardLights':
        return (
          <DashboardLightsSection
            value={answers.dashboard_lights}
            onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
          />
        );
      
      case 'modifications':
        return (
          <ModificationsSection
            value={answers.modifications}
            onChange={(modifications) => updateAnswers({ modifications })}
          />
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  // Show vehicle found card if we have a vehicle but haven't started followup yet
  if (state.vehicle && state.stage === 'results') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <VehicleFoundCard 
          vehicle={state.vehicle}
          showActions={true}
          onContinue={handleStartFollowup}
        />
      </div>
    );
  }

  // Show followup questions when in followup stage
  if (state.stage === 'followup') {
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

  // Default fallback
  return null;
}
