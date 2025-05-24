
import { supabase } from '@/lib/supabaseClient';

/**
 * Fetch vehicle information by VIN
 * @param vin Vehicle Identification Number
 * @returns Promise with vehicle data
 */
export async function fetchVehicleByVin(vin: string): Promise<any> {
  try {
    // First check if we have this VIN in our database
    const { data: existingVehicle, error: dbError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('vin', vin)
      .maybeSingle();
      
    if (existingVehicle && !dbError) {
      console.log('VIN found in database:', existingVehicle);
      return existingVehicle;
    }
    
    // If not in database, would normally call an external API
    // For now, simulate a response with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vin,
          year: 2019,
          make: 'Toyota',
          model: 'Camry',
          trim: 'SE',
          engine: '2.5L I4',
          transmission: 'Automatic',
          drivetrain: 'FWD',
          exteriorColor: 'Silver',
          interiorColor: 'Black',
          fuelType: 'Gasoline',
          mileage: 45000,
          // Add more details as needed
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error fetching vehicle by VIN:', error);
    throw new Error('Failed to fetch vehicle information. Please try again.');
  }
}

/**
 * Fetch vehicle information by license plate and state
 * @param plate License plate number
 * @param state State abbreviation
 * @returns Promise with vehicle data
 */
export async function fetchVehicleByPlate(plate: string, state: string): Promise<any> {
  try {
    // First check if we have this plate in our database
    const { data: existingVehicle, error: dbError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('license_plate', plate)
      .eq('state', state)
      .maybeSingle();
      
    if (existingVehicle && !dbError) {
      console.log('Plate found in database:', existingVehicle);
      return existingVehicle;
    }
    
    // If not in database, would normally call an external API
    // For now, simulate a response with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          licensePlate: plate,
          state: state,
          year: 2018,
          make: 'Honda',
          model: 'Accord',
          trim: 'EX-L',
          engine: '1.5L I4 Turbo',
          transmission: 'CVT',
          drivetrain: 'FWD',
          exteriorColor: 'Blue',
          interiorColor: 'Tan',
          fuelType: 'Gasoline',
          mileage: 52000,
          // Add more details as needed
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error fetching vehicle by plate:', error);
    throw new Error('Failed to fetch vehicle information. Please try again.');
  }
}

/**
 * Fetch vehicle details by make, model, year
 * @param make Vehicle make
 * @param model Vehicle model
 * @param year Vehicle year
 * @returns Promise with vehicle data
 */
export async function fetchVehicleByDetails(make: string, model: string, year: number): Promise<any> {
  try {
    // Check if we have this vehicle in our database
    const { data: existingVehicle, error: dbError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('make', make)
      .eq('model', model)
      .eq('year', year)
      .maybeSingle();
      
    if (existingVehicle && !dbError) {
      console.log('Vehicle found in database:', existingVehicle);
      return existingVehicle;
    }
    
    // If not in database, would normally call an external API
    // For now, simulate a response with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          year,
          make,
          model,
          trim: 'Base',
          fuelType: 'Gasoline',
          // Add more details as needed
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching vehicle by details:', error);
    throw new Error('Failed to fetch vehicle information. Please try again.');
  }
}

/**
 * Fetch trim options for a specific make, model, and year
 * @param make Vehicle make
 * @param model Vehicle model
 * @param year Vehicle year
 * @returns Promise with array of trim options
 */
export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  try {
    // Check if we have trim options for this vehicle in our database
    const { data: trimData, error: dbError } = await supabase
      .from('model_trims')
      .select('trim_name')
      .eq('make', make)
      .eq('model_name', model)
      .eq('year', year);
      
    if (trimData && !dbError && trimData.length > 0) {
      return trimData.map((item: { trim_name: string }) => item.trim_name);
    }
    
    // If not in database, simulate a response with common trim levels
    return new Promise((resolve) => {
      setTimeout(() => {
        // Default trim levels based on make
        let trims: string[] = ['Base', 'Standard'];
        
        if (make === 'Toyota') {
          if (model === 'Camry') {
            trims = ['LE', 'SE', 'XLE', 'XSE', 'TRD'];
          } else if (model === 'RAV4') {
            trims = ['LE', 'XLE', 'XLE Premium', 'Adventure', 'TRD Off-Road', 'Limited'];
          }
        } else if (make === 'Honda') {
          if (model === 'Accord') {
            trims = ['LX', 'Sport', 'Sport Special Edition', 'EX-L', 'Touring'];
          } else if (model === 'Civic') {
            trims = ['LX', 'Sport', 'EX', 'Touring'];
          }
        } else if (make === 'Ford') {
          if (model === 'F-150') {
            trims = ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor'];
          }
        }
        
        resolve(trims);
      }, 800);
    });
  } catch (error) {
    console.error('Error fetching trim options:', error);
    // Return default trims on error
    return ['Standard', 'Deluxe', 'Premium'];
  }
}
