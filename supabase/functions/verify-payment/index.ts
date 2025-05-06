
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

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
    const { sessionId, valuationId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing session ID' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    console.log(`Verifying payment for session: ${sessionId}, valuation: ${valuationId || 'none'}`);
    
    // First check the database for order status
    let paymentSucceeded = false;
    let orderData = null;
    
    try {
      const { data, error } = await req.supabaseClient
        .from('orders')
        .select('status, valuation_id, updated_at')
        .eq('stripe_session_id', sessionId)
        .maybeSingle();
      
      if (error) {
        console.error("Database error checking order:", error);
      } else if (data) {
        orderData = data;
        paymentSucceeded = data.status === 'paid';
        console.log(`Found order with status: ${data.status}`);
        
        // If we have a valuation ID and payment succeeded, double-check premium_unlocked flag
        if (paymentSucceeded && data.valuation_id) {
          const { data: valData, error: valError } = await req.supabaseClient
            .from('valuations')
            .select('premium_unlocked')
            .eq('id', data.valuation_id)
            .maybeSingle();
          
          if (valError) {
            console.error("Error checking valuation premium status:", valError);
          } else if (valData && !valData.premium_unlocked) {
            // If payment is successful but premium_unlocked is still false, update it
            console.log(`Fixing premium_unlocked flag for valuation: ${data.valuation_id}`);
            await req.supabaseClient
              .from('valuations')
              .update({ premium_unlocked: true })
              .eq('id', data.valuation_id);
          }
        }
      } else {
        console.log("No order found in database, checking Stripe API");
      }
    } catch (dbError) {
      console.error("Error querying database:", dbError);
    }
    
    // If we don't have a confirmed status from the database, check with Stripe API
    if (!orderData) {
      try {
        // Initialize Stripe
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
          apiVersion: "2022-11-15",
        });
        
        // Fetch the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Check if the payment succeeded
        paymentSucceeded = session.payment_status === 'paid';
        console.log(`Stripe API payment status: ${session.payment_status}`);
        
        // If payment succeeded and we have a valuation ID, update the database
        if (paymentSucceeded && (valuationId || session.metadata?.valuationId)) {
          const valId = valuationId || session.metadata?.valuationId;
          
          try {
            // Update valuation to mark premium as unlocked
            const { error: updateError } = await req.supabaseClient
              .from('valuations')
              .update({ premium_unlocked: true })
              .eq('id', valId);
              
            if (updateError) {
              console.error("Error updating valuation premium status:", updateError);
            } else {
              console.log(`Updated premium_unlocked for valuation: ${valId}`);
            }
            
            // Create or update order status
            const { error: orderError } = await req.supabaseClient
              .from('orders')
              .upsert({
                stripe_session_id: sessionId,
                valuation_id: valId,
                status: 'paid',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'stripe_session_id'
              });
              
            if (orderError) {
              console.error("Error updating order status:", orderError);
            }
          } catch (dbError) {
            console.error("Database update error:", dbError);
          }
        }
      } catch (stripeError) {
        console.error("Stripe API error:", stripeError);
        // We still respond with what we know
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentSucceeded,
        valuation_id: orderData?.valuation_id || valuationId || null,
        status: orderData?.status || (paymentSucceeded ? 'paid' : 'pending')
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error verifying payment' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
