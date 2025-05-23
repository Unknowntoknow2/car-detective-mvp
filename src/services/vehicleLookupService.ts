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
  } catch (error) {
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
      } catch (vinError) {
        console.warn('Could not get detailed info from VIN, using plate data only:', vinError);
        // Fall back to just the plate lookup result if VIN decode fails
        return initialResult.data;
      }
    }
    
    return initialResult.data;
  } catch (error) {
    console.error('Error fetching vehicle by plate:', error);
    throw error;
  }
}
