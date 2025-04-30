
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
          fuel_type: formData.fuelType
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
          .update({ estimated_value: predictionData.predictedPrice })
          .eq('id', newValuationId);

        if (updateError) {
          console.error('Error updating valuation with prediction:', updateError);
        }
      }

      // Store result in session for results page
      sessionStorage.setItem('last_valuation_id', newValuationId);
      sessionStorage.setItem('last_valuation_data', JSON.stringify({
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.conditionLabel,
        estimatedValue: predictionData?.predictedPrice || 0,
        fuelType: formData.fuelType
      }));

      toast.success("Valuation completed successfully!");
      return newValuationId;
    } catch (error: any) {
      console.error("Valuation submission error:", error);
      setSubmitError(error.message || "An error occurred during submission");
      toast.error(error.message || "Failed to submit valuation");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { valuationId, isSubmitting, submitError, handleSubmit };
};
