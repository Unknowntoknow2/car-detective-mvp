
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { VehicleDetailsInputs } from './form-parts/VehicleDetailsInputs';
import { VehicleBasicInfoInputs } from './form-parts/VehicleBasicInfoInputs';
import { ConditionInput } from './form-parts/ConditionInput';
import { ManualEntryFormData } from './types/manualEntry';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { CarDetectiveValidator } from '@/utils/validation/CarDetectiveValidator';

// Define validation schema based on our validator
const formSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().refine(val => {
    const yearNum = parseInt(val, 10);
    return !isNaN(yearNum) && yearNum >= 1980 && yearNum <= new Date().getFullYear();
  }, 'Valid year is required'),
  mileage: z.string().refine(val => {
    const mileageNum = parseInt(val, 10);
    return !isNaN(mileageNum) && mileageNum >= 0 && mileageNum <= 300000;
  }, 'Valid mileage is required'),
  condition: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits').optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional()
});

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export default function ManualEntryForm({ 
  onSubmit, 
  isLoading = false, 
  submitButtonText = "Get Valuation",
  isPremium = false
}: ManualEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResults, setValidationResults] = useState<{ valid: boolean, errors: Record<string, string> }>({ valid: false, errors: {} });
  const navigate = useNavigate();

  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: 'good',
      zipCode: '',
      fuelType: '',
      transmission: ''
    }
  });

  // Watch form values for live validation
  const formValues = form.watch();
  
  // Use our validator to validate the form
  useEffect(() => {
    const data = {
      make: formValues.make,
      model: formValues.model,
      year: formValues.year ? parseInt(formValues.year, 10) : undefined,
      mileage: formValues.mileage ? parseInt(formValues.mileage, 10) : undefined,
      condition: formValues.condition,
      zipCode: formValues.zipCode,
      fuelType: formValues.fuelType,
      transmission: formValues.transmission
    };
    
    const result = CarDetectiveValidator.isValidForm(data);
    setValidationResults(result);
  }, [formValues]);

  const handleFormSubmit = async (data: ManualEntryFormData) => {
    setIsSubmitting(true);
    
    try {
      // Additional validation using our validator
      const validationResult = CarDetectiveValidator.isValidForm({
        make: data.make,
        model: data.model,
        year: parseInt(data.year, 10),
        mileage: parseInt(data.mileage, 10),
        condition: data.condition,
        zipCode: data.zipCode,
        fuelType: data.fuelType,
        transmission: data.transmission
      });
      
      if (!validationResult.valid) {
        // Show error toast for the first validation error
        const firstError = Object.values(validationResult.errors)[0];
        toast.error(firstError || 'Validation failed');
        setIsSubmitting(false);
        return;
      }
      
      // Calculate a mock valuation based on year and mileage
      const baseValue = 30000 - (2023 - parseInt(data.year)) * 1000;
      const mileageDeduction = parseInt(data.mileage) > 50000 ? 
        (parseInt(data.mileage) - 50000) / 10000 * 500 : 0;
      
      const estimatedValue = Math.max(5000, baseValue - mileageDeduction);
      
      // Create a valuation record in the database
      const { data: valuationData, error } = await supabase
        .from('valuations')
        .insert({
          make: data.make,
          model: data.model,
          year: parseInt(data.year),
          mileage: parseInt(data.mileage),
          condition_score: data.condition === 'excellent' ? 90 : 
                          data.condition === 'good' ? 75 : 
                          data.condition === 'fair' ? 60 : 45,
          state: data.zipCode,
          estimated_value: Math.round(estimatedValue),
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user
          confidence_score: 75,
          is_vin_lookup: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving valuation:', error);
        toast.error('Failed to save valuation data');
        return;
      }
      
      // Store the valuation ID in localStorage
      if (valuationData) {
        localStorage.setItem('latest_valuation_id', valuationData.id);
        
        // Add valuation ID to the form data
        data.valuationId = valuationData.id;
        data.valuation = estimatedValue;
        data.confidenceScore = 75;
      }
      
      // Call the onSubmit callback with the form data
      onSubmit(data);
      
      // Navigate to the results page if we have a valuation ID and not in premium mode
      if (valuationData && !isPremium) {
        navigate(`/result?valuationId=${valuationData.id}`);
      }
      
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <VehicleBasicInfoInputs form={form} />
        <VehicleDetailsInputs form={form} />
        <ConditionInput form={form} />
        
        <Button 
          type="submit" 
          className="w-full h-12" 
          disabled={isSubmitting || isLoading || !validationResults.valid}
        >
          {isSubmitting || isLoading ? (
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
}
