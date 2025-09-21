
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
  base_price: number;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  condition?: string;
  state?: string;
  vin?: string;
  plate?: string;
  created_at: string;
  user_id?: string | null;
}

/**
 * Fetches a valuation by ID
 */
export async function getValuationById(id: string): Promise<ValuationResult | null> {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching valuation:', error);
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    console.error('Error in getValuationById:', error);
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
      console.error('Error decoding VIN:', decodeError);
      return null;
    }

    const decodedVehicle = decodedData?.data;
    if (!decodedVehicle) {
      console.error('No vehicle data returned from VIN decode');
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
      console.error('Error creating valuation request:', requestError);
      return null;
    }

    // Create legacy valuation record for backward compatibility
    const { data, error } = await supabase
      .from('valuations')
      .insert({
        vin,
        user_id: userId,
        is_vin_lookup: true,
        estimated_value: 0, // Will be calculated by valuation engine
        confidence_score: 0, // Will be calculated by valuation engine
        base_price: 0,
        year: decodedVehicle.year,
        make: decodedVehicle.make,
        model: decodedVehicle.model,
        mileage: null,
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating VIN valuation:', error);
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    console.error('Error in createVinValuation:', error);
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
    console.error('Error in createPlateValuation:', error);
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
      is_vin_lookup: false,
      estimated_value: estimatedValue,
      confidence_score: 75, // Slightly lower confidence for manual entry
      base_price: estimatedValue * 0.8, // Base price as 80% of estimated value
      year: details.year,
      make: details.make,
      model: details.model,
      mileage: details.mileage,
      condition: details.condition,
      state: details.zipCode?.substring(0, 2), // Using first two digits of ZIP as state (for demo)
    };
    
    const { data, error } = await supabase
      .from('valuations')
      .insert(valuationData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating manual valuation:', error);
      return null;
    }
    
    return data as ValuationResult;
  } catch (error) {
    console.error('Error in createManualValuation:', error);
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
