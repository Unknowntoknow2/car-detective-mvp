
import React, { useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ConditionLevel } from '@/components/lookup/types/manualEntry'; // Import the proper enum
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import MileageStep from './steps/MileageStep';
import { ConditionStep } from './steps/ConditionStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { VehicleDetailsStep } from './steps/VehicleDetailsStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { ValuationResultStep } from './steps/ValuationResultStep';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';
import { DrivingBehaviorStep } from './steps/DrivingBehaviorStep';
import { FuelTypeStep } from './steps/FuelTypeStep';
import { PhotoUploadStep } from './steps/PhotoUploadStep';

// Define stub for PhotoUploadStep if it doesn't exist yet
// We'll replace this with actual implementation later
const PhotoUploadStep = ({ step, formData, setFormData, updateValidity }: {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}) => {
  React.useEffect(() => {
    updateValidity(step, true);
  }, []);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Photo Upload</h2>
      <p className="text-gray-500">Upload photos of your vehicle to get a more accurate valuation.</p>
    </div>
  );
};

const PremiumValuationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    // Set default values
    mileage: 0,
    condition: ConditionLevel.Good, // Use the enum value
    zipCode: '',
    fuelType: '',
    transmission: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [stepsValidity, setStepsValidity] = useState<boolean[]>([false, false, false, false, false, false, false, false, false]);
  const totalSteps = 9;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateValidity = (step: number, isValid: boolean) => {
    const newStepsValidity = [...stepsValidity];
    newStepsValidity[step] = isValid;
    setStepsValidity(newStepsValidity);
  };

  const isFormValid = stepsValidity.every(Boolean);

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    // Here you would typically handle the form submission, e.g., send the data to an API
  };

  const handleReset = () => {
    setFormData({
      mileage: 0,
      condition: ConditionLevel.Good,
      zipCode: '',
      fuelType: '',
      transmission: '',
    });
    setCurrentStep(0);
    setStepsValidity(Array(totalSteps).fill(false));
  };
  
  // Define steps for the stepper component
  const steps = [
    { id: 'identification', label: 'Identification' },
    { id: 'mileage', label: 'Mileage' },
    { id: 'condition', label: 'Condition' },
    { id: 'fuel-type', label: 'Fuel Type' },
    { id: 'details', label: 'Details' },
    { id: 'accident', label: 'Accident' },
    { id: 'features', label: 'Features' },
    { id: 'photos', label: 'Photos' },
    { id: 'review', label: 'Review' }
  ];

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Premium Vehicle Valuation</h1>

      <Stepper steps={steps} currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 0 && (
          <VehicleIdentificationStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
            lookupVehicle={() => Promise.resolve(false)}
            isLoading={false}
            goToNextStep={nextStep}
          />
        )}
        {currentStep === 1 && (
          <MileageStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 2 && (
          <ConditionStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 3 && (
          <FuelTypeStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 4 && (
          <VehicleDetailsStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 5 && (
          <AccidentHistoryStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 6 && (
          <FeatureSelectionStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 7 && (
          <PhotoUploadStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
          />
        )}
        {currentStep === 8 && (
          <ReviewSubmitStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateValidity}
            isFormValid={isFormValid}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
          />
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === totalSteps - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PremiumValuationForm;
