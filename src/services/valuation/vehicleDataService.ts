
import { supabase } from '@/integrations/supabase/client';

export type VehicleData =
  import('../../apps/ain-valuation-engine/src/types/canonical').VehicleData
export type VehicleDataCanonical =
  import('../../apps/ain-valuation-engine/src/types/canonical').VehicleDataCanonical

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
      const normalized = {
        vin,
        year: vehicle.year || 2018,
        make: vehicle.make || 'TOYOTA',
        model: vehicle.model || 'Camry',
        trim: vehicle.trim || 'Unknown',
        mileage: vehicle.mileage || 0,
        zip: vehicle.zipCode || vehicle.zip || '95821',
        condition: vehicle.condition || 'unknown',
        titleStatus: vehicle.titleStatus || 'unknown',
        fuelType: vehicle.fuelType || 'gasoline',
        transmission: vehicle.transmission || 'automatic',
        drivetrain: vehicle.drivetrain,
        color: vehicle.color || vehicle.exteriorColor,
        exteriorColor: vehicle.exteriorColor || vehicle.color
      } satisfies Partial<VehicleData>;
      return {
        ...normalized,
        vin: normalized.vin ?? vin,
        year: normalized.year ?? 2018,
        make: normalized.make ?? 'TOYOTA',
        model: normalized.model ?? 'Camry',
        mileage: normalized.mileage ?? 0,
        condition: normalized.condition ?? 'unknown',
        titleStatus: normalized.titleStatus ?? 'unknown',
        zip: normalized.zip ?? '95821',
        zipCode: normalized.zip ?? '95821'
      } as VehicleData;
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

    const fallbackZip = requestData.zip_code || '95821';
    return {
      vin,
      year: requestData.year || 2018,
      make: requestData.make || 'TOYOTA',
      model: requestData.model || 'Camry',
      trim: requestData.trim || 'Unknown',
      mileage: requestData.mileage || 0,
      condition: requestData.condition || 'unknown',
      titleStatus: requestData.title_status || 'unknown',
      fuelType: 'gasoline',
      transmission: requestData.transmission || 'automatic',
      drivetrain: requestData.drivetrain || undefined,
      zip: fallbackZip,
      zipCode: fallbackZip
    } as VehicleData;

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

    const fallbackZip = data.zip_code || '95821';
    return {
      vin: data.vin || '',
      year: data.year || 2018,
      make: data.make || 'TOYOTA',
      model: data.model || 'Camry',
      trim: data.trim || 'Unknown',
      mileage: data.mileage || 0,
      condition: data.condition || 'unknown',
      titleStatus: data.title_status || 'unknown',
      fuelType: data.fuel_type || 'gasoline',
      transmission: data.transmission || 'automatic',
      drivetrain: data.drivetrain || undefined,
      zip: fallbackZip,
      zipCode: fallbackZip
    } as VehicleData;

  } catch (error) {
    console.error('Error getting valuation data:', error);
    return null;
  }
}
