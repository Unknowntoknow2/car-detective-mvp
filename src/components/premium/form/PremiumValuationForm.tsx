
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FormSteps } from './FormSteps';
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import { MileageStep } from './steps/MileageStep';
import { FuelTypeStep } from './steps/FuelTypeStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { ConditionStep } from './steps/ConditionStep';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { ProgressIndicator } from './ProgressIndicator';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { FormStepNavigation } from './FormStepNavigation';
import { useToast } from '@/components/ui/use-toast';

export type FeatureOption = {
  id: string;
  name: string;
  icon: string;
  value: number;
};

export type FormData = {
  identifierType: 'vin' | 'plate';
  identifier: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  fuelType: string | null;
  features: string[];
  condition: number;
  conditionLabel: string;
  hasAccident: boolean;
  accidentDescription: string;
  zipCode: string;
};

// Feature options for selection step
const featureOptions: FeatureOption[] = [
  { id: 'leather', name: 'Leather Seats', icon: 'car', value: 800 },
  { id: 'sunroof', name: 'Sunroof/Moonroof', icon: 'sun', value: 600 },
  { id: 'navigation', name: 'Navigation System', icon: 'map', value: 500 },
  { id: 'premium_audio', name: 'Premium Audio', icon: 'headphones', value: 400 },
  { id: 'backup_camera', name: 'Backup Camera', icon: 'camera', value: 300 },
  { id: 'heated_seats', name: 'Heated Seats', icon: 'thermometer', value: 450 },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', value: 150 },
  { id: 'third_row', name: 'Third Row Seating', icon: 'users', value: 700 },
  { id: 'alloy_wheels', name: 'Alloy Wheels', icon: 'circle', value: 350 },
  { id: 'parking_sensors', name: 'Parking Sensors', icon: 'bell', value: 250 },
  { id: 'power_liftgate', name: 'Power Liftgate', icon: 'chevron-up', value: 400 },
  { id: 'remote_start', name: 'Remote Start', icon: 'key', value: 300 }
];

export function PremiumValuationForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    identifierType: 'vin',
    identifier: '',
    make: '',
    model: '',
    year: 0,
    mileage: null,
    fuelType: null,
    features: [],
    condition: 50, // Default to middle (Fair-Good)
    conditionLabel: 'Fair',
    hasAccident: false,
    accidentDescription: '',
    zipCode: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepValidities, setStepValidities] = useState({
    1: false,
    2: true, // Mileage might be provided from lookup
    3: true, // Fuel type might be provided from lookup
    4: true, // Features are optional
    5: true, // Condition has default
    6: true, // Accident has default (No)
    7: true  // Review step is always valid
  });

  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();

  // Update form with vehicle data when lookup completes
  useEffect(() => {
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || 0,
        mileage: vehicle.mileage || null,
        fuelType: vehicle.fuelType || null
      }));
      
      // Determine which steps need to be shown
      setStepValidities(prev => ({
        ...prev,
        1: true,
        2: Boolean(vehicle.mileage),
        3: Boolean(vehicle.fuelType)
      }));
      
      // Move to next required step
      if (!vehicle.mileage) {
        setCurrentStep(2);
      } else if (!vehicle.fuelType) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
      
      toast({
        title: "Vehicle Found",
        description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      });
    }
  }, [vehicle, toast]);

  // Check if form is valid for submission
  useEffect(() => {
    const allStepsValid = Object.values(stepValidities).every(valid => valid);
    setIsFormValid(allStepsValid);
  }, [stepValidities]);

  // Handle next step navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      // Find the next step that needs to be shown
      let nextStep = currentStep + 1;
      while (nextStep <= totalSteps && 
             ((nextStep === 2 && formData.mileage !== null) || 
              (nextStep === 3 && formData.fuelType !== null))) {
        nextStep++;
      }
      setCurrentStep(nextStep);
    }
  };

  // Handle previous step navigation
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      // Find the previous step that needs to be shown
      let prevStep = currentStep - 1;
      while (prevStep >= 1 && 
             ((prevStep === 2 && formData.mileage !== null) || 
              (prevStep === 3 && formData.fuelType !== null))) {
        prevStep--;
      }
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setFormData({
      identifierType: 'vin',
      identifier: '',
      make: '',
      model: '',
      year: 0,
      mileage: null,
      fuelType: null,
      features: [],
      condition: 50,
      conditionLabel: 'Fair',
      hasAccident: false,
      accidentDescription: '',
      zipCode: ''
    });
    setCurrentStep(1);
    setStepValidities({
      1: false,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true
    });
  };

  const handleSubmit = () => {
    if (isFormValid) {
      toast({
        title: "Valuation Complete",
        description: "Your premium valuation has been generated successfully.",
      });
      // In a real app, you would submit the data to your backend here
      console.log("Form submitted:", formData);
    }
  };

  // Update step validity
  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidities(prev => ({
      ...prev,
      [step]: isValid
    }));
  };

  // Total number of steps
  const totalSteps = 7;

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <Card className="overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="p-6">
          <FormSteps currentStep={currentStep}>
            <VehicleIdentificationStep 
              step={1} 
              formData={formData} 
              setFormData={setFormData}
              updateValidity={updateStepValidity}
              lookupVehicle={lookupVehicle}
              isLoading={isLoading}
            />
            
            {formData.mileage === null && (
              <MileageStep 
                step={2} 
                formData={formData} 
                setFormData={setFormData}
                updateValidity={updateStepValidity}
              />
            )}
            
            {formData.fuelType === null && (
              <FuelTypeStep 
                step={3} 
                formData={formData} 
                setFormData={setFormData}
                updateValidity={updateStepValidity}
              />
            )}
            
            <FeatureSelectionStep 
              step={4} 
              formData={formData} 
              setFormData={setFormData}
              updateValidity={updateStepValidity}
              featureOptions={featureOptions}
            />
            
            <ConditionStep 
              step={5} 
              formData={formData} 
              setFormData={setFormData}
              updateValidity={updateStepValidity}
            />
            
            <AccidentHistoryStep 
              step={6} 
              formData={formData} 
              setFormData={setFormData}
              updateValidity={updateStepValidity}
            />
            
            <ReviewSubmitStep 
              step={7} 
              formData={formData}
              featureOptions={featureOptions} 
              handleSubmit={handleSubmit}
              handleReset={handleReset}
              isFormValid={isFormValid}
            />
          </FormSteps>
          
          <FormStepNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isStepValid={stepValidities[currentStep]}
          />
        </div>
      </Card>
    </div>
  );
}
