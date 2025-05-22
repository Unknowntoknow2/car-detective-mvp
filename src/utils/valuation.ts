
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
    // In a real app, you would fetch VIN details from an API
    // For now, we'll use mock data
    const mockData = {
      vin,
      user_id: userId,
      is_vin_lookup: true,
      estimated_value: Math.floor(15000 + Math.random() * 10000),
      confidence_score: Math.floor(70 + Math.random() * 30),
      base_price: 15000,
      year: new Date().getFullYear() - Math.floor(Math.random() * 5),
      make: 'Auto-detected', // This would be filled by actual VIN decoder
      model: 'Auto-detected',
      mileage: Math.floor(20000 + Math.random() * 50000),
    };
    
    const { data, error } = await supabase
      .from('valuations')
      .insert(mockData)
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
    // In a real app, you would fetch plate details from an API
    // For now, we'll use mock data
    const mockData = {
      plate,
      state,
      user_id: userId,
      is_vin_lookup: false,
      estimated_value: Math.floor(12000 + Math.random() * 8000),
      confidence_score: Math.floor(65 + Math.random() * 25),
      base_price: 12000,
      year: new Date().getFullYear() - Math.floor(Math.random() * 6),
      make: 'Auto-detected', // This would be filled by actual plate lookup
      model: 'Auto-detected',
      mileage: Math.floor(25000 + Math.random() * 60000),
    };
    
    const { data, error } = await supabase
      .from('valuations')
      .insert(mockData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating plate valuation:', error);
      return null;
    }
    
    return data as ValuationResult;
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
