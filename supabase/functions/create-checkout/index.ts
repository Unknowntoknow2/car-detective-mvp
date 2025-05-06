
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
  console.log("Edge function create-checkout called");
  
  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    const { valuationId } = requestData;
    
    console.log("Request data:", { valuationId });
    
    if (!valuationId) {
      console.error("Missing valuationId in request");
      return new Response(
        JSON.stringify({ error: 'Missing valuationId parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Get the authenticated user's ID from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Check if the user already has premium access to this valuation
    try {
      const { data: valuationData, error: valuationError } = await req.supabaseClient
        .from('valuations')
        .select('premium_unlocked, user_id')
        .eq('id', valuationId)
        .maybeSingle();
      
      if (valuationError) {
        console.error("Error checking valuation:", valuationError.message);
        throw new Error(valuationError.message);
      }
      
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
      
      if (orderError) {
        console.error("Error checking order:", orderError.message);
        throw new Error(orderError.message);
      }
      
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
    } catch (err) {
      console.error("Error in valuation check:", err.message);
      // Continue to create checkout rather than failing completely
    }
    
    // Get user info from the JWT token
    const { data: { user }, error: userError } = await req.supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Prepare data for Stripe session
    const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
    const price = 2999; // $29.99 in cents
    
    // Create a Stripe checkout session
    try {
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
        success_url: `${baseUrl}/premium-success?session_id={CHECKOUT_SESSION_ID}&valuation_id=${valuationId}`,
        cancel_url: `${baseUrl}/valuation/premium?id=${valuationId}`,
        metadata: {
          valuationId: valuationId || '',
          userId: user.id
        },
      });
      
      // Create an order record with 'pending' status
      const { error: insertError } = await req.supabaseClient
        .from('orders')
        .insert({
          user_id: user.id,
          valuation_id: valuationId,
          amount: price,
          status: 'pending',
          stripe_session_id: session.id,
        });
          
      if (insertError) {
        console.error("Error creating order record:", insertError.message);
        // Continue anyway as the checkout can still proceed
      } else {
        console.log("Created pending order for session:", session.id);
      }
      
      // Return the checkout URL
      return new Response(
        JSON.stringify({ url: session.url }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (stripeError) {
      console.error('Stripe error:', stripeError.message);
      if (stripeError.raw) {
        console.error('Stripe raw error:', stripeError.raw.message);
      }
      
      return new Response(
        JSON.stringify({ error: stripeError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  } catch (error) {
    console.error('General error in create-checkout:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
