
import { lookupPlate } from './plateService';
import { decodeVin } from './vinService';

/**
 * Lookup vehicle by VIN
 */
export async function fetchVehicleByVin(vin: string): Promise<any> {
  if (!vin || vin.length !== 17) {
    throw new Error('Please enter a valid 17-character VIN');
  }
  
  try {
    const result = await decodeVin(vin);
    return result;
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
    const result = await lookupPlate(plate, state);
    return result;
  } catch (error) {
    console.error('Error fetching vehicle by plate:', error);
    throw error;
  }
}
