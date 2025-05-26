
import { supabase } from '@/integrations/supabase/client';
import { VehicleDecodeResponse, DecodedVehicleInfo } from '@/types/vehicle-decode';

export async function decodeVin(vin: string): Promise<VehicleDecodeResponse> {
  try {
    console.log('🔍 Starting VIN decode for:', vin);
    
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      console.error('❌ Decode service error:', error);
      return {
        success: false,
        vin,
        source: 'failed',
        error: 'Service temporarily unavailable. Please try again.'
      };
    }

    console.log('✅ Decode response:', data);
    return data;
  } catch (error) {
    console.error('❌ Decode request failed:', error);
    return {
      success: false,
      vin,
      source: 'failed',
      error: 'Network error. Please check your connection and try again.'
    };
  }
}

export async function retryDecode(vin: string, retryCount = 0): Promise<VehicleDecodeResponse> {
  const MAX_RETRIES = 2;
  
  try {
    const result = await decodeVin(vin);
    
    // If it's a transient error and we haven't exceeded retries, try again
    if (!result.success && retryCount < MAX_RETRIES) {
      const isTransientError = result.error?.includes('timeout') || 
                              result.error?.includes('network') ||
                              result.error?.includes('temporarily unavailable');
      
      if (isTransientError) {
        console.log(`🔄 Retrying decode (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return retryDecode(vin, retryCount + 1);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Retry decode failed:', error);
    return {
      success: false,
      vin,
      source: 'failed',
      error: 'Unable to decode VIN after multiple attempts.'
    };
  }
}
