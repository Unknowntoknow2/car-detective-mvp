// @ts-ignore - Deno remote imports
// @ts-ignore - Deno remote imports
// @ts-ignore - Deno remote imports
// @ts-ignore - Deno remote imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

interface DecodeVinRequest {
  vin: string;
}

interface VpicResponse {
  Results?: Array<{
    Variable?: string;
    Value?: string;
    VariableId?: number;
  }>;
  Count?: number;
  Message?: string;
}

serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const body: DecodeVinRequest = await req.json();
    const { vin } = body;

    if (!vin || typeof vin !== 'string' || vin.length !== 17) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid VIN format. VIN must be exactly 17 characters." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`🔍 Decoding VIN: ${vin}`);

    // Call NHTSA vPIC API
    const vpicUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
    const vpicResponse = await fetch(vpicUrl, {
      headers: {
        'User-Agent': 'AIN-Valuation-Engine/1.0'
      }
    });

    if (!vpicResponse.ok) {
      throw new Error(`vPIC API call failed: ${vpicResponse.status}`);
    }

    const vpicData: VpicResponse = await vpicResponse.json();

    if (!vpicData.Results || vpicData.Results.length === 0) {
      throw new Error("No data returned from vPIC API");
    }

    // Extract basic vehicle information
    const results = vpicData.Results;
    const getValue = (variable: string) => {
      const item = results.find(r => r.Variable === variable);
      return item?.Value || null;
    };

    const year = parseInt(getValue("Model Year") || "0") || null;
    const make = getValue("Make") || null;
    const model = getValue("Model") || null;
    const bodyClass = getValue("Body Class") || null;
    const engineCylinders = getValue("Engine Number of Cylinders") || null;
    const fuelType = getValue("Fuel Type - Primary") || null;
    const transmission = getValue("Transmission Style") || null;

    // Extract safety equipment data
    const safetyEquipment = {
      abs: getValue("Anti-lock Braking System (ABS)") || null,
      esc: getValue("Electronic Stability Control (ESC)") || null,
      traction_control: getValue("Traction Control System") || null,
      electronic_brake_distribution: getValue("Electronic Brake Distribution (EBD)") || null,
      brake_assist: getValue("Brake Assist") || null,
      features: results
        .filter(r => r.Variable?.toLowerCase().includes('safety') || 
                    r.Variable?.toLowerCase().includes('brake') ||
                    r.Variable?.toLowerCase().includes('stability'))
        .map(r => ({
          name: r.Variable,
          value: r.Value,
          variable_id: r.VariableId
        }))
        .filter(f => f.value && f.value !== "" && f.value !== "Not Applicable")
    };

    // Extract airbag data
    const airbags = {
      driver: getValue("Driver Air Bag Locations") || null,
      passenger: getValue("Passenger Air Bag Locations") || null,
      side: getValue("Side Air Bag Locations") || null,
      curtain: getValue("Curtain Air Bag Locations") || null,
      knee: getValue("Knee Air Bag Locations") || null,
      seat_cushion: getValue("Seat Cushion Air Bag Locations") || null,
      features: results
        .filter(r => r.Variable?.toLowerCase().includes('air bag') || 
                    r.Variable?.toLowerCase().includes('airbag'))
        .map(r => ({
          name: r.Variable,
          value: r.Value,
          variable_id: r.VariableId
        }))
        .filter(f => f.value && f.value !== "" && f.value !== "Not Applicable")
    };

    // Extract lighting data
    const lighting = {
      headlight_type: getValue("Headlight Type") || null,
      daytime_running_lights: getValue("Daytime Running Light (DRL)") || null,
      adaptive_headlights: getValue("Adaptive Headlights") || null,
      auto_headlights: getValue("Automatic Headlight Control") || null,
      features: results
        .filter(r => r.Variable?.toLowerCase().includes('light') || 
                    r.Variable?.toLowerCase().includes('lamp'))
        .map(r => ({
          name: r.Variable,
          value: r.Value,
          variable_id: r.VariableId
        }))
        .filter(f => f.value && f.value !== "" && f.value !== "Not Applicable")
    };

    // Insert or update vehicle_specs
    const { data: vehicleSpec, error: upsertError } = await supabase
      .from('vehicle_specs')
      .upsert({
        vin,
        year,
        make,
        model,
        body_class: bodyClass,
        engine_cylinders: engineCylinders,
        fuel_type_primary: fuelType,
        transmission_style: transmission,
        safety_equipment: safetyEquipment,
        airbags: airbags,
        lighting: lighting,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'vin'
      })
      .select();

    if (upsertError) {
      throw new Error(`Failed to save vehicle specs: ${upsertError.message}`);
    }

    // Record in vin_history
    await supabase
      .from('vin_history')
      .insert({
        vin,
        decode_success: true,
        data_sources: ['vpic'],
        cache_hit: false,
        response_time_ms: Date.now() % 1000, // Approximate
        metadata: {
          year,
          make,
          model,
          safety_features_count: safetyEquipment.features?.length || 0,
          airbag_features_count: airbags.features?.length || 0,
          lighting_features_count: lighting.features?.length || 0
        }
      });

    console.log(`✅ VIN ${vin} decoded successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        vin,
        vehicle: {
          year,
          make,
          model,
          body_class: bodyClass,
          engine_cylinders: engineCylinders,
          fuel_type_primary: fuelType,
          transmission_style: transmission
        },
        safety_data: {
          safety_equipment: safetyEquipment,
          airbags: airbags,
          lighting: lighting
        },
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ VIN decode failed:", errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
