import React from "react";
import ManualEntryFormFree from "@/components/lookup/manual/ManualEntryFormFree"; // or adjust path if needed
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { ConditionLevel, ManualEntryFormData } from "@/types/manualEntry";

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
  submitButtonText = "Get Valuation",
  isPremium = false,
  initialData,
  onCancel,
}: ManualLookupProps) {
  const handleSubmit = async (formData: ManualEntryFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("manual_entry_valuations")
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
            selected_features: formData.selectedFeatures || [],
          });

        if (error) {
          console.error("Error saving to Supabase:", error);
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
        toast({
          title: "Not Logged In",
          description: "Your data is not being saved. Sign in to save your entries.",
          variant: "default",
        });
      }

      onSubmit(formData);
    } catch (error: any) {
      console.error("Error in ManualLookup:", error);
      toast({
        title: "Error",
        description: error.message || "Could not process your request",
        variant: "destructive",
      });
      onSubmit(formData); // Proceed with valuation even on Supabase error
    }
  };

  return (
    <ManualEntryFormFree
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={submitButtonText}
      isPremium={isPremium}
      initialData={initialData}
      onCancel={onCancel}
    />
  );
}

export default ManualLookup;
