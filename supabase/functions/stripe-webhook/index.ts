
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: "Missing signature or webhook secret" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
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

    // Handle the event type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Get the valuationId from the session metadata
        const valuationId = session.metadata?.valuationId;
        
        if (valuationId) {
          // Update the order status to 'paid'
          const { error: orderError } = await req.supabaseClient
            .from('orders')
            .update({ status: 'paid' })
            .eq('stripe_session_id', session.id);
          
          if (orderError) {
            console.error("Error updating order:", orderError);
            throw new Error(orderError.message);
          }
          
          // Update the valuation's premium_unlocked status
          const { error: valuationError } = await req.supabaseClient
            .from('valuations')
            .update({ premium_unlocked: true })
            .eq('id', valuationId);
          
          if (valuationError) {
            console.error("Error updating valuation:", valuationError);
            throw new Error(valuationError.message);
          }
        }
        
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        
        console.error(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
        
        // Could update an order status to 'failed' here if we had the session ID
        
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
