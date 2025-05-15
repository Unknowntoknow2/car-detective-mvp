
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    );
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get valuation ID from request
    const { valuationId } = await req.json();
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: 'Valuation ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if this is a premium valuation or if user has premium access
    const serviceSB = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    const { data: premiumData } = await serviceSB.rpc('has_premium_access', { valuation_id: valuationId });
    const hasPremiumAccess = !!premiumData;
    
    // Fetch valuation data
    const { data: valuation, error: valuationError } = await serviceSB
      .from('valuations')
      .select(`
        *,
        photo_scores(*),
        photo_condition_scores(*),
        vehicle_features(feature_id)
      `)
      .eq('id', valuationId)
      .single();
      
    if (valuationError || !valuation) {
      return new Response(
        JSON.stringify({ error: 'Valuation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user owns this valuation or is an admin
    const isOwner = valuation.user_id === user.id;
    const { data: isAdmin } = await serviceSB.rpc('is_admin', { user_id: user.id });
    
    if (!isOwner && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch features data if present
    let features = [];
    if (valuation.vehicle_features && valuation.vehicle_features.length > 0) {
      const featureIds = valuation.vehicle_features.map((vf: any) => vf.feature_id);
      const { data: featuresData } = await serviceSB
        .from('features')
        .select('*')
        .in('id', featureIds);
        
      features = featuresData || [];
    }
    
    // In a real implementation, here we would generate a PDF using a library
    // For this mock version, we'll just return a successful response
    
    // Record the PDF generation in the database
    await serviceSB
      .from('valuations')
      .update({
        pdf_url: `https://storage.example.com/pdfs/${valuationId}.pdf`
      })
      .eq('id', valuationId);
    
    // Return mock PDF URL
    return new Response(
      JSON.stringify({
        success: true,
        url: `https://storage.example.com/pdfs/${valuationId}.pdf`,
        isPremium: hasPremiumAccess
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
