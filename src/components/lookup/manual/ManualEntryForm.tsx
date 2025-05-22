
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import our component parts
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
  color: z.string().optional(),
  bodyType: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading: propIsLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
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
      color: '',
      bodyType: ''
    }
  });
  
  const handleSubmit = async (values: FormValues) => {
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
      bodyType: values.bodyType,
      vin: values.vin
    };
    
    if (onSubmit) {
      onSubmit(formattedData);
      return;
    }
    
    // Handle submission ourselves
    setIsSubmitting(true);
    
    try {
      // Calculate estimated value based on basic formula (real implementation would be more complex)
      const basePrice = 15000;
      const yearFactor = 1 + ((formattedData.year - 2010) * 0.05);
      const mileageFactor = 1 - ((formattedData.mileage / 100000) * 0.2);
      
      let conditionFactor = 1;
      switch (formattedData.condition) {
        case ConditionLevel.Excellent:
          conditionFactor = 1.2;
          break;
        case ConditionLevel.VeryGood:
          conditionFactor = 1.1;
          break;
        case ConditionLevel.Good:
          conditionFactor = 1.0;
          break;
        case ConditionLevel.Fair:
          conditionFactor = 0.85;
          break;
        case ConditionLevel.Poor:
          conditionFactor = 0.7;
          break;
      }
      
      const estimatedValue = Math.floor(basePrice * yearFactor * mileageFactor * conditionFactor);
      
      // Create valuation in database
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          make: formattedData.make,
          model: formattedData.model,
          year: formattedData.year,
          mileage: formattedData.mileage,
          condition: formattedData.condition,
          vin: formattedData.vin,
          fuel_type: formattedData.fuelType,
          transmission: formattedData.transmission,
          color: formattedData.color,
          is_vin_lookup: false,
          estimated_value: estimatedValue,
          confidence_score: 80,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          zip_code: formattedData.zipCode
        })
        .select()
        .single();
      
      if (valuationError) {
        throw new Error(valuationError.message);
      }
      
      // Navigate to result page
      navigate(`/valuation/${valuationData.id}`);
    } catch (error) {
      console.error('Error creating valuation:', error);
      toast.error('Failed to create valuation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: ConditionLevel.Excellent, label: 'Excellent' },
    { value: ConditionLevel.VeryGood, label: 'Very Good' },
    { value: ConditionLevel.Good, label: 'Good' },
    { value: ConditionLevel.Fair, label: 'Fair' },
    { value: ConditionLevel.Poor, label: 'Poor' }
  ];

  const isLoading = propIsLoading || isSubmitting;

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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ManualEntryForm;
