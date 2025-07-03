import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValuationExport {
  id: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    vin: string;
    mileage?: number;
    condition?: string;
  };
  valuation: {
    estimated_value: number;
    confidence_score?: number;
    condition_score?: number;
    created_at: string;
    valuation_type: string;
  };
  market_data?: {
    adjustments?: any;
    comparable_vehicles?: number;
    market_multiplier?: number;
  };
  features?: Array<{
    name: string;
    category: string;
    value_impact: number;
  }>;
  photo_analysis?: {
    condition_score?: number;
    damage_detected?: any;
    features_detected?: any;
  };
  metadata: {
    exported_at: string;
    version: string;
    source: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Public token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get valuation by public token
    const { data: tokenData, error: tokenError } = await supabase
      .from("public_tokens")
      .select(`
        token,
        expires_at,
        valuations (
          id,
          year,
          make,
          model,
          trim,
          vin,
          mileage,
          condition,
          estimated_value,
          confidence_score,
          condition_score,
          created_at,
          valuation_type,
          adjustments,
          vehicle_features (
            features (
              name,
              category,
              value_impact
            )
          ),
          photo_condition_scores (
            condition_score,
            damage_detected,
            features_detected
          )
        )
      `)
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if token has expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Token has expired" }),
        {
          status: 410,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const valuation = tokenData.valuations;
    if (!valuation) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build the export object
    const exportData: ValuationExport = {
      id: valuation.id,
      vehicle: {
        year: valuation.year,
        make: valuation.make,
        model: valuation.model,
        trim: valuation.trim,
        vin: valuation.vin,
        mileage: valuation.mileage,
        condition: valuation.condition,
      },
      valuation: {
        estimated_value: valuation.estimated_value,
        confidence_score: valuation.confidence_score,
        condition_score: valuation.condition_score,
        created_at: valuation.created_at,
        valuation_type: valuation.valuation_type,
      },
      market_data: {
        adjustments: valuation.adjustments,
        // Add more market data fields as available
      },
      features: valuation.vehicle_features?.map((vf: any) => ({
        name: vf.features.name,
        category: vf.features.category,
        value_impact: vf.features.value_impact,
      })) || [],
      photo_analysis: valuation.photo_condition_scores?.[0] ? {
        condition_score: valuation.photo_condition_scores[0].condition_score,
        damage_detected: valuation.photo_condition_scores[0].damage_detected,
        features_detected: valuation.photo_condition_scores[0].features_detected,
      } : undefined,
      metadata: {
        exported_at: new Date().toISOString(),
        version: "1.0",
        source: "AIN Vehicle Intelligence Platform",
      },
    };

    // Set appropriate headers for JSON download
    const filename = `valuation_${valuation.year}_${valuation.make}_${valuation.model}_${valuation.id.slice(0, 8)}.json`;
    
    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("Error exporting valuation JSON:", error);
    return new Response(
      JSON.stringify({ error: "Failed to export valuation data" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});