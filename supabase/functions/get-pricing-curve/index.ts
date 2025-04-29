
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Input validation schema using Zod
const PricingCurveRequestSchema = z.object({
  zip_code: z.string().min(5),
  condition: z.enum(['excellent', 'good', 'fair', 'poor'])
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with environment variables
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = PricingCurveRequestSchema.parse(body);

    // Query the pricing_curves table for a matching zip code and condition
    const { data, error } = await supabase
      .from('pricing_curves')
      .select('multiplier')
      .match({
        zip_code: validatedData.zip_code,
        condition: validatedData.condition
      })
      .single();

    if (error || !data) {
      console.error('Error fetching pricing curve:', error);
      return new Response(
        JSON.stringify({ error: 'Pricing curve not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the multiplier value
    return new Response(
      JSON.stringify({ multiplier: data.multiplier }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-pricing-curve function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
