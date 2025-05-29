
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { ServiceHistorySection } from './improved/ServiceHistorySection';
import { AccidentHistorySection } from './improved/AccidentHistorySection';
import { VehicleFeaturesSection } from './improved/VehicleFeaturesSection';
import { ChevronLeft, ChevronRight, Car, FileText, Star, CheckCircle } from 'lucide-react';

interface AccidentReport {
  id: string;
  severity: 'minor' | 'moderate' | 'severe';
  location: 'front' | 'rear' | 'side' | 'multiple';
  professionallyRepaired: boolean;
  description: string;
  estimatedCost?: number;
}

interface ImprovedUnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

const steps = [
  { id: 'basics', title: 'Vehicle Basics', icon: Car, description: 'Essential vehicle information' },
  { id: 'condition', title: 'Condition Assessment', icon: FileText, description: 'Current vehicle condition' },
  { id: 'history', title: 'Service & History', icon: FileText, description: 'Maintenance and accident history' },
  { id: 'features', title: 'Features & Details', icon: Star, description: 'Equipment and specifications' }
];

export function ImprovedUnifiedFollowUpForm({ vin, onComplete }: ImprovedUnifiedFollowUpFormProps) {
  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Service & History)
  const [serviceHistory, setServiceHistory] = useState('');
  const [hasAccident, setHasAccident] = useState(false);
  const [accidents, setAccidents] = useState<AccidentReport[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

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
    const formData: FollowUpAnswers = {
      vin,
      service_history: serviceHistory,
      accidents: {
        hadAccident: hasAccident,
        count: accidents.length,
        severity: accidents.length > 0 ? accidents[0].severity : undefined,
        description: accidents.map(acc => 
          `${acc.severity} ${acc.location} accident - ${acc.professionallyRepaired ? 'Professionally repaired' : 'Not professionally repaired'}. ${acc.description}`
        ).join('; ')
      },
      modifications: {
        modified: false
      },
      completion_percentage: 100,
      is_complete: true
    };

    onComplete(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 2: // Service & History
        return serviceHistory !== '';
      case 3: // Features
        return true; // Features are optional
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Vehicle Valuation Assessment</h2>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Complete the assessment to get your accurate valuation
          </p>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Steps Overview */}
      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isAvailable = index <= currentStep;

          return (
            <Card 
              key={step.id}
              className={`
                cursor-pointer transition-all
                ${isActive ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                ${isCompleted ? 'bg-green-50 border-green-200' : ''}
                ${!isAvailable ? 'opacity-50' : ''}
              `}
              onClick={() => isAvailable && setCurrentStep(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 2 && (
          <div className="space-y-6">
            <ServiceHistorySection 
              value={serviceHistory}
              onChange={setServiceHistory}
            />
            <AccidentHistorySection
              hasAccident={hasAccident}
              accidents={accidents}
              onChange={(hasAcc, accList) => {
                setHasAccident(hasAcc);
                setAccidents(accList);
              }}
            />
          </div>
        )}

        {currentStep === 3 && (
          <VehicleFeaturesSection
            selectedFeatures={selectedFeatures}
            onChange={setSelectedFeatures}
          />
        )}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {currentStepData.title}
              </p>
              <p className="text-xs text-gray-500">
                {currentStepData.description}
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next Step'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
