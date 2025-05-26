
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { fetchWithRetry } from './utils/fetchWithRetry.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface VehicleDecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: any;
  error?: string;
}

async function logFailure(vin: string, errorMessage: string, source: string) {
  try {
    console.log(`🔴 Logging failure for VIN ${vin} from ${source}: ${errorMessage}`);
    await supabase
      .from('vin_failures')
      .insert({
        vin,
        error_message: errorMessage,
        source,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log VIN failure:', error);
  }
}

async function checkCache(vin: string): Promise<any | null> {
  try {
    console.log(`🔍 Checking cache for VIN: ${vin}`);
    const { data, error } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Cache check error:', error);
      return null;
    }
    
    if (data) {
      console.log(`✅ Found cached data for VIN: ${vin}`);
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Cache check failed:', error);
    return null;
  }
}

async function saveToCache(vin: string, decodedData: any) {
  try {
    console.log(`💾 Saving to cache for VIN: ${vin}`);
    const { error } = await supabase
      .from('decoded_vehicles')
      .upsert({
        vin,
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year,
        trim: decodedData.trim,
        engine: decodedData.engine,
        transmission: decodedData.transmission,
        bodytype: decodedData.bodyType,
        fueltype: decodedData.fuelType,
        drivetrain: decodedData.drivetrain,
        doors: decodedData.doors,
        seats: decodedData.seats,
        enginecylinders: decodedData.engineCylinders,
        displacementl: decodedData.displacementL,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to save to cache:', error);
    } else {
      console.log(`✅ Successfully cached VIN: ${vin}`);
    }
  } catch (error) {
    console.error('Cache save failed:', error);
  }
}

async function enrichVehicleData(decodedData: any): Promise<any> {
  try {
    console.log(`🔧 Enriching vehicle data for: ${decodedData.make} ${decodedData.model} ${decodedData.year}`);
    
    // Try to find make in database
    if (decodedData.make) {
      const { data: makeData } = await supabase
        .from('makes')
        .select('*')
        .ilike('make_name', decodedData.make)
        .limit(1)
        .single();
      
      if (makeData && decodedData.model) {
        // Try to find model
        const { data: modelData } = await supabase
          .from('models')
          .select('*')
          .eq('make_id', makeData.id)
          .ilike('model_name', decodedData.model)
          .limit(1)
          .single();
        
        if (modelData && !decodedData.trim) {
          // Try to find a suitable trim if missing
          const { data: trimData } = await supabase
            .from('model_trims')
            .select('*')
            .eq('model_id', modelData.id)
            .eq('year', decodedData.year)
            .limit(1)
            .single();
          
          if (trimData) {
            console.log(`✅ Found trim for enrichment: ${trimData.trim_name}`);
            decodedData.trim = trimData.trim_name;
          }
        }
      }
    }
    
    return decodedData;
  } catch (error) {
    console.error('Enrichment failed:', error);
    return decodedData; // Return original data if enrichment fails
  }
}

async function decodeViaNHTSA(vin: string): Promise<any | null> {
  try {
    console.log(`🚗 Attempting NHTSA decode for VIN: ${vin}`);
    
    const response = await fetchWithRetry(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      { method: 'GET' },
      { maxRetries: 3, timeoutMs: 5000 }
    );
    
    if (!response.ok) {
      throw new Error(`NHTSA API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results from NHTSA API');
    }
    
    const result = data.Results[0];
    
    // Map NHTSA response to our format
    const decoded = {
      vin,
      make: result.Make || null,
      model: result.Model || null,
      year: result.ModelYear ? parseInt(result.ModelYear) : null,
      trim: result.Trim || null,
      engine: result.EngineConfiguration || result.EngineCylinders || null,
      transmission: result.TransmissionStyle || null,
      bodyType: result.BodyClass || null,
      fuelType: result.FuelTypePrimary || null,
      drivetrain: result.DriveType || null,
      doors: result.Doors || null,
      seats: result.Seats || null,
      engineCylinders: result.EngineCylinders || null,
      displacementL: result.DisplacementL || null
    };
    
    console.log(`✅ NHTSA decode successful for VIN: ${vin}`);
    return decoded;
  } catch (error) {
    console.error(`❌ NHTSA decode failed for VIN ${vin}:`, error);
    await logFailure(vin, error.message, 'nhtsa');
    return null;
  }
}

async function decodeViaAutoAPI(vin: string): Promise<any | null> {
  try {
    console.log(`🔧 Attempting AutoAPI decode for VIN: ${vin}`);
    
    // Mock AutoAPI implementation - replace with real API when available
    // For now, return null to force fallback to cache
    console.log('⚠️ AutoAPI not configured, skipping to cache fallback');
    await logFailure(vin, 'AutoAPI not configured', 'autoapi');
    return null;
    
    // Uncomment and configure when AutoAPI key is available:
    /*
    const response = await fetchWithRetry(
      `https://api.autoapi.io/v1/vin/${vin}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('AUTOAPI_KEY')}`,
          'Content-Type': 'application/json'
        }
      },
      { maxRetries: 3, timeoutMs: 5000 }
    );
    
    if (!response.ok) {
      throw new Error(`AutoAPI returned ${response.status}`);
    }
    
    const data = await response.json();
    // Map AutoAPI response to our format
    return {
      vin,
      make: data.make,
      model: data.model,
      year: data.year,
      // ... map other fields
    };
    */
  } catch (error) {
    console.error(`❌ AutoAPI decode failed for VIN ${vin}:`, error);
    await logFailure(vin, error.message, 'autoapi');
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();
    
    if (!vin || typeof vin !== 'string' || vin.length !== 17) {
      return new Response(
        JSON.stringify({
          success: false,
          vin: vin || '',
          source: 'failed',
          error: 'Invalid VIN format. VIN must be exactly 17 characters.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log(`🔍 Starting unified decode for VIN: ${vin}`);
    
    // Step 1: Check cache first
    let cachedData = await checkCache(vin);
    if (cachedData) {
      const enrichedCache = await enrichVehicleData(cachedData);
      return new Response(
        JSON.stringify({
          success: true,
          vin,
          source: 'cache',
          decoded: enrichedCache
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Step 2: Try NHTSA API
    let decoded = await decodeViaNHTSA(vin);
    if (decoded) {
      const enriched = await enrichVehicleData(decoded);
      await saveToCache(vin, enriched);
      return new Response(
        JSON.stringify({
          success: true,
          vin,
          source: 'nhtsa',
          decoded: enriched
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Step 3: Try AutoAPI (fallback)
    decoded = await decodeViaAutoAPI(vin);
    if (decoded) {
      const enriched = await enrichVehicleData(decoded);
      await saveToCache(vin, enriched);
      return new Response(
        JSON.stringify({
          success: true,
          vin,
          source: 'autoapi',
          decoded: enriched
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Step 4: All sources failed
    console.log(`❌ All decode sources failed for VIN: ${vin}`);
    await logFailure(vin, 'All decode sources failed', 'unified');
    
    return new Response(
      JSON.stringify({
        success: false,
        vin,
        source: 'failed',
        error: 'Unable to decode VIN. All sources failed. Please try manual entry.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 422
      }
    );

  } catch (error) {
    console.error('❌ Unified decode error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        vin: '',
        source: 'failed',
        error: 'Internal server error during VIN decode'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
