
import React from 'react';
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import { VehicleDetailsStep } from './steps/VehicleDetailsStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { ConditionStep } from './steps/ConditionStep';
import { PhotoUploadStep } from './steps/PhotoUploadStep';
import { DrivingBehaviorStep } from './steps/DrivingBehaviorStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';

interface FormStepsProps {
  currentStep: number;
  children: React.ReactNode;
}

export function FormSteps({ currentStep, children }: FormStepsProps) {
  return (
    <div className="py-4">
      {currentStep === 1 && <VehicleIdentificationStep step={1} />}
      {currentStep === 2 && <VehicleDetailsStep step={2} />}
      {currentStep === 3 && <AccidentHistoryStep step={3} />}
      {currentStep === 4 && <FeatureSelectionStep step={4} />}
      {currentStep === 5 && <ConditionStep step={5} />}
      {currentStep === 6 && <PhotoUploadStep step={6} />}
      {currentStep === 7 && <DrivingBehaviorStep step={7} />}
      {currentStep === 8 && <ReviewSubmitStep step={8} />}
      {children}
    </div>
  );
}
