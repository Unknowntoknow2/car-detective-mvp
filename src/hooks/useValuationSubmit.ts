<<<<<<< HEAD
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/vehicle';
import { FormData } from '@/types/premium-valuation';
import { ReportData } from '@/utils/pdf/types';
import { submitValuation } from '@/lib/valuation/submitValuation';
import { toast } from 'sonner';
=======
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/premium-valuation";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function useValuationSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
  
  const submitVehicleData = async (formData: FormData) => {
=======
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (
    formData: FormData,
    user: UserData,
    isFormValid: boolean,
  ) => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      setSubmitError("Please complete all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit a valuation");
      setSubmitError("You must be logged in to submit a valuation");
      return;
    }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsSubmitting(true);
    setError(null);
    
    try {
<<<<<<< HEAD
      // Determine which identifier to use (VIN, plate, or other)
      const identifierType = formData.identifierType || 'vin';
      const identifier = formData.identifier || formData.vin || '';
      
      // Basic validation
      if (!identifier) {
        throw new Error('Vehicle identifier is required.');
      }
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Build report data from form data
      const reportData: ReportData = {
        make: formData.make || 'Generic Make',
        model: formData.model || 'Generic Model',
        year: formData.year || 2020,
        mileage: formData.mileage,
        condition: formData.condition.toString(),
        estimatedValue: 20000, // This would come from your pricing engine
        confidenceScore: 80,
        zipCode: formData.zipCode,
        adjustments: [],
        generatedAt: new Date().toISOString(),
        vin: formData.vin,
        aiCondition: {
          condition: formData.condition.toString(),
          confidenceScore: 80,
          issuesDetected: [],
          summary: 'Vehicle condition based on form input.'
        }
      };

      // Submit valuation with dealer notifications
      const result = await submitValuation({
        vin: formData.vin,
        zipCode: formData.zipCode,
        reportData,
        isPremium: true,
        notifyDealers: true
      });
      
      toast.success('Vehicle data submitted successfully!');
      
      if (result.notificationsSent) {
        toast.info('Dealers in your area have been notified');
      }
      
      return {
        success: true,
        data: {
          success: true,
          make: reportData.make,
          model: reportData.model,
          year: reportData.year,
          mileage: reportData.mileage,
          condition: reportData.condition,
          estimatedValue: reportData.estimatedValue,
          confidenceScore: reportData.confidenceScore,
          valuationId: `val-${Date.now()}`,
          zipCode: formData.zipCode,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          bodyType: formData.bodyStyle,
          color: formData.color,
          trim: formData.trim,
          vin: formData.vin,
          isPremium: true,
          price_range: {
            low: 18000,
            high: 22000
          },
          adjustments: [],
          aiCondition: {
            condition: formData.condition.toString(),
            confidenceScore: 80,
            issuesDetected: []
          },
          userId: ''
        } as ValuationResponse
      };
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit vehicle data';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
=======
      // Create a valuation record in the database
      const { data, error } = await supabase
        .from("valuations")
        .insert({
          user_id: user.id,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          fuel_type: formData.fuelType,
          condition: formData.conditionLabel,
          accident_history: formData.hasAccident === "yes",
          accident_details: formData.accidentDescription,
          zip_code: formData.zipCode,
          features: formData.features,
          driving_profile: formData.drivingProfile,
          identifier_type: formData.identifierType,
          identifier: formData.identifier,
          status: "completed",
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      // Set the valuation ID from the response
      setValuationId(data.id);

      // Show success message
      toast.success("Valuation completed successfully!");

      // Navigate to the results page
      navigate(`/results/${data.id}`);

      return data.id;
    } catch (error: any) {
      console.error("Error submitting valuation:", error);
      toast.error(error.message || "Failed to submit valuation");
      setSubmitError(error.message || "Failed to submit valuation");
      return null;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
<<<<<<< HEAD
    error,
    submitVehicleData
=======
    submitError,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
