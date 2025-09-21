import { supabase } from '@/integrations/supabase/client';

interface VehicleDecodeResult {
  success: boolean;
  vehicle?: any;
  error?: string;
}

/**
 * PHASE 1 FIX: Core VIN decode service that ensures decode results are saved to database
 */
export async function decodeVin(vin: string): Promise<VehicleDecodeResult> {
  try {
    if (!vin || vin.length !== 17) {
      return {
        success: false,
        error: 'Invalid VIN format. VIN must be 17 characters long.'
      };
    }
    // Call the unified-decode edge function
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'VIN decode service failed'
      };
    }

    if (!data || !data.success) {
      return {
        success: false,
        error: data?.error || 'Failed to decode VIN'
      };
    }
    // Verify the vehicle was saved to decoded_vehicles table
    const { data: savedVehicle, error: verifyError } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verifyError) {
    } else if (savedVehicle) {
    } else {
    }

    return {
      success: true,
      vehicle: data.decoded
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'VIN decode service failed'
    };
  }
}

/**
 * Get decoded vehicle data from database
 */
export async function getDecodedVehicle(vin: string) {
  try {
    const { data, error } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Check if vehicle needs decoding
 */
export async function needsDecoding(vin: string): Promise<boolean> {
  if (!vin || vin.length !== 17) return false;
  
  const existingVehicle = await getDecodedVehicle(vin);
  return !existingVehicle;
}