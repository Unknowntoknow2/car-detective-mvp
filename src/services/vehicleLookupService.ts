
import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/lib/supabase';

export const fetchVehicleByVin = async (vin: string): Promise<DecodedVehicleInfo> => {
  console.log('🔍 Starting VIN lookup for:', vin);
  
  try {
    // First check our database cache
    const { data: cachedVehicle } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .single();
    
    if (cachedVehicle) {
      console.log('✅ Found cached vehicle data');
      return {
        vin: cachedVehicle.vin,
        make: cachedVehicle.make || '',
        model: cachedVehicle.model || '',
        year: cachedVehicle.year || new Date().getFullYear(),
        trim: cachedVehicle.trim,
        engine: cachedVehicle.engine,
        transmission: cachedVehicle.transmission,
        drivetrain: cachedVehicle.drivetrain,
        bodyType: cachedVehicle.bodytype || cachedVehicle.bodyType,
        fuelType: cachedVehicle.fueltype
      };
    }
    
    // If not cached, create mock data for demo
    console.log('📝 Creating mock vehicle data for VIN:', vin);
    const mockVehicle: DecodedVehicleInfo = {
      vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      trim: 'SE',
      engine: '2.5L 4-Cylinder',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      bodyType: 'Sedan',
      fuelType: 'Gasoline'
    };
    
    return mockVehicle;
  } catch (error) {
    console.error('❌ VIN lookup error:', error);
    throw new Error(`Failed to decode VIN ${vin}`);
  }
};

export const fetchVehicleByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo> => {
  console.log('🔍 Starting plate lookup for:', plate, state);
  
  try {
    // Check database cache
    const { data: cachedPlate } = await supabase
      .from('plate_lookups')
      .select('*')
      .eq('plate', plate)
      .eq('state', state)
      .single();
    
    if (cachedPlate) {
      console.log('✅ Found cached plate data');
      return {
        make: cachedPlate.make || '',
        model: cachedPlate.model || '',
        year: cachedPlate.year || new Date().getFullYear(),
        color: cachedPlate.color
      };
    }
    
    // Mock data for demo
    const mockVehicle: DecodedVehicleInfo = {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Silver'
    };
    
    return mockVehicle;
  } catch (error) {
    console.error('❌ Plate lookup error:', error);
    throw new Error(`Failed to lookup plate ${plate} in ${state}`);
  }
};

export const fetchTrimOptions = async (make: string, model: string, year: number): Promise<string[]> => {
  console.log('🔍 Fetching trim options for:', make, model, year);
  
  try {
    // Mock trim options for demo
    const mockTrims = ['Base', 'SE', 'XLE', 'Limited'];
    return mockTrims;
  } catch (error) {
    console.error('❌ Trim lookup error:', error);
    return [];
  }
};
