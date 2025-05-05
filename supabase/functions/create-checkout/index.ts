
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Extract request body
    const { valuationId } = await req.json();
    
    if (!valuationId) {
      throw new Error('Valuation ID is required');
    }
    
    console.log(`Creating checkout session for valuation: ${valuationId}`);
    
    // Get user information from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated: ' + (userError?.message || 'Unknown error'));
    }
    
    console.log(`Authenticated user: ${user.id}`);
    
    // Get the valuation details
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .eq('user_id', user.id)
      .single();
      
    if (valuationError || !valuation) {
      throw new Error('Valuation not found or access denied: ' + (valuationError?.message || 'Unknown error'));
    }
    
    // Check if premium is already unlocked
    if (valuation.premium_unlocked) {
      return new Response(
        JSON.stringify({ 
          already_unlocked: true, 
          message: "Premium is already unlocked for this valuation" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    console.log(`Validated valuation: ${valuationId}`);
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Product metadata
    const productName = `Premium Vehicle Report: ${valuation.year} ${valuation.make} ${valuation.model}`;
    const productPrice = 2999; // $29.99 in cents
    
    console.log(`Creating checkout session for product: ${productName}`);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'Comprehensive vehicle valuation report with CARFAX data and market analysis',
            },
            unit_amount: productPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/valuation/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/premium?canceled=true`,
      metadata: {
        valuationId,
        userId: user.id,
      },
    });
    
    console.log(`Created checkout session: ${session.id}`);
    
    // Create an order record in the database
    const { error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          valuation_id: valuationId,
          amount: productPrice,
          stripe_session_id: session.id,
          status: 'pending',
        },
      ]);
      
    if (orderError) {
      console.error('Error saving order:', orderError);
      // Still continue, as the webhook will handle the actual confirmation
    }
    
    // Return the checkout session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
