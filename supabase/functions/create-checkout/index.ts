
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { valuationId } = await req.json();
    
    // Get the authenticated user's ID from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Check if the user already has premium access to this valuation
    if (valuationId) {
      const { data: valuationData, error: valuationError } = await req.supabaseClient
        .from('valuations')
        .select('premium_unlocked, user_id')
        .eq('id', valuationId)
        .maybeSingle();
      
      if (valuationError) throw new Error(valuationError.message);
      
      if (valuationData?.premium_unlocked) {
        return new Response(
          JSON.stringify({ already_unlocked: true, message: 'Premium features already unlocked' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      // Check if there's a completed order for this valuation
      const { data: orderData, error: orderError } = await req.supabaseClient
        .from('orders')
        .select('status')
        .eq('valuation_id', valuationId)
        .eq('status', 'paid')
        .maybeSingle();
      
      if (orderError) throw new Error(orderError.message);
      
      if (orderData) {
        // Mark the valuation as premium_unlocked if there's a paid order but the flag isn't set yet
        await req.supabaseClient
          .from('valuations')
          .update({ premium_unlocked: true })
          .eq('id', valuationId);
        
        return new Response(
          JSON.stringify({ already_unlocked: true, message: 'Premium features already unlocked' }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    
    // Prepare data for Stripe session
    const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
    const price = 2999; // $29.99 in cents
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Valuation Report',
              description: 'Comprehensive vehicle valuation with CARFAX history, forecast, and dealer offers',
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium${valuationId ? `?id=${valuationId}` : ''}`,
      metadata: {
        valuationId: valuationId || '',
      },
    });
    
    // If we have a valuationId, create a pending order record
    if (valuationId) {
      // Get user info from the JWT token
      const { data: { user } } = await req.supabaseClient.auth.getUser();
      
      if (user) {
        // Create an order record with 'pending' status
        await req.supabaseClient
          .from('orders')
          .insert({
            user_id: user.id,
            valuation_id: valuationId,
            amount: price,
            status: 'pending',
            stripe_session_id: session.id,
          });
      }
    }
    
    // Return the checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
