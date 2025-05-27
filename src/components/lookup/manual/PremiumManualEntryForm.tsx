
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';
import { VehicleBasicInfoFields } from './components/VehicleBasicInfoFields';
import { VehicleDetailsFields } from './components/VehicleDetailsFields';
import { ConditionAndZipFields } from './components/ConditionAndZipFields';
import { VinInputField } from './components/VinInputField';

const premiumManualEntrySchema = z.object({
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
  selectedFeatures: z.array(z.string()).optional(),
  accidentDetails: z.object({
    hasAccident: z.boolean(),
    severity: z.enum(['minor', 'moderate', 'severe']).optional(),
    repaired: z.boolean().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

interface PremiumManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

/**
 * Premium version of the ManualEntryForm component with enhanced features
 */
export const PremiumManualEntryForm: React.FC<PremiumManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Premium Valuation",
  initialData,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(premiumManualEntrySchema),
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      mileage: initialData?.mileage || 0,
      condition: initialData?.condition || ConditionLevel.Good,
      zipCode: initialData?.zipCode || '',
      fuelType: initialData?.fuelType || 'Gasoline',
      transmission: initialData?.transmission || 'Automatic',
      trim: initialData?.trim || '',
      color: initialData?.color || '',
      bodyStyle: initialData?.bodyStyle || '',
      vin: initialData?.vin || '',
      selectedFeatures: initialData?.selectedFeatures || [],
      accidentDetails: initialData?.accidentDetails || {
        hasAccident: false,
        severity: undefined,
        repaired: false,
        date: '',
        description: '',
      },
    },
  });

  const handleSubmit = (data: ManualEntryFormData) => {
    console.log('Premium manual entry form submitted:', data);
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
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Premium
          </span>
          Vehicle Information
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
              
              {onCancel && step === 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className={step === 1 && !onCancel ? 'ml-auto' : ''}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

export default PremiumManualEntryForm;
