import { DecodedVehicleInfo } from '@/types/vehicle';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  // Mock implementation - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    vin,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 45000,
    trim: 'LE',
    engine: '2.5L I4',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    exteriorColor: 'Silver',
    estimatedValue: 22000,
    confidenceScore: 85
  };
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  // Mock implementation - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    mileage: 52000,
    trim: 'Sport',
    engine: '1.5L Turbo',
    transmission: 'CVT',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    exteriorColor: 'Blue',
    estimatedValue: 20500,
    confidenceScore: 82
  };
}

export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  console.log('🔍 Fetching real trim options for:', make, model, year);
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch_vpic_data', {
      body: { 
        make, 
        model, 
        year,
        dataType: 'trims'
      }
    });

    if (error) {
      console.error('❌ Trim lookup service error:', error);
      throw new Error(`Trim lookup failed: ${error.message || 'Service unavailable'}`);
    }

    if (!data || !data.success) {
      console.warn('⚠️ No trim data available for this vehicle');
      return [];
    }

    return data.trims || [];
  } catch (error) {
    console.error('❌ Failed to fetch trim options:', error);
    // Return empty array instead of mock data
    return [];
  }
}
