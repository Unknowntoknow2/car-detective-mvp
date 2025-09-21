
import { supabase } from '@/integrations/supabase/client';

// Interface for valuation details
export interface ValuationDetails {
  year: number;
  make: string;
  model: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  vin?: string;
  plate?: string;
  state?: string;
}

// Interface for valuation result
export interface ValuationResult {
  id: string;
  estimated_value: number;
  confidence_score: number;
  base_price?: number;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  condition?: string;
  state?: string;
  vin?: string;
  plate?: string;
  created_at?: string;
  user_id?: string | null;
}

/**
 * Fetches a valuation by ID
 */
export async function getValuationById(id: string): Promise<ValuationResult | null> {
  try {
    const { data, error } = await supabase
      .from('valuation_results')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a valuation for a VIN
 */
export async function createVinValuation(vin: string, userId?: string | null): Promise<ValuationResult | null> {
  try {
    // Decode VIN using the unified-decode edge function
    const { data: decodedData, error: decodeError } = await supabase.functions.invoke('unified-decode', {
      body: { vin }
    });

    if (decodeError) {
      return null;
    }

    const decodedVehicle = decodedData?.data;
    if (!decodedVehicle) {
      return null;
    }

    // Create valuation request for processing
    const { data: valuationRequest, error: requestError } = await supabase
      .from('valuation_requests')
      .insert({
        user_id: userId,
        vin: vin,
        make: decodedVehicle.make || 'Unknown',
        model: decodedVehicle.model || 'Unknown',
        year: decodedVehicle.year || new Date().getFullYear(),
        mileage: null, // Will be filled in follow-up
        status: 'pending'
      })
      .select('*')
      .single();

    if (requestError) {
      return null;
    }

    // Create legacy valuation record for backward compatibility
    const { data, error } = await supabase
      .from('valuation_results')
      .insert({
        vin,
        user_id: userId,
        estimated_value: 0,
        confidence_score: 0,
        year: decodedVehicle.year,
        make: decodedVehicle.make,
        model: decodedVehicle.model,
        mileage: null,
        vehicle_data: {
          source: 'vin_lookup'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) {
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a valuation for a license plate
 */
export async function createPlateValuation(plate: string, state: string, userId?: string | null): Promise<ValuationResult | null> {
  try {
    // TODO: Implement actual plate lookup API integration
    // For now, return null to force manual entry flow
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a valuation based on manual entry
 */
export async function createManualValuation(details: ValuationDetails, userId?: string | null): Promise<ValuationResult | null> {
  try {
    // Calculate estimated value based on details
    const estimatedValue = calculateEstimatedValue(details);
    
    const valuationData = {
      user_id: userId,
      estimated_value: estimatedValue,
      confidence_score: 75, // Slightly lower confidence for manual entry
      year: details.year,
      make: details.make,
      model: details.model,
      mileage: details.mileage,
      condition: details.condition,
      zip_code: details.zipCode || null,
    };
    
    const { data, error } = await supabase
      .from('valuation_results')
      .insert({
        ...valuationData,
        vehicle_data: {
          source: 'manual_entry'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) {
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    return null;
  }
}

/**
 * Helper function to calculate estimated value based on manual entry
 */
function calculateEstimatedValue(details: ValuationDetails): number {
  // Basic formula: base price adjusted for year, mileage, and condition
  const basePrice = 15000;
  const yearFactor = 1 + ((details.year - 2010) * 0.05);
  const mileageFactor = details.mileage ? 1 - ((details.mileage / 100000) * 0.2) : 1;
  
  let conditionFactor = 1;
  if (details.condition) {
    switch (details.condition) {
      case 'excellent':
        conditionFactor = 1.2;
        break;
      case 'good':
        conditionFactor = 1.0;
        break;
      case 'fair':
        conditionFactor = 0.8;
        break;
      case 'poor':
        conditionFactor = 0.6;
        break;
      default:
        conditionFactor = 1.0;
    }
  }
  
  return Math.floor(basePrice * yearFactor * mileageFactor * conditionFactor);
}
