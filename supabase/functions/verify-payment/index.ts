
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Initialize Stripe with the secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Get the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Create a service role client for database operations
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user ID and valuation ID from the session metadata
    const userId = session.metadata?.user_id;
    const valuationId = session.metadata?.valuation_id;
    
    if (!userId || !valuationId) {
      return new Response(
        JSON.stringify({ error: "Invalid session: missing user or valuation ID" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check payment status
    if (session.payment_status === 'paid') {
      // Update the order status
      await serviceClient.from('orders').update({ 
        status: 'paid'
      }).eq('stripe_session_id', sessionId);
      
      // Update the valuation record to mark premium as unlocked
      await serviceClient.from('valuations').update({ 
        premium_unlocked: true
      }).eq('id', valuationId);
      
      // Update the user's profile to extend premium access
      // Set premium expiration to 30 days from now for this one-time purchase
      const premiumExpiresAt = new Date();
      premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30);
      
      await serviceClient.from('profiles').update({
        premium_expires_at: premiumExpiresAt.toISOString()
      }).eq('id', userId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentSucceeded: true,
          valuationId
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else {
      // Update the order status to match Stripe's status
      await serviceClient.from('orders').update({ 
        status: session.payment_status
      }).eq('stripe_session_id', sessionId);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          paymentSucceeded: false,
          status: session.payment_status,
          valuationId
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
