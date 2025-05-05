
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

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
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set up Supabase client with auth context from the request
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { valuationId } = await req.json();
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: valuationId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user has access to the requested valuation
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('id, premium_unlocked')
      .eq('id', valuationId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (valuationError) {
      console.error('Error fetching valuation:', valuationError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify valuation access' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!valuation) {
      return new Response(
        JSON.stringify({ error: 'Valuation not found or not owned by user' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if premium is already unlocked
    if (valuation.premium_unlocked) {
      return new Response(
        JSON.stringify({ already_unlocked: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if there's already a completed order for this valuation
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('valuation_id', valuationId)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .maybeSingle();

    if (orderError) {
      console.error('Error checking existing orders:', orderError);
    }

    if (existingOrder) {
      // Update the valuation to mark premium as unlocked
      const { error: updateError } = await supabase
        .from('valuations')
        .update({ premium_unlocked: true })
        .eq('id', valuationId);
      
      if (updateError) {
        console.error('Error updating valuation premium status:', updateError);
      }
      
      return new Response(
        JSON.stringify({ already_unlocked: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set up Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured on the server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Create a new pending order in the database
    const { data: order, error: createOrderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        valuation_id: valuationId,
        amount: 2999, // $29.99 in cents
        status: 'pending'
      })
      .select()
      .single();

    if (createOrderError) {
      console.error('Error creating order:', createOrderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Define success and cancel URLs
    const baseUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:3000';
    const successUrl = `${baseUrl}/valuation/premium-success?session_id={CHECKOUT_SESSION_ID}&valuation_id=${valuationId}`;
    const cancelUrl = `${baseUrl}/valuation/premium?id=${valuationId}&canceled=true`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Valuation Report',
              description: 'Full access to detailed vehicle condition assessment and market data',
            },
            unit_amount: 2999, // $29.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: order.id,
      metadata: {
        user_id: user.id,
        valuation_id: valuationId,
        order_id: order.id
      },
    });

    // Update the order with the Stripe session ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Stripe session ID:', updateError);
    }

    // Return the checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
