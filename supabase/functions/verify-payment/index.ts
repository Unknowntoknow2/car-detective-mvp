
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

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
    const bundle = parseInt(session.metadata?.bundle || '1', 10);
    const valuationId = session.metadata?.valuation_id;
    const isSubscription = session.metadata?.is_subscription === 'true';
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid session: missing user ID" }),
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
      
      // If there's a specific valuation, mark it as premium unlocked
      if (valuationId && valuationId !== '') {
        // Insert into premium_valuations to track the specific access
        await serviceClient.from('premium_valuations').upsert({
          user_id: userId,
          valuation_id: valuationId,
          created_at: new Date().toISOString()
        });
        
        // Optionally update the valuation record itself
        await serviceClient.from('valuations').update({ 
          premium_unlocked: true
        }).eq('id', valuationId);
      }
      
      if (isSubscription) {
        // Handle subscription purchase
        // Set expiration date to 12 months from now
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // Monthly subscription
        
        // Update profile for dealer subscription
        await serviceClient.from('profiles').update({
          is_premium_dealer: true,
          premium_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        }).eq('id', userId);
      } else {
        // Handle one-time purchase (credits)
        // Check if user already has premium access
        const { data: existingAccess } = await serviceClient
          .from('premium_credits')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (existingAccess && existingAccess.length > 0) {
          // Add credits to existing access
          const currentCredits = existingAccess[0].remaining_credits || 0;
          const newCredits = currentCredits + bundle;
          
          // Update with new credits and potentially extend expiration
          await serviceClient.from('premium_credits').update({
            remaining_credits: newCredits,
            updated_at: new Date().toISOString()
          }).eq('id', existingAccess[0].id);
        } else {
          // Create new premium access record
          await serviceClient.from('premium_credits').insert({
            user_id: userId,
            remaining_credits: bundle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentSucceeded: true,
          bundle,
          isSubscription,
          valuationId: valuationId || null
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
          valuationId: valuationId || null
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
