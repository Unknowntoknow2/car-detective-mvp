
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { valuation_id } = await req.json();
    
    if (!valuation_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Valuation ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get auth token from request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Authorization header missing" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client with the auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false }
      }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Use a service role client for database transactions
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Check if the valuation already has premium access
    const { data: existingAccess, error: existingError } = await serviceClient
      .from('premium_valuations')
      .select('*')
      .eq('valuation_id', valuation_id)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (existingAccess) {
      // Already has access, no need to use a credit
      return new Response(
        JSON.stringify({ success: true, message: "Already has premium access" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Begin transaction to use a credit
    const { data: creditData, error: creditError } = await serviceClient
      .from('premium_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (creditError && creditError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      return new Response(
        JSON.stringify({ success: false, error: "Error checking premium credits: " + creditError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!creditData || creditData.remaining_credits <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No premium credits available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update premium_credits and insert into premium_valuations in a transaction
    const { data: transaction, error: transactionError } = await serviceClient.rpc('use_premium_credit', {
      p_user_id: user.id,
      p_valuation_id: valuation_id
    });
    
    if (transactionError) {
      return new Response(
        JSON.stringify({ success: false, error: "Transaction failed: " + transactionError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Also update the valuation record to mark it as premium unlocked
    const { error: updateError } = await serviceClient
      .from('valuations')
      .update({ premium_unlocked: true })
      .eq('id', valuation_id);
      
    if (updateError) {
      console.error("Error updating valuation premium status:", updateError);
      // We don't want to fail the entire operation if just this update fails
    }
    
    // Insert transaction record
    const { error: transactionRecordError } = await serviceClient
      .from('premium_transactions')
      .insert({
        user_id: user.id,
        valuation_id,
        type: 'credit_use',
        amount: 0, // No monetary amount for using a credit
        quantity: 1
      });
      
    if (transactionRecordError) {
      console.error("Error recording transaction:", transactionRecordError);
      // We don't want to fail the operation if just the recording fails
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error using premium credit:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
