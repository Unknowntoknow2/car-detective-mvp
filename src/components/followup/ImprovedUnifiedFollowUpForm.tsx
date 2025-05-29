
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ServiceHistorySection } from './improved/ServiceHistorySection';
import { AccidentHistorySection } from './improved/AccidentHistorySection';
import { VehicleFeaturesSection } from './improved/VehicleFeaturesSection';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface ImprovedUnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

export function ImprovedUnifiedFollowUpForm({ vin, onComplete }: ImprovedUnifiedFollowUpFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: 0,
    zip_code: '',
    condition: 'good',
    service_history: '',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    maintenance_status: '',
    title_status: '',
    previous_owners: 1,
    previous_use: '',
    tire_condition: '',
    dashboard_lights: [],
    frame_damage: false,
    modifications: {
      modified: false,
      types: [],
      reversible: false
    },
    completion_percentage: 0,
    is_complete: false
  });

  const steps = [
    { title: 'Vehicle Basics', description: 'Essential vehicle information' },
    { title: 'Condition Assessment', description: 'Current vehicle condition' },
    { title: 'Service & History', description: 'Maintenance and accident history' },
    { title: 'Additional Details', description: 'Modifications and specifics' }
  ];

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleServiceHistoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service_history: value
    }));
  };

  const handleMileageChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      mileage: value
    }));
  };

  const handleZipCodeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      zip_code: value
    }));
  };

  const handleConditionChange = (value: 'excellent' | 'good' | 'fair' | 'poor') => {
    setFormData(prev => ({
      ...prev,
      condition: value
    }));
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.mileage > 0 && formData.zip_code && formData.condition;
      case 1:
        return true; // Condition step is always valid
      case 2:
        return formData.service_history && (
          !formData.accidents?.hadAccident || 
          (formData.accidents?.hadAccident && formData.accidents?.description)
        );
      case 3:
        return true; // Additional details are optional
      default:
        return false;
    }
  };

  const handleAccidentChange = (accidentDetails: AccidentDetails) => {
    setFormData(prev => ({
      ...prev,
      accidents: accidentDetails
    }));
  };

  const handleFeaturesChange = (features: string[]) => {
    setFormData(prev => ({
      ...prev,
      features: features
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the form
      const finalData = {
        ...formData,
        completion_percentage: 100,
        is_complete: true
      };
      onComplete(finalData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Mileage *
                </label>
                <input
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => handleMileageChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mileage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.zip_code || ''}
                  onChange={(e) => handleZipCodeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Condition *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['excellent', 'good', 'fair', 'poor'] as const).map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => handleConditionChange(condition)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.condition === condition
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{condition}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Condition Assessment</h3>
            <p className="text-gray-600">
              Additional condition details will be collected here based on your overall condition selection.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <ServiceHistorySection 
              value={formData.service_history || ''} 
              onChange={handleServiceHistoryChange} 
            />
            
            <AccidentHistorySection
              value={formData.accidents || { hadAccident: false }}
              onChange={handleAccidentChange}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <VehicleFeaturesSection 
              selectedFeatures={formData.features || []}
              onChange={handleFeaturesChange} 
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Valuation Assessment</CardTitle>
        <p className="text-gray-600">Complete the assessment to get your accurate valuation</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{currentStep + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-50'
                  : index < currentStep
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h4 className="font-medium text-sm">{step.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!isCurrentStepValid()}
          >
            {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next Step'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
