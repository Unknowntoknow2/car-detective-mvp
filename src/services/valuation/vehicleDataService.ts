
import { supabase } from '@/integrations/supabase/client';
import type { VehicleData } from '@/types/vehicle';

export type VehicleSnapshot = Partial<VehicleData> & {
  zip?: string;
  zipCode?: string;
};

export async function getVehicleDataByVin(vin: string): Promise<VehicleSnapshot | null> {
  // First try to get from VIN decoding service
  const { data: vinData, error: vinError } = await supabase.functions.invoke('vin-decoder', {
    body: { vin }
  });

  if (vinError) {
    return null;
  }

  if (vinData?.success && vinData?.vehicleData) {
    const vehicle = vinData.vehicleData;
    const zip = vehicle.zipCode || '95821';
    return {
      vin,
      year: vehicle.year || 2018,
      make: vehicle.make || 'TOYOTA',
      model: vehicle.model || 'Camry',
      trim: vehicle.trim || 'Unknown',
      fuelType: vehicle.fuelType || 'gasoline',
      transmission: vehicle.transmission || 'automatic',
      mileage: vehicle.mileage || 0,
      zip,
      zipCode: zip
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
    return null;
  }

  const zip = requestData.zip_code || '95821';
  return {
    vin,
    year: requestData.year || 2018,
    make: requestData.make || 'TOYOTA',
    model: requestData.model || 'Camry',
    trim: requestData.trim || 'Unknown',
    fuelType: 'gasoline',
    mileage: requestData.mileage || 0,
    zip,
    zipCode: zip
  };
}

export async function getVehicleDataByValuationId(valuationId: string): Promise<VehicleSnapshot | null> {
  const { data, error } = await supabase
    .from('valuation_requests')
    .select('*')
    .eq('id', valuationId)
    .single();

  if (error || !data) {
    return null;
  }

  const zip = data.zip_code || '95821';
  return {
    vin: data.vin || undefined,
    year: data.year || 2018,
    make: data.make || 'TOYOTA',
    model: data.model || 'Camry',
    trim: data.trim || 'Unknown',
    fuelType: 'gasoline',
    mileage: data.mileage || 0,
    zip,
    zipCode: zip
  };
}
