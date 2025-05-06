
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
    const { sessionId } = await req.json();
    
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
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });
    
    // Fetch the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check if the payment succeeded
    const paymentSucceeded = session.payment_status === 'paid';
    
    // If payment succeeded, update the database
    if (paymentSucceeded && session.metadata?.valuationId) {
      try {
        // Update valuation to mark premium as unlocked
        const { error: updateError } = await req.supabaseClient
          .from('valuations')
          .update({ premium_unlocked: true })
          .eq('id', session.metadata.valuationId);
          
        if (updateError) {
          console.error("Error updating valuation premium status:", updateError);
        }
        
        // Update order status to 'paid' if it exists
        const { error: orderError } = await req.supabaseClient
          .from('orders')
          .update({ status: 'paid' })
          .eq('stripe_session_id', sessionId);
          
        if (orderError) {
          console.error("Error updating order status:", orderError);
        }
      } catch (dbError) {
        console.error("Database update error:", dbError);
        // We still return success:true since payment was successful
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentSucceeded,
        paymentStatus: session.payment_status,
        valuationId: session.metadata?.valuationId || null
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
