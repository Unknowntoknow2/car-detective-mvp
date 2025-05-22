
import { useState } from 'react';
import { ValuationResponse, VinDecoderResponse, PlateLookupResponse } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useValuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetValuation = () => {
    setValuationData(null);
    setError(null);
    setValuationId(null);
  };

  const saveValuationToDatabase = async (valuation: any) => {
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for saving
      const valuationRecord = {
        user_id: user?.id || null,
        make: valuation.make,
        model: valuation.model,
        year: valuation.year,
        mileage: valuation.mileage || 0,
        condition: valuation.condition || 'Good',
        vin: valuation.vin,
        plate: valuation.plate,
        estimated_value: valuation.estimatedValue || valuation.estimated_value,
        confidence_score: valuation.confidenceScore || valuation.confidence_score || 75,
        state: valuation.zipCode || valuation.state,
        fuel_type: valuation.fuelType,
        transmission: valuation.transmission,
        body_type: valuation.bodyType,
        is_vin_lookup: !!valuation.vin
      };

      // Save to valuations table
      const { data, error } = await supabase
        .from('valuations')
        .insert(valuationRecord)
        .select('id')
        .single();

      if (error) throw error;
      
      return data.id;
    } catch (err) {
      console.error('Error saving valuation:', err);
      throw err;
    }
  };

  const decodeVin = async (vin: string): Promise<VinDecoderResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the unified-decode edge function
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin }
      });
      
      if (error) throw new Error(error.message || 'Failed to decode VIN');
      
      if (!data) {
        throw new Error('No data returned from VIN decoder');
      }
      
      // Generate a valuation from the vehicle data
      const valuation = {
        ...data,
        estimatedValue: Math.round(15000 + Math.random() * 10000), // Placeholder
        confidenceScore: Math.round(70 + Math.random() * 20), // Placeholder
        condition: 'Good',
        vin
      };
      
      setValuationData(valuation);
      
      // Save to database and get ID
      const id = await saveValuationToDatabase(valuation);
      setValuationId(id);
      
      // Navigate to the result page
      navigate(`/valuation/${id}`);
      
      return { success: true, data: valuation };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode VIN';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const decodePlate = async (plate: string, state: string): Promise<PlateLookupResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the unified-decode edge function with plate data
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { plate, state }
      });
      
      if (error) throw new Error(error.message || 'Failed to decode license plate');
      
      if (!data) {
        throw new Error('No data returned from plate lookup');
      }
      
      // Generate a valuation from the vehicle data
      const valuation = {
        ...data,
        estimatedValue: Math.round(12000 + Math.random() * 15000), // Placeholder
        confidenceScore: Math.round(65 + Math.random() * 20), // Placeholder
        condition: 'Good',
        plate,
        state
      };
      
      setValuationData(valuation);
      
      // Save to database and get ID
      const id = await saveValuationToDatabase(valuation);
      setValuationId(id);
      
      // Navigate to the result page
      navigate(`/valuation/${id}`);
      
      return { success: true, data: valuation };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode license plate';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const manualValuation = async (formData: ManualEntryFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a valuation based on manual entry data
      const valuation = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition,
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyType,
        trim: formData.trim,
        color: formData.color,
        vin: formData.vin,
        estimatedValue: Math.round(10000 + Math.random() * 20000), // Placeholder
        confidenceScore: Math.round(60 + Math.random() * 25), // Placeholder
      };
      
      setValuationData(valuation);
      
      // Save to database and get ID
      const id = await saveValuationToDatabase(valuation);
      setValuationId(id);
      
      // Navigate to the result page
      navigate(`/valuation/${id}`);
      
      return { success: true, data: valuation };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get valuation';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    isLoading, 
    valuationData, 
    error, 
    valuationId,
    decodeVin, 
    decodePlate, 
    manualValuation, 
    resetValuation 
  };
}
