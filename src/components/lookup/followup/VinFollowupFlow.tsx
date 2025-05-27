
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useFollowUpAnswers } from '@/hooks/useFollowUpAnswers';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentHistorySection } from '@/components/valuation/enhanced-followup/AccidentHistorySection';
import { MaintenanceHistorySection } from '@/components/valuation/enhanced-followup/MaintenanceHistorySection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { TitleStatusSelector } from '@/components/valuation/enhanced-followup/TitleStatusSelector';
import { PreviousUseSelector } from '@/components/valuation/enhanced-followup/PreviousUseSelector';
import { ZipCodeInput } from '@/components/common/ZipCodeInput';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface VinFollowupFlowProps {
  initialVin?: string;
}

export function VinFollowupFlow({ initialVin }: VinFollowupFlowProps) {
  const { state } = useVinLookupFlow();
  const navigate = useNavigate();
  const vin = initialVin || state.vin;
  
  const {
    answers,
    isLoading,
    updateAnswer,
    submitAnswers,
    isComplete
  } = useFollowUpAnswers(vin);

  const [currentStep, setCurrentStep] = useState(0);
  const completionPercentage = answers?.completion_percentage ?? 0;

  useEffect(() => {
    if (completionPercentage > 0) {
      const step = Math.floor((completionPercentage / 100) * steps.length);
      setCurrentStep(Math.min(step, steps.length - 1));
    }
  }, [completionPercentage]);

  const steps = [
    {
      id: 'mileage',
      title: 'Vehicle Mileage',
      component: (
        <MileageInput
          value={answers?.mileage}
          onChange={(value) => updateAnswer('mileage', value)}
        />
      )
    },
    {
      id: 'zip_code',
      title: 'Vehicle Location',
      component: (
        <ZipCodeInput
          value={answers?.zip_code || ''}
          onChange={(value) => updateAnswer('zip_code', value)}
          placeholder="Enter ZIP code where vehicle is located"
        />
      )
    },
    {
      id: 'condition',
      title: 'Overall Condition',
      component: (
        <ConditionSelector
          value={answers?.condition}
          onChange={(value) => updateAnswer('condition', value)}
        />
      )
    },
    {
      id: 'accidents',
      title: 'Accident History',
      component: (
        <AccidentHistorySection
          value={answers?.accidents}
          onChange={(value) => updateAnswer('accidents', value)}
        />
      )
    },
    {
      id: 'maintenance',
      title: 'Maintenance History',
      component: (
        <MaintenanceHistorySection
          value={{
            serviceHistory: answers?.service_history,
            maintenanceStatus: answers?.maintenance_status,
            lastServiceDate: answers?.last_service_date
          }}
          onChange={(value) => {
            updateAnswer('service_history', value.serviceHistory);
            updateAnswer('maintenance_status', value.maintenanceStatus);
            updateAnswer('last_service_date', value.lastServiceDate);
          }}
        />
      )
    },
    {
      id: 'dashboard_lights',
      title: 'Dashboard Warning Lights',
      component: (
        <DashboardLightsSection
          value={answers?.dashboard_lights}
          onChange={(value) => updateAnswer('dashboard_lights', value)}
        />
      )
    },
    {
      id: 'title_status',
      title: 'Title Status',
      component: (
        <TitleStatusSelector
          value={answers?.title_status}
          onChange={(value) => updateAnswer('title_status', value)}
        />
      )
    },
    {
      id: 'previous_use',
      title: 'Previous Use',
      component: (
        <PreviousUseSelector
          value={answers?.previous_use}
          onChange={(value) => updateAnswer('previous_use', value)}
        />
      )
    }
  ];

  const handleSubmit = async () => {
    try {
      // Convert accidents object to count for submitFollowup
      const accidentCount = answers?.accidents?.hadAccident ? 
        (answers.accidents.count || 1) : 0;

      const result = await submitAnswers({
        vin,
        mileage: answers?.mileage || 0,
        zip_code: answers?.zip_code || '',
        condition: answers?.condition || 'good',
        accidents: accidentCount, // Convert to number
        service_history: answers?.service_history,
        maintenance_status: answers?.maintenance_status,
        last_service_date: answers?.last_service_date,
        dashboard_lights: answers?.dashboard_lights,
        title_status: answers?.title_status,
        previous_use: answers?.previous_use,
        frame_damage: answers?.accidents?.frameDamage || false,
        previous_owners: answers?.previous_owners || 1,
        modifications: answers?.modifications,
        tire_condition: answers?.tire_condition
      });

      if (result) {
        toast.success('Vehicle assessment completed successfully!');
        navigate(`/valuation/${vin}?completed=true`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to complete assessment. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'mileage':
        return answers?.mileage && answers.mileage > 0;
      case 'zip_code':
        return answers?.zip_code && answers.zip_code.length >= 5;
      case 'condition':
        return !!answers?.condition;
      default:
        return true;
    }
  };

  if (!vin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No VIN provided for follow-up assessment.</p>
          <Button 
            onClick={() => navigate('/vin-lookup')} 
            className="mt-4"
          >
            Start VIN Lookup
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
          <p className="text-muted-foreground mb-6">
            Your vehicle assessment has been completed and saved.
          </p>
          <Button onClick={() => navigate(`/valuation/${vin}`)}>
            View Valuation Results
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Vehicle Assessment</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStepData.component}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
              >
                {isLoading ? 'Submitting...' : 'Complete Assessment'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-xs space-y-1">
            <div>VIN: {vin}</div>
            <div>Current Step: {currentStep + 1}/{steps.length}</div>
            <div>Completion: {completionPercentage}%</div>
            <div>Can Proceed: {canProceed() ? 'Yes' : 'No'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
