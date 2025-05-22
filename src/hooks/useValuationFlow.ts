
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ValuationResult } from '@/types/valuation';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface ValuationFlowState {
  isLoading: boolean;
  error: string | null;
  valuationData: ValuationResult | null;
  decodedVehicle: DecodedVehicleInfo | null;
  valuationId: string | null;
}

export function useValuationFlow() {
  const [state, setState] = useState<ValuationFlowState>({
    isLoading: false,
    error: null,
    valuationData: null,
    decodedVehicle: null,
    valuationId: null
  });
  const { user } = useAuth();

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      valuationData: null,
      decodedVehicle: null,
      valuationId: null
    });
  }, []);

  // VIN Lookup
  const lookupByVin = useCallback(async (vin: string) => {
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call the unified-decode function
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from decoder');
      }

      // Process successful response
      const decodedVehicle = data as DecodedVehicleInfo;
      setState(prev => ({ ...prev, decodedVehicle }));
      
      // Now get valuation based on the decoded vehicle data
      const valuationResult = await getValuation({
        vin,
        make: decodedVehicle.make,
        model: decodedVehicle.model,
        year: decodedVehicle.year,
        bodyType: decodedVehicle.bodyType,
        transmission: decodedVehicle.transmission,
        fuelType: decodedVehicle.fuelType
      });

      return valuationResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to decode VIN';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, []);

  // Plate Lookup
  const lookupByPlate = useCallback(async (plate: string, state: string) => {
    if (!plate) {
      toast.error('Please enter a license plate');
      return null;
    }

    if (!state) {
      toast.error('Please select a state');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call the unified-decode function with plate parameters
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { plate, state }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from plate decoder');
      }

      // Process successful response
      const decodedVehicle = data as DecodedVehicleInfo;
      setState(prev => ({ ...prev, decodedVehicle }));
      
      // Now get valuation based on the decoded vehicle data
      const valuationResult = await getValuation({
        plate,
        state,
        make: decodedVehicle.make,
        model: decodedVehicle.model,
        year: decodedVehicle.year,
        bodyType: decodedVehicle.bodyType,
        transmission: decodedVehicle.transmission,
        fuelType: decodedVehicle.fuelType
      });

      return valuationResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to decode license plate';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, []);

  // Manual Entry
  const submitManualEntry = useCallback(async (data: ManualEntryFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get valuation for manually entered data
      const valuationResult = await getValuation({
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode,
        fuelType: data.fuelType,
        transmission: data.transmission,
        bodyStyle: data.bodyStyle,
        vin: data.vin
      });

      return valuationResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process manual entry';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, []);

  // Common valuation processing
  const getValuation = useCallback(async (vehicleData: any) => {
    try {
      // Call the valuation API
      const { data: valuationData, error: valuationError } = await supabase.functions.invoke('car-price-prediction', {
        body: vehicleData
      });

      if (valuationError) {
        throw new Error(valuationError.message);
      }

      if (!valuationData) {
        throw new Error('No valuation data returned');
      }

      // Save to database if user is logged in
      if (user) {
        await saveValuationToDatabase({
          ...vehicleData,
          ...valuationData,
          user_id: user.id
        });
      }

      // Update state with valuation results
      setState(prev => ({
        ...prev,
        valuationData,
        valuationId: valuationData.id || null,
        isLoading: false,
        error: null
      }));

      toast.success('Valuation completed successfully!');
      return valuationData;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get valuation';
      toast.error(errorMessage);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, [user]);

  // Save valuation to database
  const saveValuationToDatabase = useCallback(async (data: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('valuations').insert({
        user_id: user.id,
        vin: data.vin || null,
        plate: data.plate || null,
        state: data.state || data.zipCode,
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        estimated_value: data.estimatedValue || data.estimated_value,
        confidence_score: data.confidenceScore || data.confidence_score,
        condition_score: data.conditionScore,
        body_type: data.bodyType,
        fuel_type: data.fuelType,
        transmission: data.transmission
      });

      if (error) {
        console.error('Error saving valuation:', error);
      }
    } catch (err) {
      console.error('Failed to save valuation:', err);
    }
  }, [user]);

  return {
    ...state,
    lookupByVin,
    lookupByPlate,
    submitManualEntry,
    resetState
  };
}
