
import React from 'react';
import { ManualEntryForm, ManualEntryFormProps } from './ManualEntryForm';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface ManualLookupProps extends Omit<ManualEntryFormProps, 'onSubmit'> {
  onSubmit: (data: any) => void;
}

export function ManualLookup({ 
  onSubmit, 
  isLoading = false,
  submitButtonText,
  isPremium
}: ManualLookupProps) {
  
  const handleSubmit = async (formData: any) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // If user is logged in, save the data to Supabase
        const { error } = await supabase
          .from('manual_entry_valuations')
          .insert({
            make: formData.make,
            model: formData.model,
            year: formData.year,
            mileage: formData.mileage,
            condition: formData.condition,
            zip_code: formData.zipCode,
            user_id: user.id,
            fuel_type: formData.fuelType,
            transmission: formData.transmission,
            vin: formData.vin,
            accident: false
          });
          
        if (error) {
          console.error('Error saving to Supabase:', error);
          toast({
            title: "Error saving data",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Data saved successfully",
            variant: "success",
          });
        }
      } else {
        // If no user, just show a toast
        toast({
          title: "Not logged in",
          description: "Your data is not being saved. Sign in to save your entries.",
          variant: "warning",
        });
      }
      
      // Proceed with the regular onSubmit handler
      onSubmit(formData);
      
    } catch (error: any) {
      console.error('Error in ManualLookup:', error);
      toast({
        title: "Something went wrong",
        description: error.message || "Could not process your request",
        variant: "destructive",
      });
      onSubmit(formData); // Still submit the data for valuation
    }
  };

  return (
    <ManualEntryForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      isPremium={isPremium}
    />
  );
}

export default ManualLookup;
