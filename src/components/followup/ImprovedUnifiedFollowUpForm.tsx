
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Car, Wrench, Shield, Cog } from 'lucide-react';
import { ServiceHistorySection } from './improved/ServiceHistorySection';
import { AccidentHistorySection, AccidentDetails } from './improved/AccidentHistorySection';
import { VehicleFeaturesSection } from './improved/VehicleFeaturesSection';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ImprovedUnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

const steps = [
  {
    id: 'service',
    title: 'Service History',
    description: 'How has your vehicle been maintained?',
    icon: Wrench
  },
  {
    id: 'accidents',
    title: 'Accident History',
    description: 'Any accidents or damage history?',
    icon: Shield
  },
  {
    id: 'features',
    title: 'Vehicle Features',
    description: 'Select your vehicle features and options',
    icon: Cog
  }
];

export function ImprovedUnifiedFollowUpForm({ vin, onComplete }: ImprovedUnifiedFollowUpFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    serviceHistory: '',
    hasAccidents: false,
    accidentDetails: {
      severity: 'minor',
      location: '',
      repaired: false,
      cost: undefined,
      description: ''
    },
    selectedFeatures: [],
    additionalNotes: ''
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateServiceHistory = (value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceHistory: value
    }));
  };

  const updateAccidentDetails = (value: AccidentDetails) => {
    setFormData(prev => ({
      ...prev,
      accidentDetails: value,
      hasAccidents: true
    }));
  };

  const updateFeatures = (features: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: features
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit form
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Service History
        return formData.serviceHistory !== '';
      case 1: // Accidents
        return true; // Always can proceed from accidents step
      case 2: // Features
        return true; // Always can proceed from features step
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'service':
        return (
          <ServiceHistorySection
            value={formData.serviceHistory}
            onChange={updateServiceHistory}
          />
        );
      
      case 'accidents':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Has this vehicle been in any accidents?</h3>
              <div className="flex gap-4 justify-center">
                <Button
                  type="button"
                  variant={!formData.hasAccidents ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, hasAccidents: false }))}
                  className="px-8"
                >
                  No Accidents
                </Button>
                <Button
                  type="button"
                  variant={formData.hasAccidents ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, hasAccidents: true }))}
                  className="px-8"
                >
                  Yes, Had Accidents
                </Button>
              </div>
            </div>
            
            {formData.hasAccidents && (
              <AccidentHistorySection
                value={formData.accidentDetails}
                onChange={updateAccidentDetails}
              />
            )}
          </div>
        );
      
      case 'features':
        return (
          <VehicleFeaturesSection
            value={formData.selectedFeatures}
            onChange={updateFeatures}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Valuation Assessment
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Complete the assessment to get your accurate valuation
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Overall Progress</div>
              <div className="text-2xl font-bold text-primary">
                {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-1 ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-center max-w-20">
                      {step.title}
                    </span>
                    <span className="text-xs text-center max-w-20">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next Step'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
