
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
    const { bundle = 1, valuationId, successUrl, cancelUrl } = await req.json();
    
    // Initialize Stripe with the secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Get the authenticated user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check if the user has the 'individual' role
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user profile" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (profileData.role !== 'individual' && profileData.role !== 'user') {
      return new Response(
        JSON.stringify({ error: "This premium upgrade is only for individual users" }),
        { 
          status: 403, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Set product name and price based on bundle
    let productName = 'Premium Valuation';
    let unitAmount = 1999; // $19.99
    
    if (bundle === 3) {
      productName = '3-Pack Premium Valuations';
      unitAmount = 4999; // $49.99
    } else if (bundle === 5) {
      productName = '5-Pack Premium Valuations';
      unitAmount = 7999; // $79.99
    }
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: `${bundle} premium valuation credit${bundle !== 1 ? 's' : ''}`
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/premium?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/premium`,
      metadata: {
        user_id: user.id,
        bundle: bundle.toString(),
        valuation_id: valuationId || '',
        type: 'individual'
      },
      customer_email: user.email,
    });
    
    // Create a service role client to write to the orders table
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Create an order record
    await serviceClient.from('orders').insert({
      user_id: user.id,
      valuation_id: valuationId || null,
      stripe_session_id: session.id,
      amount: unitAmount,
      status: 'pending'
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
