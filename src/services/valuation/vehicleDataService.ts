import { supabase } from '@/integrations/supabase/client'

export type VehicleData =
  import('../../../apps/ain-valuation-engine/src/types/canonical').VehicleData
export type VehicleDataCanonical =
  import('../../../apps/ain-valuation-engine/src/types/canonical').VehicleDataCanonical

export async function getVehicleDataByVin(vin: string): Promise<VehicleData | null> {
  try {
    const { data: vinData, error: vinError } = await supabase.functions.invoke('vin-decoder', {
      body: { vin },
    })
    if (vinError) {
      console.error('VIN decoding error:', vinError)
      return null
    }
    if (vinData?.success && vinData?.vehicleData) {
      const v = vinData.vehicleData as Record<string, any>
      const fallbackZip = v.zipCode ?? v.zip ?? '95821'
      const normalized = {
        vin,
        year: v.year ?? 2018,
        make: v.make ?? 'TOYOTA',
        model: v.model ?? 'Camry',
        trim: v.trim ?? undefined,
        mileage: v.mileage ?? 0,
        condition: v.condition ?? 'unknown',
        titleStatus: v.titleStatus ?? 'unknown',
        fuelType: v.fuelType ?? 'gasoline',
        transmission: v.transmission ?? 'automatic',
        drivetrain: v.drivetrain ?? undefined,
        color: v.color ?? v.exteriorColor ?? undefined,
        exteriorColor: v.exteriorColor ?? v.color ?? undefined,
        zip: fallbackZip,
      } satisfies VehicleData
      return { ...normalized, zipCode: fallbackZip } as VehicleData
    }

    const { data: requestData, error: requestError } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (requestError || !requestData) {
      console.error('Database lookup error:', requestError)
      return null
    }

    const fallbackZip = requestData.zip_code ?? '95821'
    const normalized = {
      vin,
      year: requestData.year ?? 2018,
      make: requestData.make ?? 'TOYOTA',
      model: requestData.model ?? 'Camry',
      trim: requestData.trim ?? undefined,
      mileage: requestData.mileage ?? 0,
      condition: requestData.condition ?? 'unknown',
      titleStatus: requestData.title_status ?? 'unknown',
      fuelType: requestData.fuel_type ?? 'gasoline',
      transmission: requestData.transmission ?? 'automatic',
      drivetrain: requestData.drivetrain ?? undefined,
      zip: fallbackZip,
    } satisfies VehicleData
    return { ...normalized, zipCode: fallbackZip } as VehicleData
  } catch (error) {
    console.error('Error getting vehicle data:', error)
    return null
  }
}

export async function getVehicleDataByValuationId(valuationId: string): Promise<VehicleData | null> {
  try {
    const { data, error } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', valuationId)
      .single()

    if (error || !data) {
      console.error('Valuation lookup error:', error)
      return null
    }

    const fallbackZip = data.zip_code ?? '95821'
    const normalized = {
      vin: data.vin ?? '',
      year: data.year ?? 2018,
      make: data.make ?? 'TOYOTA',
      model: data.model ?? 'Camry',
      trim: data.trim ?? undefined,
      mileage: data.mileage ?? 0,
      condition: data.condition ?? 'unknown',
      titleStatus: data.title_status ?? 'unknown',
      fuelType: data.fuel_type ?? 'gasoline',
      transmission: data.transmission ?? 'automatic',
      drivetrain: data.drivetrain ?? undefined,
      zip: fallbackZip,
    } satisfies VehicleData
    return { ...normalized, zipCode: fallbackZip } as VehicleData
  } catch (error) {
    console.error('Error getting valuation data:', error)
    return null
  }
}
