
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.20.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Check the session status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Invalid session ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase service role client for database operations
    const serviceSB = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Check if this session was already processed
    const { data: existingOrder } = await serviceSB
      .from('orders')
      .select('status')
      .eq('stripe_session_id', sessionId)
      .single();
      
    if (existingOrder && existingOrder.status === 'paid') {
      // Already processed this payment
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'paid',
          valuationId: session.metadata?.valuation_id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (session.payment_status === 'paid') {
      // Update the order status to paid
      await serviceSB
        .from('orders')
        .update({ status: 'paid' })
        .eq('stripe_session_id', sessionId);
        
      // Unlock the premium features for this valuation
      if (session.metadata?.valuation_id) {
        await serviceSB
          .from('valuations')
          .update({ premium_unlocked: true })
          .eq('id', session.metadata.valuation_id);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'paid',
          valuationId: session.metadata?.valuation_id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Update the order status to match Stripe's status
      await serviceSB
        .from('orders')
        .update({ status: session.payment_status })
        .eq('stripe_session_id', sessionId);
        
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: session.payment_status,
          valuationId: session.metadata?.valuation_id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
