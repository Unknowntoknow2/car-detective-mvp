
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
    let userId = null;
    let expiresAt = null;
    
    // For subscriptions and invoices, we need to lookup by customer id
    let customerId = null;
    
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Get the user ID from the session metadata
        userId = session.metadata?.user_id;
        customerId = session.customer;
        
        console.log(`Checkout completed for user: ${userId}, customer: ${customerId}`);
        
        // If we have a subscription, let's get the current period end
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
        } else {
          // Default to 30 days if no subscription (for one-time purchases)
          expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }
        
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        customerId = subscription.customer;
        
        // Get the user ID from the customer ID
        const { data, error } = await req.supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
          
        if (error) {
          console.error("Error finding user by customer ID:", error);
        } else if (data) {
          userId = data.id;
          console.log(`Subscription updated for user: ${userId}`);
          
          // Get the new expiration date
          expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
        }
        
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        customerId = subscription.customer;
        
        // Get the user ID from the customer ID
        const { data, error } = await req.supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
          
        if (error) {
          console.error("Error finding user by customer ID:", error);
        } else if (data) {
          userId = data.id;
          console.log(`Subscription canceled for user: ${userId}`);
          
          // Update the profile to remove premium status
          const { error: updateError } = await req.supabaseClient
            .from('profiles')
            .update({
              is_premium_dealer: false,
              premium_expires_at: null
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error("Error updating user profile:", updateError);
          } else {
            console.log(`Successfully removed premium status for user: ${userId}`);
          }
        }
        
        break;
      }
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Update the user's premium status if we have a user ID and expiration date
    if (userId && expiresAt) {
      // Store customer ID if available, to link future webhook events
      const updateData: any = {
        is_premium_dealer: true,
        premium_expires_at: expiresAt
      };
      
      if (customerId) {
        updateData.stripe_customer_id = customerId;
      }
      
      const { error } = await req.supabaseClient
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
      
      console.log(`Successfully updated premium status for user: ${userId}, expires: ${expiresAt}`);
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
