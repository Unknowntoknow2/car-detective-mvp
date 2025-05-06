
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response(
      JSON.stringify({ error: "Missing signature or webhook secret" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Get the request body as text for verification
    const body = await req.text();
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`Processing webhook event: ${event.type}`);

    // Handle the event type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Get the valuationId from the session metadata
        const valuationId = session.metadata?.valuationId;
        const sessionId = session.id;
        
        console.log(`Payment successful for valuation: ${valuationId}`);
        
        if (valuationId && sessionId) {
          // Update the order status to 'paid'
          const { error: orderError } = await req.supabaseClient
            .from('orders')
            .update({ 
              status: 'paid',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_session_id', sessionId);
          
          if (orderError) {
            console.error("Error updating order:", orderError);
            throw new Error(orderError.message);
          }
          
          console.log(`Updated order status to paid for session: ${sessionId}`);
          
          // Update the valuation's premium_unlocked status
          const { error: valuationError } = await req.supabaseClient
            .from('valuations')
            .update({ premium_unlocked: true })
            .eq('id', valuationId);
          
          if (valuationError) {
            console.error("Error updating valuation:", valuationError);
            throw new Error(valuationError.message);
          }
          
          console.log(`Set premium_unlocked to true for valuation: ${valuationId}`);
        } else {
          console.error("Missing valuationId or sessionId in webhook data");
        }
        
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const sessionId = paymentIntent.metadata?.stripe_session_id;
        
        console.error(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
        
        if (sessionId) {
          // Update order status to 'failed'
          const { error: orderError } = await req.supabaseClient
            .from('orders')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_session_id', sessionId);
          
          if (orderError) {
            console.error("Error updating order status to failed:", orderError);
          }
        }
        
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
