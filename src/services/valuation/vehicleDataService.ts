
import { supabase } from '@/integrations/supabase/client';

export interface VehicleData {
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  zipCode?: string;
}

export async function getVehicleDataByVin(vin: string): Promise<VehicleData | null> {
  try {
    // First try to get from VIN decoding service
    const { data: vinData, error: vinError } = await supabase.functions.invoke('vin-decoder', {
      body: { vin }
    });

    if (vinError) {
      console.error('VIN decoding error:', vinError);
      return null;
    }

    if (vinData?.success && vinData?.vehicleData) {
      const vehicle = vinData.vehicleData;
      return {
        vin,
        year: vehicle.year || 2018,
        make: vehicle.make || 'TOYOTA',
        model: vehicle.model || 'Camry',
        trim: vehicle.trim || 'Unknown',
        fuelType: vehicle.fuelType || 'gasoline',
        transmission: vehicle.transmission || 'automatic',
        mileage: vehicle.mileage || 0,
        zipCode: vehicle.zipCode || '95821'
      };
    }

    // Fallback: try to get from valuation requests table
    const { data: requestData, error: requestError } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (requestError || !requestData) {
      console.error('Database lookup error:', requestError);
      return null;
    }

    return {
      vin,
      year: requestData.year || 2018,
      make: requestData.make || 'TOYOTA',
      model: requestData.model || 'Camry',
      trim: requestData.trim || 'Unknown',
      fuelType: 'gasoline',
      mileage: requestData.mileage || 0,
      zipCode: requestData.zip_code || '95821'
    };

  } catch (error) {
    console.error('Error getting vehicle data:', error);
    return null;
  }
}

export async function getVehicleDataByValuationId(valuationId: string): Promise<VehicleData | null> {
  try {
    const { data, error } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', valuationId)
      .single();

    if (error || !data) {
      console.error('Valuation lookup error:', error);
      return null;
    }

    return {
      vin: data.vin || undefined,
      year: data.year || 2018,
      make: data.make || 'TOYOTA',
      model: data.model || 'Camry',
      trim: data.trim || 'Unknown',
      fuelType: 'gasoline',
      mileage: data.mileage || 0,
      zipCode: data.zip_code || '95821'
    };

  } catch (error) {
    console.error('Error getting valuation data:', error);
    return null;
  }
}
