
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/premium-valuation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define minimal user data needed for the submission
type UserData = {
  id: string;
  email?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  [key: string]: any;
};

export const useValuationSubmit = () => {
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (
    formData: FormData, 
    user: UserData, 
    isFormValid: boolean
  ) => {
    if (!isFormValid) {
      toast.error('Please complete all required fields');
      setSubmitError('Please complete all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to submit a valuation');
      setSubmitError('You must be logged in to submit a valuation');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create a valuation record in the database
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          user_id: user.id,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          fuel_type: formData.fuelType,
          condition: formData.conditionLabel,
          accident_history: formData.hasAccident === 'yes',
          accident_details: formData.accidentDescription,
          zip_code: formData.zipCode,
          features: formData.features,
          driving_profile: formData.drivingProfile,
          identifier_type: formData.identifierType,
          identifier: formData.identifier,
          status: 'completed'
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Set the valuation ID from the response
      setValuationId(data.id);

      // Show success message
      toast.success('Valuation completed successfully!');
      
      // Navigate to the results page
      navigate(`/results/${data.id}`);
      
      return data.id;
    } catch (error: any) {
      console.error('Error submitting valuation:', error);
      toast.error(error.message || 'Failed to submit valuation');
      setSubmitError(error.message || 'Failed to submit valuation');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    valuationId,
    handleSubmit,
    isSubmitting,
    submitError
  };
};
