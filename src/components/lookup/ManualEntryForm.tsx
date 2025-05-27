
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ManualEntryFormData, ManualEntryFormProps, ConditionLevel } from './types/manualEntry';
import { VehicleBasicInfoFields } from './manual/components/VehicleBasicInfoFields';
import { VehicleDetailsFields } from './manual/components/VehicleDetailsFields';
import { ConditionAndZipFields } from './manual/components/ConditionAndZipFields';
import { VinInputField } from './manual/components/VinInputField';

const manualEntrySchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Valid year is required').max(new Date().getFullYear() + 1),
  mileage: z.number().min(0, 'Mileage must be positive'),
  condition: z.nativeEnum(ConditionLevel),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  trim: z.string().optional(),
  color: z.string().optional(),
  bodyStyle: z.string().optional(),
  vin: z.string().optional(),
});

/**
 * Free version of the ManualEntryForm component
 */
export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      condition: ConditionLevel.Good,
      zipCode: '',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      trim: '',
      color: '',
      bodyStyle: '',
      vin: '',
    },
  });

  const handleSubmit = (data: ManualEntryFormData) => {
    console.log('Manual entry form submitted:', data);
    onSubmit(data);
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <VehicleBasicInfoFields form={form} />
            <VinInputField form={form} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <VehicleDetailsFields form={form} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <ConditionAndZipFields form={form} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isPremium ? 'Premium ' : ''}Vehicle Information
        </CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Vehicle Details'}
            {step === 3 && 'Condition & Location'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className={step === 1 ? 'ml-auto' : ''}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto"
                >
                  {isLoading ? 'Processing...' : submitButtonText}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualEntryForm;
