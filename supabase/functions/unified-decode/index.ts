
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
  exteriorColor?: string;
  vin?: string;
  mileage?: number;
  features?: string[];
  condition?: number;
}

interface DecodedVehicleError {
  error: string;
  code?: string;
  details?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, vin, licensePlate, state, manual, imageData } = await req.json();
    let decoded: DecodedVehicle | DecodedVehicleError;

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (type) {
      case 'vin': {
        if (!vin || vin.length !== 17) {
          decoded = { 
            error: 'Invalid VIN format', 
            code: 'INVALID_VIN',
            details: 'VIN must be 17 characters long'
          };
          break;
        }

        try {
          // Call NHTSA API for VIN decoding
          const response = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
          );
          
          if (!response.ok) {
            throw new Error(`NHTSA API error: ${response.status} ${response.statusText}`);
          }
          
          const { Results } = await response.json();

          // Check for API errors
          const errorEntry = Results.find((item: any) => item.Variable === 'Error Code' && item.Value !== '0');
          if (errorEntry) {
            decoded = { 
              error: errorEntry.Value, 
              code: 'NHTSA_ERROR',
              details: 'Error returned by vehicle database'
            };
            break;
          }

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
          }, { make: '', model: '', year: 0 } as DecodedVehicle);

          // Validate required fields
          if (!decoded.make || !decoded.model || !decoded.year) {
            decoded = { 
              error: 'Incomplete vehicle data', 
              code: 'INCOMPLETE_DATA',
              details: 'Unable to extract complete vehicle information from VIN'
            };
            break;
          }

          // Store in decoded_vehicles table
          await supabaseClient
            .from('decoded_vehicles')
            .upsert([{ 
              vin,
              ...decoded,
              timestamp: new Date().toISOString()
            }]);
        } catch (err) {
          console.error("VIN lookup error:", err);
          decoded = { 
            error: err instanceof Error ? err.message : 'VIN lookup failed',
            code: 'VIN_LOOKUP_ERROR'
          };
        }
        break;
      }
      
      case 'plate': {
        if (!licensePlate || !state) {
          decoded = { 
            error: 'Missing license plate or state', 
            code: 'MISSING_PLATE_DATA'
          };
          break;
        }

        try {
          // Query plate_lookups table
          const { data, error } = await supabaseClient
            .from('plate_lookups')
            .select('*')
            .eq('plate', licensePlate)
            .eq('state', state)
            .maybeSingle();

          if (error) {
            throw new Error(`Database error: ${error.message}`);
          }

          if (!data) {
            decoded = { 
              error: 'Plate not found', 
              code: 'PLATE_NOT_FOUND',
              details: `No records found for plate ${licensePlate} in ${state}`
            };
            break;
          }

          decoded = {
            make: data.make,
            model: data.model,
            year: data.year,
            exteriorColor: data.color,
            vin: data.vin
          };
        } catch (err) {
          console.error("Plate lookup error:", err);
          decoded = { 
            error: err instanceof Error ? err.message : 'Plate lookup failed',
            code: 'PLATE_LOOKUP_ERROR'
          };
        }
        break;
      }
      
      case 'manual': {
        // For manual entry, validate required fields
        if (!manual?.make || !manual?.model || !manual?.year) {
          decoded = { 
            error: 'Missing required vehicle fields', 
            code: 'MISSING_MANUAL_DATA',
            details: 'Make, model and year are required'
          };
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
          bodyType: manual.bodyType,
          exteriorColor: manual.exteriorColor,
          vin: manual.vin,
          mileage: manual.mileage,
          features: manual.selectedFeatures,
          condition: manual.condition
        };
        
        // Log the entry to help improve our database
        console.log(`Manual vehicle entry:`, JSON.stringify(decoded));
        
        // Save manual entries to a table for future reference
        try {
          await supabaseClient.from('manual_vehicle_entries').insert({
            make: manual.make,
            model: manual.model,
            year: manual.year,
            mileage: manual.mileage,
            fuel_type: manual.fuelType,
            condition: manual.condition,
            trim: manual.trim,
            body_type: manual.bodyType,
            user_ip: req.headers.get('x-forwarded-for') || 'unknown'
          });
        } catch (err) {
          // Just log the error, don't fail the request
          console.error("Failed to save entry:", err);
        }
        
        break;
      }

      case 'photo': {
        // In a real implementation, this would analyze the uploaded images
        // For now, we use mock data based on the provided info
        
        // Check if we have basic image data (would be base64 in real implementation)
        if (!imageData || imageData.length === 0) {
          decoded = { 
            error: 'No image data provided', 
            code: 'MISSING_IMAGE_DATA' 
          };
          break;
        }
        
        // In a production environment, this would call an AI image analysis service
        console.log(`Processing ${imageData.length} vehicle photos`);
        
        // Mock response for demonstration purposes
        // In a real implementation, we would extract data from images
        decoded = {
          make: "Toyota",
          model: "Camry",
          year: 2019,
          trim: "SE",
          exteriorColor: "Silver",
          // Additional estimated fields that AI might detect
          condition: 75, // Good condition
          mileage: 45000, // Estimated from image (real AI might estimate this)
          features: ["sunroof", "alloy_wheels", "led_headlights", "fog_lights"],
          bodyType: "Sedan"
        };
        
        // Log the photo analysis
        console.log(`Photo analysis result:`, JSON.stringify(decoded));
        
        break;
      }

      default:
        decoded = { 
          error: 'Invalid decode type', 
          code: 'INVALID_TYPE',
          details: 'Type must be one of: vin, plate, manual, photo'
        };
    }

    // Return the decoded vehicle or error
    return new Response(
      JSON.stringify({ decoded }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Decode error:', err);
    return new Response(
      JSON.stringify({ 
        error: { 
          message: err instanceof Error ? err.message : 'Unknown error occurred',
          code: 'UNEXPECTED_ERROR'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
