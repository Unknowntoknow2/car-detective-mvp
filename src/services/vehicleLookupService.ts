
import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  console.log('🔍 Fetching real vehicle data for VIN:', vin);
  
  try {
    // Call the unified decode edge function for real VIN data
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      console.error('❌ VIN decode service error:', error);
      throw new Error(`VIN lookup failed: ${error.message || 'Service unavailable'}`);
    }

    if (!data || !data.success) {
      const errorMsg = data?.error || 'VIN not found in database';
      console.error('❌ VIN decode failed:', errorMsg);
      throw new Error(`Unable to decode VIN: ${errorMsg}`);
    }

    if (!data.decoded) {
      throw new Error('No vehicle data found for this VIN');
    }

    console.log('✅ Real vehicle data retrieved:', data.decoded);
    
    // Return only real data - no mock additions
    const vehicleData: DecodedVehicleInfo = {
      vin: data.decoded.vin || vin,
      year: data.decoded.year,
      make: data.decoded.make,
      model: data.decoded.model,
      trim: data.decoded.trim,
      engine: data.decoded.engine,
      transmission: data.decoded.transmission,
      bodyType: data.decoded.bodyType,
      fuelType: data.decoded.fuelType,
      drivetrain: data.decoded.drivetrain,
      exteriorColor: data.decoded.exteriorColor,
      interiorColor: data.decoded.interiorColor,
      doors: data.decoded.doors,
      seats: data.decoded.seats,
      displacement: data.decoded.displacement,
      // Only include photos if they're real user uploads or manufacturer data
      photos: data.decoded.photos || [],
      primaryPhoto: data.decoded.primaryPhoto
    };

    return vehicleData;
  } catch (error) {
    console.error('❌ Failed to fetch vehicle data:', error);
    throw error;
  }
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('🔍 Fetching real vehicle data for plate:', plate, 'state:', state);
  
  try {
    // Call edge function for real plate lookup
    const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
      body: { 
        plate: plate.toUpperCase(), 
        state: state.toUpperCase(),
        type: 'plate_lookup'
      }
    });

    if (error) {
      console.error('❌ Plate lookup service error:', error);
      throw new Error(`License plate lookup failed: ${error.message || 'Service unavailable'}`);
    }

    if (!data || !data.success) {
      const errorMsg = data?.error || 'License plate not found in database';
      console.error('❌ Plate lookup failed:', errorMsg);
      throw new Error(`Unable to lookup license plate: ${errorMsg}`);
    }

    console.log('✅ Real plate data retrieved:', data.vehicle);
    
    return {
      plate,
      state,
      ...data.vehicle,
      photos: data.vehicle?.photos || [],
      primaryPhoto: data.vehicle?.primaryPhoto
    };
  } catch (error) {
    console.error('❌ Failed to fetch plate data:', error);
    throw error;
  }
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
