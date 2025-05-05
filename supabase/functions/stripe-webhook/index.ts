
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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured on the server' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Get the stripe signature from the request header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('stripe-signature header is missing');
      return new Response(
        JSON.stringify({ error: 'stripe-signature header is missing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the webhook secret from the environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return new Response(
        JSON.stringify({ error: 'Webhook secret is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the raw request body
    const body = await req.text();

    // Construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received Stripe webhook event: ${event.type}`);

    // Set up Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Stripe checkout completed:', session.id);

        try {
          // Get the order details
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', session.id)
            .single();

          if (orderError) {
            console.error('Error fetching order:', orderError);
            return new Response(
              JSON.stringify({ error: 'Order not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }

          // Update the order status
          const { error: updateOrderError } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id);

          if (updateOrderError) {
            console.error('Error updating order status:', updateOrderError);
            return new Response(
              JSON.stringify({ error: 'Failed to update order status' }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
          }

          // Mark the valuation as premium
          const { error: updateValuationError } = await supabase
            .from('valuations')
            .update({ premium_unlocked: true })
            .eq('id', order.valuation_id);

          if (updateValuationError) {
            console.error('Error updating valuation:', updateValuationError);
            return new Response(
              JSON.stringify({ error: 'Failed to update valuation' }),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
          }

          console.log(`Premium access unlocked for valuation: ${order.valuation_id}`);
        } catch (err) {
          console.error('Error processing Stripe webhook:', err);
          return new Response(
            JSON.stringify({ error: 'Error processing webhook' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a success response
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in stripe-webhook function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
