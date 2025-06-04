<<<<<<< HEAD

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
=======
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
<<<<<<< HEAD
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client using the anon key (for auth) and service role (for database ops)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get request body
    const { product, valuationId, successUrl, cancelUrl, isSubscription = false } = await req.json();
    
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      throw userError;
    }
    
    const user = userData.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a customer already exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
=======
  console.log("Edge function create-checkout called");

  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    const { plan } = requestData;

    console.log("Request data:", { plan });

    // Get the authenticated user's ID from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Get user info from the JWT token
    const { data: { user }, error: userError } = await req.supabaseClient.auth
      .getUser();

    if (userError || !user) {
      console.error(
        "Authentication error:",
        userError?.message || "No user found",
      );
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Check if user already has an active subscription
    const { data: profileData, error: profileError } = await req.supabaseClient
      .from("profiles")
      .select("is_premium_dealer, premium_expires_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error checking profile:", profileError.message);
      return new Response(
        JSON.stringify({ error: "Error checking subscription status" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // If user already has an active subscription that hasn't expired, redirect to manage page
    if (
      profileData?.is_premium_dealer &&
      profileData?.premium_expires_at &&
      new Date(profileData.premium_expires_at) > new Date()
    ) {
      // Instead of returning an error, we'll create a billing portal session
      // to let them manage their existing subscription
      try {
        // Find the Stripe customer by email
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });

        if (customers.data.length === 0) {
          throw new Error("No existing subscription found");
        }

        const baseUrl = req.headers.get("origin") || "http://localhost:3000";
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customers.data[0].id,
          return_url: `${baseUrl}/dealer-dashboard`,
        });

        return new Response(
          JSON.stringify({ url: portalSession.url }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (error) {
        console.log(
          "No existing customer found, creating new checkout session",
        );
        // Continue to create a new checkout session if there's no customer
      }
    }

    // Determine pricing based on plan
    // Default to monthly plan
    let priceId = "price_monthly";
    let interval = "month";
    let intervalCount = 1;

    if (plan === "yearly") {
      interval = "year";
      intervalCount = 1;
    }

    // Prepare data for Stripe session
    const baseUrl = req.headers.get("origin") || "http://localhost:3000";
    const price = plan === "yearly" ? 14900 : 1499; // $149/year or $14.99/month in cents

    // Create a Stripe checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium Dealer Subscription",
                description: `Access to premium dealer features (${plan} plan)`,
              },
              unit_amount: price,
              recurring: {
                interval: interval,
                interval_count: intervalCount,
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${baseUrl}/dealer-dashboard?subscription=success`,
        cancel_url: `${baseUrl}/dealer-dashboard?subscription=canceled`,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        metadata: {
          user_id: user.id,
        },
      });
<<<<<<< HEAD
      customerId = customer.id;
=======

      // Return the checkout URL
      return new Response(
        JSON.stringify({ url: session.url }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    } catch (stripeError) {
      console.error("Stripe error:", stripeError.message);

      return new Response(
        JSON.stringify({ error: stripeError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }

    // Prepare metadata
    const metadata = {
      user_id: user.id,
      bundle: product.credits.toString(),
      is_subscription: isSubscription.toString(),
    };

    if (valuationId) {
      metadata.valuation_id = valuationId;
    }

    // Create checkout session parameters
    const sessionParams = {
      customer: customerId,
      client_reference_id: user.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price,
            ...(isSubscription ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata,
      mode: isSubscription ? "subscription" : "payment",
      success_url: successUrl || `${req.headers.get("origin")}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/pricing?canceled=true`,
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Create order record in database
    await serviceClient.from('orders').insert({
      user_id: user.id,
      amount: product.price,
      stripe_session_id: session.id,
      valuation_id: valuationId || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
<<<<<<< HEAD
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
=======
    console.error("General error in create-checkout:", error.message);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    );
  }
});
