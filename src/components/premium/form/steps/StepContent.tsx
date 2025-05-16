
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { AccidentHistoryForm } from './accident-history/AccidentHistoryForm';
import { VehicleDetailsForm } from './vehicle-details/VehicleDetailsForm';

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateStepValidity: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => Promise<string | null>;
  handleReset: () => void;
  valuationId?: string | null;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export function StepContent({
  currentStep,
  formData,
  setFormData,
  updateStepValidity,
  isFormValid,
  handleSubmit,
  handleReset,
  valuationId,
  goToNextStep,
  goToPreviousStep
}: StepContentProps) {
  switch (currentStep) {
    case 1:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Vehicle Identification</h2>
          <p className="text-gray-600 mb-4">Please enter your vehicle's information to begin.</p>
          {/* We'll implement proper forms later */}
        </div>
      );
    case 2:
      return (
        <VehicleDetailsForm
          formData={formData}
          setFormData={setFormData}
          updateStepValidity={(isValid) => updateStepValidity(currentStep, isValid)}
          step={currentStep}
        />
      );
    case 3:
      return (
        <AccidentHistoryForm
          formData={formData}
          setFormData={setFormData}
          updateValidity={(isValid) => updateStepValidity(currentStep, isValid)}
          step={currentStep}
        />
      );
    case 4:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Feature Selection</h2>
          <p className="text-gray-600 mb-4">Select the features your vehicle has.</p>
          {/* We'll implement proper forms later */}
        </div>
      );
    case 5:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Vehicle Condition</h2>
          <p className="text-gray-600 mb-4">Rate the condition of your vehicle.</p>
          {/* We'll implement proper forms later */}
        </div>
      );
    case 6:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Photo Upload</h2>
          <p className="text-gray-600 mb-4">Upload photos of your vehicle.</p>
          {/* We'll implement proper forms later */}
        </div>
      );
    case 7:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Driving Behavior</h2>
          <p className="text-gray-600 mb-4">Tell us about your driving habits.</p>
          {/* We'll implement proper forms later */}
        </div>
      );
    case 8:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
          <p className="text-gray-600 mb-4">Review your information before submitting.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          {/* We'll implement proper forms later */}
        </div>
      );
    default:
      return null;
  }
}
