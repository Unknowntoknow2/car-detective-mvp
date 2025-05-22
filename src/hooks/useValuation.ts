
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { 
  DecodedVehicleInfo, 
  ValuationResponse,
  VinDecoderResponse,
  PlateLookupResponse,
  ManualValuationResponse 
} from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export function useValuation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuationData, setValuationData] = useState<ValuationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Decode VIN using the unified-decode edge function
  const decodeVin = async (vin: string): Promise<VinDecoderResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin }
      });

      if (error) {
        console.error('Error decoding VIN:', error);
        setError(error.message);
        toast.error('Failed to decode VIN. Please try again.');
        return { success: false, error: error.message };
      }

      if (!data || !data.make) {
        const errorMsg = 'No data returned from VIN lookup';
        setError(errorMsg);
        toast.error('Could not find vehicle information for this VIN.');
        return { success: false, error: errorMsg };
      }

      // Get valuation for the decoded vehicle
      await getValuationFromDecoded(data, vin);
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Exception in decodeVin:', err);
      const errorMsg = err.message || 'An unknown error occurred';
      setError(errorMsg);
      toast.error('Error during VIN lookup. Please try again.');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Decode plate using the unified-decode edge function
  const decodePlate = async (plate: string, state: string): Promise<PlateLookupResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { plate, state }
      });

      if (error) {
        console.error('Error decoding plate:', error);
        setError(error.message);
        toast.error('Failed to decode license plate. Please try again.');
        return { success: false, error: error.message };
      }

      if (!data || !data.make) {
        const errorMsg = 'No data returned from plate lookup';
        setError(errorMsg);
        toast.error('Could not find vehicle information for this license plate.');
        return { success: false, error: errorMsg };
      }

      // Get valuation for the decoded vehicle
      await getValuationFromDecoded(data, data.vin);
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Exception in decodePlate:', err);
      const errorMsg = err.message || 'An unknown error occurred';
      setError(errorMsg);
      toast.error('Error during plate lookup. Please try again.');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Get valuation from manual entry
  const manualValuation = async (formData: ManualEntryFormData): Promise<ManualValuationResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the car-price-prediction edge function
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          condition: formData.condition,
          zipCode: formData.zipCode,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          color: formData.color,
          bodyType: formData.bodyType,
          vin: formData.vin
        }
      });

      if (error) {
        console.error('Error getting valuation:', error);
        setError(error.message);
        toast.error('Failed to get vehicle valuation. Please try again.');
        return { success: false, error: error.message };
      }

      if (!data || !data.estimatedValue) {
        const errorMsg = 'No valuation data returned';
        setError(errorMsg);
        toast.error('Could not calculate a valuation for this vehicle.');
        return { success: false, error: errorMsg };
      }

      // Set the valuation data
      setValuationData(data);
      toast.success('Vehicle valuation complete!');
      
      // Save valuation to database if user is logged in
      await saveValuationToDatabase(data);
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Exception in manualValuation:', err);
      const errorMsg = err.message || 'An unknown error occurred';
      setError(errorMsg);
      toast.error('Error during valuation. Please try again.');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get valuation after decoding
  const getValuationFromDecoded = async (decodedData: DecodedVehicleInfo, vin?: string): Promise<void> => {
    try {
      // Call the car-price-prediction edge function
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: decodedData.make,
          model: decodedData.model,
          year: decodedData.year,
          vin: vin || decodedData.vin,
          fuelType: decodedData.fuelType,
          transmission: decodedData.transmission,
          bodyType: decodedData.bodyType
        }
      });

      if (error) {
        console.error('Error getting valuation:', error);
        setError(error.message);
        toast.error('Failed to get vehicle valuation. Please try again.');
        return;
      }

      if (!data || !data.estimatedValue) {
        const errorMsg = 'No valuation data returned';
        setError(errorMsg);
        toast.error('Could not calculate a valuation for this vehicle.');
        return;
      }

      // Set the valuation data
      setValuationData(data);
      toast.success('Vehicle valuation complete!');
      
      // Save valuation to database if user is logged in
      await saveValuationToDatabase(data);
    } catch (err: any) {
      console.error('Exception in getValuationFromDecoded:', err);
      const errorMsg = err.message || 'An unknown error occurred';
      setError(errorMsg);
      toast.error('Error during valuation. Please try again.');
    }
  };

  // Save valuation to database
  const saveValuationToDatabase = async (valuationData: ValuationResponse): Promise<void> => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Only save to database if user is logged in
    if (user) {
      try {
        const { error } = await supabase.from('valuations').insert({
          user_id: user.id,
          vin: valuationData.vin,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage,
          condition: valuationData.condition,
          estimated_value: valuationData.estimatedValue,
          confidence_score: valuationData.confidenceScore,
          condition_score: valuationData.conditionScore || null,
          fuel_type: valuationData.fuelType,
          transmission: valuationData.transmission,
          body_type: valuationData.bodyType
        });

        if (error) {
          console.error('Error saving valuation:', error);
        }
      } catch (err) {
        console.error('Exception saving valuation:', err);
      }
    }
  };

  const resetValuation = () => {
    setValuationData(null);
    setError(null);
  };

  return {
    isLoading,
    valuationData,
    error,
    decodeVin,
    decodePlate,
    manualValuation,
    resetValuation
  };
}

export default useValuation;
