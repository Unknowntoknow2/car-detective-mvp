// @ts-ignore: Deno std library import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("🚗 AIN VIN Decoder Edge Function - PR B Test Version");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const supabase = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
);

// Helper functions
function toBool(s: string | null): boolean | null {
  if (!s || s.trim() === '' || s.toLowerCase() === 'na' || s.toLowerCase() === 'not applicable') {
    return null;
  }
  const normalized = s.toLowerCase().trim();
  if (normalized === 'yes' || normalized === 'standard' || normalized === 'true') {
    return true;
  }
  if (normalized === 'no' || normalized === 'false') {
    return false;
  }
  return null;
}

function parseAirbagFlag(s: string | null): boolean | null {
  if (!s || s.trim() === '' || s.toLowerCase() === 'na' || s.toLowerCase() === 'not applicable') {
    return null;
  }
  return s.trim().length > 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const vin = body.vin;

    if (!vin) {
      return new Response(JSON.stringify({ error: "VIN required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mock vPIC data for testing
    const mockVpicData = {
      VIN: vin,
      Make: "Honda",
      Model: "Civic",
      ModelYear: "2023",
      Trim: "EX",
      BodyClass: "Sedan", 
      EngineCylinders: "4",
      DisplacementCC: "1500.0",
      FuelTypePrimary: "Gasoline",
      DriveType: "FWD",
      TransmissionStyle: "CVT",
      Manufacturer: "Honda Motor Company",
      // Safety equipment
      ABS: "Yes",
      ESC: "Standard", 
      TractionControl: "Yes",
      DynamicBrakeSupport: "No",
      AdaptiveCruiseControl: "Standard",
      ForwardCollisionWarning: "Yes",
      LaneDepartureWarning: "Yes",
      BlindSpotMon: "Yes",
      // Airbags
      AirBagLocFront: "1st Row (Driver & Passenger)",
      AirBagLocSide: "1st Row", 
      AirBagLocCurtain: "1st and 2nd Rows",
      AirBagLocKnee: "Driver",
      Pretensioner: "Yes",
      // Lighting
      DaytimeRunningLight: "Standard",
      LowerBeamHeadlampLightSource: "LED",
      SemiautomaticHeadlampBeamSwitching: "Yes"
    };

    // Map safety equipment
    const safetyEquipment = {
      abs: toBool(mockVpicData.ABS),
      esc: toBool(mockVpicData.ESC),
      traction_control: toBool(mockVpicData.TractionControl),
      dynamic_brake_support: toBool(mockVpicData.DynamicBrakeSupport),
      adaptive_cruise_control: toBool(mockVpicData.AdaptiveCruiseControl),
      forward_collision_warning: toBool(mockVpicData.ForwardCollisionWarning),
      lane_departure_warning: toBool(mockVpicData.LaneDepartureWarning),
      blind_spot_monitoring: toBool(mockVpicData.BlindSpotMon)
    };

    // Map airbags
    const airbags = {
      front: parseAirbagFlag(mockVpicData.AirBagLocFront),
      side: parseAirbagFlag(mockVpicData.AirBagLocSide),
      curtain: parseAirbagFlag(mockVpicData.AirBagLocCurtain),
      knee: parseAirbagFlag(mockVpicData.AirBagLocKnee),
      pretensioner: toBool(mockVpicData.Pretensioner)
    };

    // Map lighting
    const lighting = {
      daytime_running_lights: toBool(mockVpicData.DaytimeRunningLight),
      lower_beam_source: mockVpicData.LowerBeamHeadlampLightSource || null,
      automatic_beam_switching: toBool(mockVpicData.SemiautomaticHeadlampBeamSwitching)
    };

    // Upsert to database using RPC
    const { data: result, error } = await supabase.rpc('rpc_upsert_specs', {
      vin_param: vin,
      make_param: mockVpicData.Make,
      model_param: mockVpicData.Model,
      year_param: parseInt(mockVpicData.ModelYear),
      trim_param: mockVpicData.Trim,
      body_class_param: mockVpicData.BodyClass,
      engine_cylinders_param: parseInt(mockVpicData.EngineCylinders),
      displacement_cc_param: parseFloat(mockVpicData.DisplacementCC),
      fuel_type_primary_param: mockVpicData.FuelTypePrimary,
      drive_type_param: mockVpicData.DriveType,
      transmission_style_param: mockVpicData.TransmissionStyle,
      manufacturer_param: mockVpicData.Manufacturer,
      safety_equipment_param: safetyEquipment,
      airbags_param: airbags,
      lighting_param: lighting
    });

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Database error", details: error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      vin: vin,
      vehicle_data: {
        make: mockVpicData.Make,
        model: mockVpicData.Model,
        year: parseInt(mockVpicData.ModelYear)
      },
      safety_equipment: safetyEquipment,
      airbags: airbags,
      lighting: lighting,
      database_result: result
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
