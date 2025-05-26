
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fetchVehicleByPlate, fetchVehicleByVin } from '@/services/vehicleLookupService';
import { DecodedVehicleInfo } from '@/types/vehicle';

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

  const saveValuation = async (valuationData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
    valuationData,
    saveValuation,
    getValuation,
    saveManualValuation,
    getUserValuations,
    decodeVin,
    decodePlate,
    manualValuation,
    resetValuation
  };
}
