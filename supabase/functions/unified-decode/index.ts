
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DecodedVehicle {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
}

interface DecodedVehicleError {
  error: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, vin, licensePlate, state, manual } = await req.json();
    let decoded: DecodedVehicle | DecodedVehicleError;

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (type) {
      case 'vin': {
        // Call NHTSA API for VIN decoding
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
        );
        const { Results } = await response.json();

        // Extract relevant fields from NHTSA response
        decoded = Results.reduce((acc: DecodedVehicle, item: any) => {
          switch (item.Variable) {
            case 'Make':
              acc.make = item.Value;
              break;
            case 'Model':
              acc.model = item.Value;
              break;
            case 'Model Year':
              acc.year = parseInt(item.Value);
              break;
            case 'Trim':
              acc.trim = item.Value;
              break;
            case 'Engine':
              acc.engine = item.Value;
              break;
            case 'Transmission Style':
              acc.transmission = item.Value;
              break;
            case 'Drive Type':
              acc.drivetrain = item.Value;
              break;
            case 'Body Class':
              acc.bodyType = item.Value;
              break;
          }
          return acc;
        }, {} as DecodedVehicle);

        // Store in decoded_vehicles table
        await supabaseClient
          .from('decoded_vehicles')
          .upsert([{ 
            vin,
            ...decoded,
            timestamp: new Date().toISOString()
          }]);

        break;
      }
      
      case 'plate': {
        // Query plate_lookups table
        const { data, error } = await supabaseClient
          .from('plate_lookups')
          .select('*')
          .eq('plate', licensePlate)
          .eq('state', state)
          .maybeSingle();

        if (error || !data) {
          decoded = { error: 'Plate not found' };
          break;
        }

        decoded = {
          make: data.make,
          model: data.model,
          year: data.year
        };
        break;
      }
      
      case 'manual': {
        // For manual entry, just validate and return the input
        if (!manual?.make || !manual?.model || !manual?.year) {
          decoded = { error: 'Missing required manual entry fields' };
          break;
        }

        decoded = {
          make: manual.make,
          model: manual.model,
          year: manual.year,
          // Include optional fields if provided
          trim: manual.trim,
          engine: manual.engine,
          transmission: manual.transmission,
          drivetrain: manual.drivetrain,
          bodyType: manual.bodyType
        };
        break;
      }

      default:
        decoded = { error: 'Invalid decode type' };
    }

    return new Response(
      JSON.stringify({ decoded }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Decode error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
