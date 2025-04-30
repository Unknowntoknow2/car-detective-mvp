
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { IdentifierType, Vehicle, RequiredInputs, ValuationResult } from './types';

export async function decodeVehicle(type: IdentifierType, identifier: string, state?: string): Promise<{
  vehicle: Vehicle;
  error?: string;
}> {
  try {
    // Call the Supabase edge function to decode the VIN/plate
    const functionName = type === 'vin' ? 'decode-vin' : 'decode-plate';
    const requestBody = type === 'vin' ? { vin: identifier } : {
      plate: identifier,
      state: state || ''
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
    
    // Return the vehicle data
    const vehicleData: Vehicle = {
      make: data.make,
      model: data.model,
      year: data.year ? parseInt(data.year) : undefined,
      trim: data.trim,
      engine: data.engine,
      fuelType: data.fuelType || data.fuel_type,
      transmission: data.transmission || 'Automatic' // Default value
    };
    
    return { vehicle: vehicleData };
  } catch (err) {
    console.error('Vehicle lookup error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to lookup vehicle';
    return { vehicle: {}, error: errorMessage };
  }
}

export async function generateValuation(vehicle: Vehicle, details: Partial<RequiredInputs>): Promise<{
  result?: ValuationResult;
  error?: string;
}> {
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
    
    // Return the valuation result
    const result: ValuationResult = {
      id: data.id,
      estimated_value: data.estimatedValue,
      confidence_score: data.confidenceScore,
      price_range: data.priceRange,
      base_price: data.basePrice,
      zip_demand_factor: data.multiplier,
      adjustments: data.valuationFactors
    };
    
    return { result };
  } catch (err) {
    console.error('Valuation error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to generate valuation';
    return { error: errorMessage };
  }
}
