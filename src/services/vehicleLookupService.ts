
import { lookupPlate } from './plateService';
import { decodeVin } from './vinService';
import { supabase } from '@/utils/supabaseClient';

/**
 * Lookup vehicle by VIN
 */
export async function fetchVehicleByVin(vin: string): Promise<any> {
  if (!vin || vin.length !== 17) {
    throw new Error('Please enter a valid 17-character VIN');
  }
  
  try {
    // Call the edge function to decode the VIN
    const { data, error } = await supabase.functions.invoke('decode-vin', {
      body: { vin }
    });

    if (error) {
      console.error('Error calling decode-vin function:', error);
      throw new Error(`Failed to decode VIN: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data received from VIN decoder');
    }
    
    // Return the decoded vehicle data
    return data;
  } catch (error: any) {
    console.error('Error fetching vehicle by VIN:', error);
    throw error;
  }
}

/**
 * Lookup vehicle by license plate and state
 */
export async function fetchVehicleByPlate(plate: string, state: string): Promise<any> {
  if (!plate) {
    throw new Error('Please enter a license plate');
  }
  
  if (!state) {
    throw new Error('Please select a state');
  }
  
  try {
    // Use lookupPlate service and then potentially fetch more data via decode-vin
    // if the plate lookup returns a VIN
    const initialResult = await lookupPlate(plate, state);
    
    // If the plate lookup returned a VIN, we can get more details
    if (initialResult && initialResult.data && initialResult.data.vin) {
      try {
        const detailedResult = await fetchVehicleByVin(initialResult.data.vin);
        // Merge the results, prioritizing the detailed result but keeping
        // plate-specific info from the initial result
        return {
          ...initialResult.data,
          ...detailedResult,
          plate: plate,
          state: state
        };
      } catch (vinError: any) {
        console.warn('Could not get detailed info from VIN, using plate data only:', vinError);
        // Fall back to just the plate lookup result if VIN decode fails
        return initialResult.data;
      }
    }
    
    return initialResult.data;
  } catch (error: any) {
    console.error('Error fetching vehicle by plate:', error);
    throw error;
  }
}

/**
 * Fetch available trims for a specific make/model/year
 */
export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('model_trims')
      .select('trim_name')
      .eq('year', year)
      .eq('make', make)
      .eq('model', model);
    
    if (error) {
      console.error('Error fetching trim options:', error);
      throw new Error('Failed to load trim options');
    }
    
    // If no specific trims found, return default options
    if (!data || data.length === 0) {
      return ['Standard', 'Deluxe', 'Premium', 'Sport'];
    }
    
    // Extract trim names from results
    return data.map(item => item.trim_name);
  } catch (error: any) {
    console.error('Error in fetchTrimOptions:', error);
    // Return default options if there's an error
    return ['Standard', 'Deluxe', 'Premium', 'Sport'];
  }
}

/**
 * Calculate valuation based on vehicle data and driving behavior
 */
export async function calculateValuation(vehicleData: any, drivingBehavior?: string): Promise<any> {
  try {
    // Prepare base data for valuation
    const valuationData = {
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      mileage: vehicleData.mileage || 0,
      condition: vehicleData.condition || 'Good',
      zipCode: vehicleData.zipCode || '90210',
      trim: vehicleData.trim,
      fuelType: vehicleData.fueltype || vehicleData.fuel_type,
      transmission: vehicleData.transmission,
      drivingScore: getDrivingScoreFromBehavior(drivingBehavior)
    };
    
    // Call the valuation edge function
    const { data, error } = await supabase.functions.invoke('car-price-prediction', {
      body: valuationData
    });
    
    if (error) {
      console.error('Error calculating valuation:', error);
      throw new Error(`Valuation calculation failed: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in calculateValuation:', error);
    // Return a fallback valuation with error info
    return {
      estimatedValue: 0,
      confidenceScore: 0,
      error: error.message,
      priceRange: [0, 0],
      adjustments: []
    };
  }
}

// Helper function to convert driving behavior description to score
function getDrivingScoreFromBehavior(behavior?: string): number {
  switch (behavior?.toLowerCase()) {
    case 'cautious':
      return 90;
    case 'normal':
      return 75;
    case 'aggressive':
      return 50;
    default:
      return 75; // Default to normal
  }
}
