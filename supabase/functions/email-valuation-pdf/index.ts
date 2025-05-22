
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { valuationId, email } = await req.json();
    
    if (!valuationId || !email) {
      return new Response(
        JSON.stringify({ error: 'Valuation ID and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a Supabase client with the auth context of the logged in user
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has premium access to this valuation
    const { data: premiumValuation, error: premiumError } = await supabase
      .from('premium_valuations')
      .select('*')
      .eq('valuation_id', valuationId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    // Also check if the valuation itself is marked as premium
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('premium_unlocked, make, model, year')
      .eq('id', valuationId)
      .single();
    
    if (valuationError) {
      return new Response(
        JSON.stringify({ error: 'Valuation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has premium access
    const hasPremiumAccess = premiumValuation || valuation.premium_unlocked;
    
    if (!hasPremiumAccess) {
      return new Response(
        JSON.stringify({ error: 'Premium access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, we would generate the PDF here
    // and then send it via email using a service like Resend, SendGrid, etc.
    // For this example, we'll just log the request and return success
    
    console.log(`Sending PDF report for ${valuation.year} ${valuation.make} ${valuation.model} to ${email}`);
    
    // Log the email send attempt
    await supabase
      .from('email_logs')
      .insert({
        user_id: user.id,
        email: email,
        valuation_id: valuationId,
        email_type: 'pdf_report',
        status: 'sent'
      });
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending PDF email:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
