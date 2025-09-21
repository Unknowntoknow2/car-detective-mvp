
import { supabase } from '@/integrations/supabase/client';
import { VehicleDecodeResponse, DecodedVehicleInfo } from '@/types/vehicle-decode';
import { parseVehicleMetadataWithMpg } from '@/utils/vehicleMetaParser';

export async function decodeVin(vin: string): Promise<VehicleDecodeResponse> {
  try {
    
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

    
    // Handle successful response
    if (data && data.success) {
      const decoded = data.decoded;
      
      // Parse enhanced metadata from decode result
      const metadata = parseVehicleMetadataWithMpg(
        decoded,
        decoded.make || '',
        decoded.model || '',
        decoded.year || new Date().getFullYear()
      );
      
      
      return {
        success: true,
        vin: data.vin,
        source: data.source,
        decoded: {
          ...decoded,
          // Inject parsed metadata into decoded result
          trim: metadata.trim || decoded.trim,
          fuelType: metadata.fuelType !== 'Unknown' ? metadata.fuelType : decoded.fuelType,
          fuel_type: metadata.fuelType !== 'Unknown' ? metadata.fuelType : decoded.fuel_type,
          engine: metadata.engine || decoded.engine,
          estimatedMpg: metadata.estimatedMpg,
        }
      };
    }
    
    // Handle failed response with error details
    return {
      success: false,
      vin: data?.vin || vin,
      source: data?.source || 'failed',
      error: data?.error || 'Unknown decode error'
    };
    
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
  const MAX_RETRIES = 3;
  
  try {
    
    const result = await decodeVin(vin);
    
    // If it's a transient error and we haven't exceeded retries, try again
    if (!result.success && retryCount < MAX_RETRIES - 1) {
      const isTransientError = result.error?.includes('timeout') || 
                              result.error?.includes('network') ||
                              result.error?.includes('temporarily unavailable') ||
                              result.error?.includes('Service Unavailable');
      
      if (isTransientError) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
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

// Audit function to check system health
export async function auditDecodeSystem(): Promise<{
  totalAttempts: number;
  successRate: number;
  failuresBySource: Record<string, number>;
  recentFailures: any[];
}> {
  try {
    
    // Get failure statistics from the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: failures, error } = await supabase
      .from('vin_failures')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Audit query failed:', error);
      return {
        totalAttempts: 0,
        successRate: 0,
        failuresBySource: {},
        recentFailures: []
      };
    }
    
    // Analyze failures by source
    const failuresBySource: Record<string, number> = {};
    failures?.forEach(failure => {
      failuresBySource[failure.source] = (failuresBySource[failure.source] || 0) + 1;
    });
    
    const totalFailures = failures?.length || 0;
    
    // Get successful decodes count (approximate from decoded_vehicles table)
    const { count: successfulDecodes } = await supabase
      .from('decoded_vehicles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    const totalAttempts = totalFailures + (successfulDecodes || 0);
    const successRate = totalAttempts > 0 ? ((successfulDecodes || 0) / totalAttempts) * 100 : 0;
    
    
    return {
      totalAttempts,
      successRate,
      failuresBySource,
      recentFailures: failures?.slice(0, 10) || []
    };
    
  } catch (error) {
    console.error('❌ Audit system failed:', error);
    return {
      totalAttempts: 0,
      successRate: 0,
      failuresBySource: {},
      recentFailures: []
    };
  }
}
