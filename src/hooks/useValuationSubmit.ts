
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/premium-valuation';
import { calculateFeatureValue } from '@/utils/feature-calculations';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export const useValuationSubmit = () => {
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData, user: User | null, isFormValid: boolean) => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (!user) {
        toast.error("Please sign in to save your valuation");
        setSubmitError("Authentication required");
        return;
      }

      const featureValueTotal = calculateFeatureValue(formData.features);
      const accidentCount = formData.hasAccident ? 1 : 0;
      const zipDemandFactor = 1.0; // This could be calculated based on ZIP code analysis
      const basePrice = formData.year * 100 + 5000; // Simple base calculation, adjust as needed
      const dealerAvgPrice = basePrice * 1.15;
      const auctionAvgPrice = basePrice * 0.9;
      
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage || 0,
          condition_score: formData.condition,
          accident_count: accidentCount,
          zip_demand_factor: zipDemandFactor,
          dealer_avg_price: dealerAvgPrice,
          auction_avg_price: auctionAvgPrice,
          feature_value_total: featureValueTotal,
          base_price: basePrice,
          state: formData.zipCode ? formData.zipCode.substring(0, 2) : null,
          is_vin_lookup: formData.identifierType === 'vin',
          vin: formData.identifierType === 'vin' ? formData.identifier : null,
          plate: formData.identifierType === 'plate' ? formData.identifier : null,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setValuationId(data.id);
      toast.success("Your premium valuation has been generated successfully.");
      
      console.log("Valuation saved with ID:", data.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save valuation';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      console.error("Valuation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    valuationId,
    isSubmitting,
    submitError,
    handleSubmit
  };
};
