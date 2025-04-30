
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type IdentifierType = 'vin' | 'plate';
type Stage = 'initial' | 'lookup_in_progress' | 'lookup_failed' | 'vehicle_found' | 'details_required' | 'valuation_in_progress' | 'valuation_complete' | 'valuation_failed';

interface Vehicle {
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
}

interface RequiredInputs {
  mileage: number | null;
  fuelType: string | null;
  zipCode: string;
  condition?: number;
  conditionLabel?: string;
  hasAccident?: boolean;
  accidentDescription?: string;
}

interface ValuationResult {
  id: string;
  estimated_value: number;
  confidence_score: number;
  price_range?: [number, number];
  base_price?: number;
  zip_demand_factor?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export function useFullValuationPipeline() {
  const [stage, setStage] = useState<Stage>('initial');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [requiredInputs, setRequiredInputs] = useState<RequiredInputs | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset the pipeline
  const reset = () => {
    setStage('initial');
    setVehicle(null);
    setRequiredInputs(null);
    setValuationResult(null);
    setError(null);
  };

  // Step 1: Run lookup by VIN or plate
  const runLookup = async (type: IdentifierType, identifier: string) => {
    setStage('lookup_in_progress');
    setError(null);
    
    try {
      // Call the Supabase edge function to decode the VIN/plate
      const functionName = type === 'vin' ? 'decode-vin' : 'decode-plate';
      const requestBody = type === 'vin' ? { vin: identifier } : {
        plate: identifier.split(':')[1],
        state: identifier.split(':')[0]
      };
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });
      
      if (error) {
        throw new Error(`Vehicle lookup failed: ${error.message}`);
      }
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Invalid response from vehicle decoder');
      }
      
      // Store the vehicle data
      const vehicleData: Vehicle = {
        make: data.make,
        model: data.model,
        year: data.year ? parseInt(data.year) : undefined,
        trim: data.trim,
        engine: data.engine,
        fuelType: data.fuelType || data.fuel_type,
        transmission: data.transmission || 'Automatic' // Default value
      };
      
      setVehicle(vehicleData);
      
      // Move to next stage - we need additional details from the user
      setStage('details_required');
      
      // Pre-fill available data for the required inputs
      setRequiredInputs({
        mileage: null,
        fuelType: vehicleData.fuelType || null,
        zipCode: '',
        condition: 3, // Default to "Good" condition
        conditionLabel: 'Good',
        hasAccident: false,
        accidentDescription: ''
      });
      
      toast.success(`Vehicle found: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`);
      
      return true;
    } catch (err) {
      console.error('Vehicle lookup error:', err);
      setStage('lookup_failed');
      setError(err instanceof Error ? err.message : 'Failed to lookup vehicle');
      toast.error(err instanceof Error ? err.message : 'Failed to lookup vehicle');
      return false;
    }
  };

  // Step 2: Submit valuation with all required inputs
  const submitValuation = async (details: Partial<RequiredInputs>) => {
    if (!vehicle) {
      setError('No vehicle data available');
      return false;
    }
    
    setStage('valuation_in_progress');
    setError(null);
    
    try {
      // Merge vehicle data with additional details
      const payload = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        mileage: details.mileage,
        condition: details.conditionLabel?.toLowerCase() || 'good',
        fuelType: details.fuelType || vehicle.fuelType,
        zipCode: details.zipCode,
        accident: details.hasAccident ? 'yes' : 'no',
        accidentDetails: details.hasAccident ? {
          count: '1',
          severity: 'minor',
          area: 'front'
        } : undefined,
        includeCarfax: true
      };
      
      // Call the valuation edge function
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: payload
      });
      
      if (error) {
        throw new Error(`Valuation failed: ${error.message}`);
      }
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Invalid response from valuation service');
      }
      
      // Store the valuation result
      setValuationResult({
        id: data.id,
        estimated_value: data.estimatedValue,
        confidence_score: data.confidenceScore,
        price_range: data.priceRange,
        base_price: data.basePrice,
        zip_demand_factor: data.multiplier,
        adjustments: data.valuationFactors
      });
      
      setStage('valuation_complete');
      toast.success('Vehicle valuation complete!');
      
      return true;
    } catch (err) {
      console.error('Valuation error:', err);
      setStage('valuation_failed');
      setError(err instanceof Error ? err.message : 'Failed to generate valuation');
      toast.error(err instanceof Error ? err.message : 'Failed to generate valuation');
      return false;
    }
  };

  return {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error,
    isLoading: stage === 'lookup_in_progress' || stage === 'valuation_in_progress',
    runLookup,
    submitValuation,
    reset
  };
}
