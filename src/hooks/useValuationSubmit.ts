
import { useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useValuationSubmit = () => {
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData, user: User | null, isValid: boolean) => {
    if (!isValid) {
      toast.error("Please complete all required fields before submitting");
      return null;
    }

    if (!user) {
      toast.error("You must be logged in to submit a valuation");
      return null;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get color multiplier if color is selected
      let colorMultiplier = 1;
      if (formData.exteriorColor) {
        try {
          const { data: colorData } = await supabase.functions.invoke('get-color-multiplier', {
            body: { color: formData.exteriorColor }
          });
          
          if (colorData && colorData.multiplier) {
            colorMultiplier = colorData.multiplier;
          }
        } catch (error) {
          console.error('Error getting color multiplier:', error);
        }
      }
      
      // Get fuel type multiplier if fuel type is selected
      let fuelTypeMultiplier = 1;
      if (formData.fuelType) {
        try {
          const { data: fuelTypeData } = await supabase.functions.invoke('get-fuel-type-multiplier', {
            body: { fuelType: formData.fuelType }
          });
          
          if (fuelTypeData && fuelTypeData.multiplier) {
            fuelTypeMultiplier = fuelTypeData.multiplier;
          }
        } catch (error) {
          console.error('Error getting fuel type multiplier:', error);
        }
      }
      
      // Get transmission multiplier if transmission type is selected
      let transmissionMultiplier = 1;
      if (formData.transmissionType) {
        try {
          const { data: transmissionData } = await supabase.functions.invoke('get-transmission-multiplier', {
            body: { transmissionType: formData.transmissionType }
          });
          
          if (transmissionData && transmissionData.multiplier) {
            transmissionMultiplier = transmissionData.multiplier;
          }
        } catch (error) {
          console.error('Error getting transmission multiplier:', error);
        }
      }

      // Get warranty multiplier if warranty status is selected
      let warrantyMultiplier = 1;
      if (formData.warrantyStatus && formData.warrantyStatus !== 'None') {
        try {
          const { data: warrantyData } = await supabase
            .from('warranty_options')
            .select('multiplier')
            .eq('status', formData.warrantyStatus)
            .single();
            
          if (warrantyData && warrantyData.multiplier) {
            warrantyMultiplier = warrantyData.multiplier;
          }
        } catch (error) {
          console.error('Error getting warranty multiplier:', error);
        }
      }

      // Insert valuation record
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          user_id: user.id,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition_score: formData.condition,
          zip_demand_factor: 1.0, // Default value, will be calculated by the backend
          vin: formData.vin || null,
          state: formData.zipCode || null,
          estimated_value: 0, // Will be calculated by prediction endpoint
          exterior_color: formData.exteriorColor,
          color_multiplier: colorMultiplier,
          fuel_type: formData.fuelType,
          transmission_type: formData.transmissionType,
          has_open_recall: formData.hasOpenRecall || false,
          warranty_status: formData.warrantyStatus || 'None',
          sale_date: formData.saleDate || new Date(),
          body_style: formData.bodyStyle || 'sedan'
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to create valuation: ${error.message}`);
      }

      // Store the valuation ID
      const newValuationId = data.id;
      setValuationId(newValuationId);

      // Run prediction to calculate estimated value
      const { data: predictionData, error: predictionError } = await supabase.functions.invoke('predict', {
        body: { valuationId: newValuationId }
      });

      if (predictionError) {
        console.error('Prediction error:', predictionError);
        toast.warning("Valuation created but prediction failed. Please try again later.");
      } else {
        // Update the valuation with the predicted price
        const { error: updateError } = await supabase
          .from('valuations')
          .update({ 
            estimated_value: predictionData.predictedPrice 
          })
          .eq('id', newValuationId);
          
        if (updateError) {
          console.error('Failed to update valuation with predicted price:', updateError);
        }
      }

      // Return the valuation ID for redirect
      setIsSubmitting(false);
      toast.success("Valuation submitted successfully!");
      return newValuationId;
    } catch (error) {
      console.error('Valuation submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit valuation');
      setIsSubmitting(false);
      toast.error(`Valuation submission failed: ${setSubmitError}`);
      return null;
    }
  };

  return {
    valuationId,
    isSubmitting,
    submitError,
    handleSubmit
  };
};
