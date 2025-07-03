
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://cdn.skypack.dev/stripe@14.21.0";

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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
        metadata: {
          user_id: user.id,
        },
      });

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
    }
  } catch (error) {
    console.error("General error in create-checkout:", error.message);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
