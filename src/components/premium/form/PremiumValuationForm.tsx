
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormErrorBoundary } from '@/components/premium/common/FormErrorBoundary';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ZipCodeField } from '@/components/premium/lookup/form-parts/fields/ZipCodeField';
import { BasicVehicleInfo } from '@/components/premium/lookup/form-parts/BasicVehicleInfo';
import { ConditionInput } from '@/components/premium/lookup/form-parts/ConditionInput';
import { AccidentSection } from '@/components/premium/lookup/form-parts/AccidentSection';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { SubmitButton } from '@/components/premium/lookup/form-parts/SubmitButton';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { toast } from 'sonner';

interface PremiumValuationFormProps {
  onSubmit?: (data: any) => void;
}

const PremiumValuationForm: React.FC<PremiumValuationFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { showPremiumUpsell } = useFeatureFlags();
  
  // Form state
  const [selectedMakeId, setSelectedMakeId] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState<number | string>('');
  const [mileage, setMileage] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [condition, setCondition] = React.useState<ConditionLevel>(ConditionLevel.Good);
  const [hasAccident, setHasAccident] = React.useState('no');
  const [accidentDescription, setAccidentDescription] = React.useState('');
  
  // Form validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Create form for the components that require it
  const form = useForm({
    defaultValues: {
      zipCode: '',
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!selectedMakeId) newErrors.make = 'Please select a make';
    if (!selectedModel) newErrors.model = 'Please select a model';
    if (!selectedYear) newErrors.year = 'Please select a year';
    if (!mileage) newErrors.mileage = 'Please enter mileage';
    if (zipCode && !/^\d{5}$/.test(zipCode)) newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    if (hasAccident === 'yes' && !accidentDescription) newErrors.accidentDescription = 'Please describe the accident';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    setIsSubmitting(true);
    
    // Create submission data
    const formData = {
      make: selectedMakeId,
      model: selectedModel,
      year: selectedYear,
      mileage: parseInt(mileage, 10),
      zipCode,
      condition,
      hasAccident: hasAccident === 'yes',
      accidentDescription: hasAccident === 'yes' ? accidentDescription : '',
    };
    
    // Submit the form
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Demo mode - show toast
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Premium valuation request submitted successfully!');
      }, 1500);
    }
  };
  
  return (
    <FormErrorBoundary>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Premium Vehicle Valuation</CardTitle>
          <CardDescription>
            Get a comprehensive valuation with detailed market analysis and comparable sales data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Form {...form}>
              <div className="space-y-8">
                <BasicVehicleInfo
                  selectedMakeId={selectedMakeId}
                  setSelectedMakeId={setSelectedMakeId}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  mileage={mileage}
                  setMileage={setMileage}
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  isDisabled={isSubmitting}
                  errors={errors}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ConditionInput 
                      condition={condition}
                      setCondition={setCondition}
                    />
                  </div>
                  
                  <div>
                    <AccidentSection
                      hasAccident={hasAccident}
                      setHasAccident={setHasAccident}
                      accidentDescription={accidentDescription}
                      setAccidentDescription={setAccidentDescription}
                      isDisabled={isSubmitting}
                      error={errors.accidentDescription}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <SubmitButton 
                    isLoading={isSubmitting} 
                    text="Get Premium Valuation"
                    loadingText="Processing..."
                  />
                </div>
              </div>
            </Form>
          </form>
        </CardContent>
      </Card>
    </FormErrorBoundary>
  );
};

export default PremiumValuationForm;
