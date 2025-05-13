import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@/types/premium-valuation';
import { useFormSteps } from '@/hooks/useFormSteps';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useValuation } from '@/contexts/ValuationContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormStepLayout } from '@/components/premium/form/FormStepLayout';
import { VehicleIdentificationStep } from '@/components/premium/form/steps/VehicleIdentificationStep';
import { VehicleDetailsStep } from '@/components/premium/form/steps/VehicleDetailsStep';
import { ConditionStep } from '@/components/premium/form/steps/ConditionStep';
import { ReviewSubmitStep } from '@/components/premium/form/steps/ReviewSubmitStep';
import { ValuationResult } from '@/components/premium/form/steps/ValuationResult';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { useAuth } from '@/hooks/useAuth';

// Initial form data for free valuation
const initialFormData: FormData = {
  identifierType: 'vin',
  identifier: '',
  vin: '',
  make: '',
  model: '',
  year: 0,
  trim: '',
  mileage: undefined,
  zipCode: '',
  condition: 'Good',
  conditionLabel: 'Good',
  conditionScore: 75,
  hasAccident: 'no',
  accidentDescription: '',
  fuelType: '',
  transmission: '',
  bodyType: '',
  features: [],
  photos: [],
  drivingProfile: 'average',
  isPremium: false // Set to false for free valuation
};

export default function FreeValuationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processFreeValuation, isProcessing } = useValuation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const { isLoading, lookupVehicle } = useVehicleLookup();
  
  // Use our existing hooks for step management
  const { currentStep, totalSteps, goToNextStep, goToPreviousStep, goToStep } = useFormSteps(4); // Free version has fewer steps
  const { stepValidities, updateStepValidity, isFormValid } = useFormValidation(4);

  // Load saved data if available
  useEffect(() => {
    const savedData = localStorage.getItem('free_valuation_form');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
        
        // Mark step 1 as valid if we have vehicle data
        if (parsedData.make && parsedData.model && parsedData.year) {
          updateStepValidity(1, true);
        }
      } catch (err) {
        console.error('Error parsing saved form data:', err);
      }
    }
  }, [updateStepValidity]);

  // Save form data to local storage
  useEffect(() => {
    // Don't save if we're at initial state
    if (!formData.make && !formData.model && !formData.year) {
      return;
    }
    
    // Don't save if we have a valuation ID (form is submitted)
    if (valuationId) {
      return;
    }
    
    localStorage.setItem('free_valuation_form', JSON.stringify(formData));
  }, [formData, valuationId]);

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormData);
    localStorage.removeItem('free_valuation_form');
    goToStep(1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const result = await processFreeValuation({
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage || 0,
        condition: formData.condition,
        zipCode: formData.zipCode,
        hasAccident: formData.hasAccident === 'yes',
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyType,
      });

      if (result?.valuationId) {
        setValuationId(result.valuationId);
        // Store valuationId in localStorage for persistence
        localStorage.setItem('latest_valuation_id', result.valuationId);
        
        // Save to user profile if logged in
        if (user) {
          await saveFreeValuationToUserProfile(result);
        }
        
        // Clear localStorage after successful submission
        localStorage.removeItem('free_valuation_form');
        
        toast.success('Free valuation completed successfully!');
      } else {
        toast.error('Failed to generate valuation. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting free valuation:', error);
      toast.error(error.message || 'Failed to submit valuation');
    }
  };

  // Save to user profile if logged in
  const saveFreeValuationToUserProfile = async (result: any) => {
    try {
      // This would be implemented in a real application
      // to save the valuation to the user's profile
      console.log('Saving valuation to user profile:', result);
    } catch (error) {
      console.error('Error saving to profile:', error);
    }
  };

  // If we have a valuation ID, show the result
  if (valuationId) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <ValuationResult valuationId={valuationId} />
          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline" onClick={handleReset}>
              Start New Valuation
            </Button>
            <Button onClick={() => navigate('/premium')}>
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Determine which step to render
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleIdentificationStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
            lookupVehicle={lookupVehicle}
            isLoading={isLoading}
            goToNextStep={goToNextStep}
          />
        );
      case 2:
        return (
          <VehicleDetailsStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
          />
        );
      case 3:
        return (
          <ConditionStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
          />
        );
      case 4:
        return (
          <ReviewSubmitStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            updateValidity={updateStepValidity}
            isFormValid={isFormValid}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            isFreeVersion={true}
          />
        );
      default:
        return <div>Step not implemented</div>;
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Free Vehicle Valuation
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Get a basic estimate of your vehicle's value in just a few steps.
          </p>
        </div>

        <FormStepLayout
          currentStep={currentStep}
          totalSteps={totalSteps}
          isStepValid={stepValidities[currentStep] || false}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          stepValidities={stepValidities}
          encouragementMessage={
            currentStep === 1
              ? "Start by identifying your vehicle"
              : currentStep === totalSteps
              ? "Review your information and get your valuation"
              : "Continue providing details for a more accurate estimate"
          }
        >
          {renderStep()}
        </FormStepLayout>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Want a more detailed valuation?</h3>
            <p className="text-blue-600 mt-1">
              Our premium valuation includes market analysis, price trends, and dealer insights.
            </p>
            <Button 
              variant="premium" 
              className="mt-3" 
              onClick={() => navigate('/premium')}
            >
              Upgrade to Premium Valuation
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
