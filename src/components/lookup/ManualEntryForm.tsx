import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ManualEntryFormData } from './types/manualEntry';
import { VehicleBasicInfo } from './form-parts/VehicleBasicInfo';
import { VehicleConditionSlider } from './form-parts/VehicleConditionSlider';
import { VehicleFeatureSelect } from './form-parts/VehicleFeatureSelect';
import { PremiumFields } from './form-parts/PremiumFields';
import { ValuationFormActions } from './form-parts/ValuationFormActions';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useManualValuation } from '@/hooks/useManualValuation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

const formSchema = z.object({
  make: z.string().min(1, { message: "Make selection is required" }),
  model: z.string().min(1, { message: "Model selection is required" }),
  year: z.number()
    .min(1900, { message: "Enter a valid year" })
    .max(new Date().getFullYear() + 1, { message: "Year cannot be in far future" }),
  mileage: z.number()
    .min(1, { message: "Mileage must be greater than 0" })
    .max(1000000, { message: "Mileage seems unrealistic" }),
  fuelType: z.string().optional(),
  condition: z.string().default("good"),
  zipCode: z.string()
    .regex(/^\d{5}$/, { message: "Enter a valid 5-digit ZIP code" })
    .optional(),
  accident: z.enum(["yes", "no"]).optional(),
  accidentDetails: z.object({
    count: z.string().optional(),
    severity: z.string().optional(),
    area: z.string().optional()
  }).optional(),
  selectedFeatures: z.array(z.string()).default([])
});

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading: externalLoading,
  submitButtonText = 'Get Vehicle Valuation',
  isPremium = false
}) => {
  const navigate = useNavigate();
  // Fixed - don't pass argument to useVehicleData
  const { isLoading: isDataLoading } = useVehicleData();
  const { calculateValuation, isLoading: isValuationLoading } = useManualValuation();
  const [conditionValue, setConditionValue] = useState(75);

  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: undefined,
      fuelType: '',
      condition: 'good',
      zipCode: '',
      accident: 'no',
      accidentDetails: {
        count: '',
        severity: '',
        area: ''
      },
      selectedFeatures: []
    }
  });

  useEffect(() => {
    const conditionValue = getConditionValue(form.watch('condition'));
    setConditionValue(conditionValue);
  }, [form.watch('condition')]);

  useEffect(() => {
    const conditionLabel = getConditionLabel(conditionValue);
    form.setValue('condition', conditionLabel);
  }, [conditionValue, form]);

  const getConditionValue = (condition: string): number => {
    switch (condition) {
      case 'poor': return 25;
      case 'fair': return 50;
      case 'good': return 75;
      case 'excellent': return 100;
      default: return 75;
    }
  };

  const getConditionLabel = (value: number): string => {
    if (value <= 25) return 'poor';
    if (value <= 50) return 'fair';
    if (value <= 75) return 'good';
    return 'excellent';
  };

  const handleAccidentChange = (value: string) => {
    if (value === 'no' || value === 'yes') {
      form.setValue('accident', value as 'yes' | 'no');
    }
  };

  const onSubmitForm = async (data: ManualEntryFormData) => {
    console.log("Form submitted with data:", data);
    try {
      if (onSubmit) {
        await onSubmit(data);
        return;
      }

      const result = await calculateValuation({
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage || 0,
        condition: data.condition,
        fuelType: data.fuelType || 'Gasoline'
      });

      if (result) {
        toast.success("Valuation completed successfully");
        navigate(`/valuation`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to complete valuation. Please try again.");
    }
  };

  const isFormLoading = externalLoading || isDataLoading || isValuationLoading || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        <VehicleBasicInfo form={form} isDisabled={isFormLoading} />
        
        <VehicleConditionSlider
          value={conditionValue}
          onChange={setConditionValue}
          disabled={isFormLoading}
        />

        <VehicleFeatureSelect
          selectedFeatures={form.watch('selectedFeatures')}
          onFeaturesChange={(features) => form.setValue('selectedFeatures', features)}
          disabled={isFormLoading}
        />

        {isPremium && (
          <PremiumFields
            accident={form.watch('accident') || 'no'}
            setAccident={handleAccidentChange}
            accidentDetails={form.watch('accidentDetails') || { count: '', severity: '', area: '' }}
            setAccidentDetails={(details) => form.setValue('accidentDetails', details)}
            isDisabled={isFormLoading}
          />
        )}

        <ValuationFormActions
          isLoading={isFormLoading}
          submitButtonText={isFormLoading ? 'Processing...' : submitButtonText}
          onSubmit={form.handleSubmit(onSubmitForm)}
        />

        {/* Validation error handling */}
        {form.formState.errors.make && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {form.formState.errors.make.message}
          </p>
        )}

        {form.formState.errors.model && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {form.formState.errors.model.message}
          </p>
        )}

        {form.formState.errors.year && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {form.formState.errors.year.message}
          </p>
        )}

        {form.formState.errors.mileage && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {form.formState.errors.mileage.message}
          </p>
        )}

        {form.formState.errors.zipCode && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {form.formState.errors.zipCode.message}
          </p>
        )}
      </form>
    </Form>
  );
};
