
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { validateVin } from '@/utils/validation/vin-validation';
import { AlertCircle } from 'lucide-react';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';

// Import our new component parts
import { VehicleBasicInfoFields } from './components/VehicleBasicInfoFields';
import { VehicleDetailsFields } from './components/VehicleDetailsFields';
import { ConditionAndZipFields } from './components/ConditionAndZipFields';
import { VinInputField } from './components/VinInputField';

// Extend the form schema to include VIN
const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit year"),
  mileage: z.string().regex(/^\d+$/, "Enter a valid mileage"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
  vin: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: '',
      zipCode: '',
      vin: '',
      fuelType: '',
      transmission: '',
      trim: '',
      color: ''
    }
  });
  
  const handleSubmit = (values: FormValues) => {
    // Only check VIN validation if a value is provided
    if (values.vin && values.vin.trim() !== '') {
      const validation = validateVin(values.vin);
      if (!validation.isValid) {
        // We don't need to set error state here as it's handled in the VinInputField component
        return;
      }
    }
    
    // Convert string values to appropriate types for ManualEntryFormData
    const formattedData: ManualEntryFormData = {
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      mileage: parseInt(values.mileage),
      condition: (values.condition as ConditionLevel) || ConditionLevel.Good,
      zipCode: values.zipCode,
      fuelType: values.fuelType,
      transmission: values.transmission,
      trim: values.trim,
      color: values.color,
      vin: values.vin
    };
    
    onSubmit(formattedData);
  };

  const conditionOptions = [
    { value: ConditionLevel.Excellent, label: 'Excellent' },
    { value: ConditionLevel.Good, label: 'Good' },
    { value: ConditionLevel.Fair, label: 'Fair' },
    { value: ConditionLevel.Poor, label: 'Poor' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <VehicleBasicInfoFields form={form} />
          <VehicleDetailsFields form={form} />
          <ConditionAndZipFields 
            form={form} 
            conditionOptions={conditionOptions} 
          />
        </div>
        
        {/* VIN field with validation */}
        <VinInputField form={form} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default ManualEntryForm;
