
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const body = await req.json();
    const validatedData = PricingCurveRequestSchema.parse(body);

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
