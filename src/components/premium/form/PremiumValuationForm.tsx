
import { VehicleIdentificationStep } from './steps/VehicleIdentificationStep';
import { MileageStep } from './steps/MileageStep';
import { FuelTypeStep } from './steps/FuelTypeStep';
import { FeatureSelectionStep } from './steps/FeatureSelectionStep';
import { ConditionStep } from './steps/ConditionStep';
import { AccidentHistoryStep } from './steps/AccidentHistoryStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { FormStepLayout } from './FormStepLayout';
import { ValuationResult } from './ValuationResult';
import { usePremiumValuationForm, FeatureOption } from '@/hooks/usePremiumValuationForm';

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
  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();
  const {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    isFormValid,
    valuationId,
    stepValidities,
    updateStepValidity,
    goToNextStep,
    goToPreviousStep,
    handleReset,
    handleSubmit
  } = usePremiumValuationForm();

  return (
    <FormStepLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      isStepValid={stepValidities[currentStep]}
      onNext={goToNextStep}
      onPrevious={goToPreviousStep}
    >
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

      <ValuationResult valuationId={valuationId} />
    </FormStepLayout>
  );
}
