
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { fetchVehicleByVin, fetchVehicleByPlate } from '@/services/vehicleLookupService';
import { getCarPricePrediction } from '@/services/carPricePredictionService';
import { DecodedVehicleInfo } from '@/types/vehicle';

const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

export function useValuation() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<any>(null);

  // Save valuation data to database
  const saveValuation = async (valuationData: any) => {
    try {
      console.log('Saving valuation:', valuationData);
      
      const userId = user?.id ?? ANONYMOUS_USER_ID;
      
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          user_id: userId,
          vin: valuationData.vin || null,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'good',
          zip_code: valuationData.zipCode || null,
          estimated_value: valuationData.estimatedValue || 0,
          confidence_score: valuationData.confidenceScore || 0,
          fuel_type: valuationData.fuelType || null,
          transmission: valuationData.transmission || null,
          body_type: valuationData.bodyType || null,
          color: valuationData.color || null,
          trim: valuationData.trim || null,
          base_price: valuationData.basePrice || valuationData.estimatedValue || 0,
          adjustments: valuationData.adjustments ? JSON.stringify(valuationData.adjustments) : null,
          price_range: valuationData.priceRange ? JSON.stringify(valuationData.priceRange) : null,
          is_vin_lookup: Boolean(valuationData.vin),
          is_premium: Boolean(valuationData.isPremium),
          explanation: valuationData.explanation || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving valuation:', error);
        throw error;
      }

      console.log('Valuation saved successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in saveValuation:', error);
      throw new Error(error.message || 'Failed to save valuation');
    }
  };

  // Get valuation by ID
  const getValuation = async (valuationId: string) => {
    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error getting valuation:', error);
      throw new Error(error.message || 'Failed to get valuation');
    }
  };

  // Save manual valuation with price prediction
  const saveManualValuation = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = user?.id ?? ANONYMOUS_USER_ID;

      // Get price prediction
      const prediction = await getCarPricePrediction({
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition,
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        bodyType: formData.bodyType
      });

      const valuationData = {
        user_id: userId,
        make: prediction.make,
        model: prediction.model,
        year: prediction.year,
        mileage: prediction.mileage,
        condition: prediction.condition,
        zip_code: formData.zipCode,
        estimated_value: prediction.estimatedValue,
        confidence_score: prediction.confidenceScore,
        fuel_type: prediction.fuelType,
        transmission: prediction.transmission,
        body_type: prediction.bodyType,
        color: prediction.color,
        trim: formData.trim,
        base_price: prediction.estimatedValue,
        is_vin_lookup: false,
        is_premium: false
      };

      const result = await saveValuation(valuationData);
      setValuationData(result);
      return result;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's valuations
  const getUserValuations = async () => {
    try {
      const userId = user?.id ?? ANONYMOUS_USER_ID;
      
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error('Error getting user valuations:', error);
      throw new Error(error.message || 'Failed to get valuations');
    }
  };

  // Decode VIN
  const decodeVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchVehicleByVin(vin);
      setValuationData(result);
      return result;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Decode license plate
  const decodePlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchVehicleByPlate(plate, state);
      setValuationData(result);
      return result;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Manual valuation
  const manualValuation = async (formData: any): Promise<DecodedVehicleInfo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await saveManualValuation(formData);
      return result;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset valuation state
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
