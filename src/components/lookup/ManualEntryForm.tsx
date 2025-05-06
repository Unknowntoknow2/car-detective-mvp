
import { useState } from 'react';
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

// Define validation schema
const formSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Valid year is required'),
  mileage: z.string().min(1, 'Mileage is required'),
  condition: z.string().optional(),
  zipCode: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional()
});

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
}

export default function ManualEntryForm({ onSubmit }: ManualEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleFormSubmit = async (data: ManualEntryFormData) => {
    setIsSubmitting(true);
    
    try {
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
      
      // Navigate to the results page if we have a valuation ID
      if (valuationData) {
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Get Valuation'}
        </Button>
      </form>
    </Form>
  );
}
