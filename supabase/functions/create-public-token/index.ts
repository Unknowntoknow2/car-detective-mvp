
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate a secure random token
function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  return Array.from(randomValues)
    .map(x => chars[x % chars.length])
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get supabase client with the request auth context
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Get user ID from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - You must be logged in" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request for valuation ID
    const { valuationId } = await req.json();
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Valuation ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user owns this valuation
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('id')
      .eq('id', valuationId)
      .eq('user_id', user.id)
      .single();

    if (valuationError || !valuation) {
      return new Response(
        JSON.stringify({ error: "Valuation not found or you don't have permission to share it" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if a token already exists for this valuation
    const { data: existingToken, error: existingTokenError } = await supabase
      .from('public_tokens')
      .select('token')
      .eq('valuation_id', valuationId)
      .maybeSingle();

    if (!existingTokenError && existingToken?.token) {
      // Return existing token if one already exists
      return new Response(
        JSON.stringify({
          token: existingToken.token,
          shareUrl: `/share/${existingToken.token}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a new token
    const token = generateToken();
    
    // Insert the token
    const { error: insertError } = await supabase
      .from('public_tokens')
      .insert({ valuation_id: valuationId, token: token });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to create share link: " + insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success with the token and share URL
    return new Response(
      JSON.stringify({
        token,
        shareUrl: `/share/${token}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating public token:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
