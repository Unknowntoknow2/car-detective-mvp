<<<<<<< HEAD

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fetchVehicleByPlate, fetchVehicleByVin } from '@/services/vehicleLookupService';
import { DecodedVehicleInfo } from '@/types/vehicle';
=======
import { useState } from "react";
import { ValuationInput } from "@/utils/valuation/types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

// Define the response type for plate lookup
interface PlateDecodingResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export function useValuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<any>(null);
  const { user } = useAuth();

<<<<<<< HEAD
  const saveValuation = async (valuationData: any) => {
=======
  const submitValuation = async (
    formData: ValuationInput,
  ): Promise<{ success: boolean; data?: any; errorMessage?: string }> => {
    setIsLoading(true);
    try {
      // Validate form data
      if (!formData.zipCode) {
        throw new Error("Please enter a valid ZIP code");
      }

      // Simulate API response - in a real app, this would be an API call
      const response = {
        success: true,
        valuationId: "123456",
        confidenceScore: 85,
        error: null,
      };

      if (!response.success) {
        throw new Error(response.error || "Failed to submit valuation");
      }

      // Simulate successful valuation
      setValuationResult({
        valuationId: response.valuationId,
        confidenceScore: response.confidenceScore,
      });

      return { success: true, data: response };
    } catch (error: any) {
      console.error("Valuation error:", error);
      setError(
        error.message || "An error occurred while processing your valuation",
      );
      return {
        success: false,
        errorMessage: error.message ||
          "An error occurred while processing your valuation",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Add generateValuation function that works the same as submitValuation
  const generateValuation = async (formData: ValuationInput): Promise<{
    success: boolean;
    valuationId?: string;
    confidenceScore?: number;
    error?: string;
  }> => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          ...valuationData,
          user_id: user?.id ?? ANONYMOUS_USER_ID
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
=======
      // Validate form data
      if (!formData.zipCode) {
        throw new Error("Please enter a valid ZIP code");
      }

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = {
        success: true,
        valuationId: `val-${Date.now()}`,
        confidenceScore: 85,
      };

      return result;
    } catch (error: any) {
      console.error("Valuation generation error:", error);
      setError(error.message || "Failed to generate valuation");
      return {
        success: false,
        error: error.message || "Failed to generate valuation",
      };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsLoading(false);
    }
  };

  const getValuation = async (valuationId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveManualValuation = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const valuationData = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        estimated_value: formData.estimatedValue,
        confidence_score: formData.confidenceScore || 85,
        user_id: user?.id ?? ANONYMOUS_USER_ID,
        state: formData.zipCode?.substring(0, 2) || null,
        base_price: formData.basePrice || formData.estimatedValue,
        is_manual_entry: true
      };

      const { data, error } = await supabase
        .from('valuations')
        .insert(valuationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserValuations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', user?.id ?? ANONYMOUS_USER_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const decodeVin = async (vin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchVehicleByVin(vin);
      setValuationData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const decodePlate = async (plate: string, state: string): Promise<PlateDecodingResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchVehicleByPlate(plate, state);
      setValuationData(result);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const manualValuation = async (formData: any) => {
    return await saveManualValuation(formData);
  };

  const resetValuation = () => {
    setValuationData(null);
    setError(null);
  };

  return {
    isLoading,
    error,
<<<<<<< HEAD
    valuationData,
    saveValuation,
    getValuation,
    saveManualValuation,
    getUserValuations,
    decodeVin,
    decodePlate,
    manualValuation,
    resetValuation
=======
    submitValuation,
    generateValuation,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
