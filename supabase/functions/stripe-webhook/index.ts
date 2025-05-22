
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
    let customerId = null;
    let creditsToAdd = 0;
    let valuationId = null;
    let metadata = null;
    let sessionId = null;
    let productName = '';
    let amount = 0;
    
    // For subscriptions and invoices, we need to lookup by customer id
    
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        sessionId = session.id;
        
        // Get the user ID from the session metadata
        userId = session.metadata?.user_id;
        customerId = session.customer;
        metadata = session.metadata || {};
        valuationId = metadata.valuation_id;
        
        console.log(`Checkout completed for user: ${userId}, customer: ${customerId}`);
        
        // Extract product details from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        if (lineItems.data.length > 0) {
          const item = lineItems.data[0];
          productName = item.description || 'Premium Report';
          amount = item.amount_total || 0;
          
          // Determine credits to add based on product name or metadata
          if (metadata.credits) {
            creditsToAdd = parseInt(metadata.credits, 10) || 1;
          } else if (productName.includes('Bundle of 5')) {
            creditsToAdd = 5;
          } else if (productName.includes('Bundle of 3')) {
            creditsToAdd = 3;
          } else {
            creditsToAdd = 1; // Default to 1 credit for single reports
          }
        }
        
        // If we have a subscription, let's get the current period end
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
        } else {
          // Default to 12 months if no subscription (for credits)
          expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
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
      
      // Handle premium credits if applicable
      if (creditsToAdd > 0) {
        // Check if user already has premium credits
        const { data: existingCredits, error: creditsError } = await req.supabaseClient
          .from('premium_credits')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (creditsError && creditsError.code !== 'PGRST116') { // Not just "no rows" error
          console.error("Error checking premium credits:", creditsError);
        } else {
          const currentCredits = existingCredits?.remaining_credits || 0;
          const newCredits = currentCredits + creditsToAdd;
          
          // Upsert premium credits
          const { error: upsertError } = await req.supabaseClient
            .from('premium_credits')
            .upsert({
              user_id: userId,
              remaining_credits: newCredits,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            
          if (upsertError) {
            console.error("Error updating premium credits:", upsertError);
          } else {
            console.log(`Successfully added ${creditsToAdd} credits for user: ${userId}, new total: ${newCredits}`);
          }
          
          // If there's a specific valuation, mark it as premium unlocked
          if (valuationId && valuationId !== '') {
            // Insert into premium_valuations to track the specific access
            await req.supabaseClient.from('premium_valuations').upsert({
              user_id: userId,
              valuation_id: valuationId,
              created_at: new Date().toISOString()
            });
            
            // Optionally update the valuation record itself
            await req.supabaseClient.from('valuations').update({ 
              premium_unlocked: true
            }).eq('id', valuationId);
          }
          
          // Record the transaction
          const { error: transactionError } = await req.supabaseClient
            .from('premium_transactions')
            .insert({
              user_id: userId,
              valuation_id: valuationId || null,
              type: 'bundle',
              stripe_session_id: sessionId,
              amount: amount / 100, // Convert cents to dollars
              quantity: creditsToAdd,
              product_name: productName
            });
            
          if (transactionError) {
            console.error("Error recording transaction:", transactionError);
          }
        }
      }
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
