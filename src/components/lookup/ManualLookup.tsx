<<<<<<< HEAD

import React, { useState } from 'react';
import { ManualEntryFormFree } from './ManualEntryFormFree';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { ConditionLevel, ManualEntryFormData } from './types/manualEntry';
=======
import React from "react";
import ManualEntryForm from "@/components/lookup/manual/ManualEntryForm";
import { Card, CardContent } from "@/components/ui/card";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface ManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

export function ManualLookup({ 
  onSubmit, 
  isLoading = false,
<<<<<<< HEAD
  submitButtonText,
  isPremium,
  initialData,
  onCancel
=======
  submitButtonText = "Get Valuation",
  isPremium = false,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}: ManualLookupProps) {
  
  const handleSubmit = async (formData: ManualEntryFormData) => {
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
            trim: formData.trim || null,
            vin: formData.vin || null,
            accident: formData.accidentDetails?.hasAccident || false,
            accident_severity: formData.accidentDetails?.severity || null,
            selected_features: formData.selectedFeatures || []
          });
          
        if (error) {
          console.error('Error saving to Supabase:', error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Data saved successfully",
            variant: "success",
          });
        }
      } else {
        // If no user, just show a toast with default variant
        toast({
          title: "Not Logged In",
          description: "Your data is not being saved. Sign in to save your entries.",
          variant: "default",
        });
      }
      
      // Proceed with the regular onSubmit handler
      onSubmit(formData);
      
    } catch (error: any) {
      console.error('Error in ManualLookup:', error);
      toast({
        title: "Error",
        description: error.message || "Could not process your request",
        variant: "destructive",
      });
      // Still submit the data for valuation even if there's an error saving to Supabase
      onSubmit(formData);
    }
  };

  return (
    <ManualEntryFormFree
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      isPremium={isPremium}
    />
  );
}
<<<<<<< HEAD

export default ManualLookup;
=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
