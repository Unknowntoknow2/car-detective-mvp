
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { validateVin } from '@/utils/validation/vin-validation';
import { AlertCircle } from 'lucide-react';

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
  vin: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ManualEntryFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean; // Added isLoading prop
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
      vin: ''
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
    
    onSubmit(values);
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
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
