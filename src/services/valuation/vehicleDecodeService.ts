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

    console.log('🔍 [VIN DECODE] Starting decode for VIN:', vin);

    // Call the unified-decode edge function
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      console.error('❌ [VIN DECODE] Edge function error:', error);
      return {
        success: false,
        error: error.message || 'VIN decode service failed'
      };
    }

    if (!data || !data.success) {
      console.error('❌ [VIN DECODE] Decode failed:', data?.error);
      return {
        success: false,
        error: data?.error || 'Failed to decode VIN'
      };
    }

    console.log('✅ [VIN DECODE] Successfully decoded VIN:', data.decoded);

    // Verify the vehicle was saved to decoded_vehicles table
    const { data: savedVehicle, error: verifyError } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verifyError) {
      console.warn('⚠️ [VIN DECODE] Could not verify saved vehicle:', verifyError);
    } else if (savedVehicle) {
      console.log('✅ [VIN DECODE] Verified vehicle saved to database');
    } else {
      console.warn('⚠️ [VIN DECODE] Vehicle may not have been saved to database');
    }

    return {
      success: true,
      vehicle: data.decoded
    };

  } catch (error) {
    console.error('❌ [VIN DECODE] Service error:', error);
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
      console.error('Error fetching decoded vehicle:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getDecodedVehicle:', error);
    return null;
  }
}

/**
 * Check if vehicle needs decoding - Enhanced with logging
 */
export async function needsDecoding(vin: string): Promise<boolean> {
  if (!vin || vin.length !== 17) {
    console.log('🔍 [NEEDS DECODING] Invalid VIN format:', vin);
    return false;
  }
  
  console.log('🔍 [NEEDS DECODING] Checking if VIN needs decoding:', vin);
  
  try {
    const existingVehicle = await getDecodedVehicle(vin);
    const needsDecode = !existingVehicle;
    
    console.log('🔍 [NEEDS DECODING] Result:', {
      vin,
      hasExistingVehicle: !!existingVehicle,
      needsDecoding: needsDecode,
      existingVehicleId: existingVehicle?.id
    });
    
    return needsDecode;
  } catch (error) {
    console.error('❌ [NEEDS DECODING] Error checking decode status:', error);
    // If we can't check, assume it needs decoding
    return true;
  }
}