
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

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
  })

  // Create Supabase client with service role key for admin privileges to bypass RLS
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Get the Stripe signature from the request headers
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      throw new Error('No Stripe signature found')
    }
    
    // Get the raw request body
    const body = await req.text()
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    console.log(`Processing Stripe event: ${event.type}`)
    
    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      
      console.log('Checkout session completed:', session.id)
      
      // Update the order status in the database
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'completed' })
        .eq('stripe_session_id', session.id)
        .select('valuation_id, user_id')
        .single()
      
      if (orderError) {
        console.error('Error updating order:', orderError)
        throw new Error('Failed to update order')
      }
      
      if (!orderData?.valuation_id) {
        console.error('No valuation ID found in order')
        throw new Error('Invalid order data')
      }
      
      console.log(`Updating premium status for valuation: ${orderData.valuation_id}`)
      
      // Update the valuation to mark it as premium unlocked
      const { error: valuationError } = await supabaseAdmin
        .from('valuations')
        .update({ premium_unlocked: true })
        .eq('id', orderData.valuation_id)
        .eq('user_id', orderData.user_id)
      
      if (valuationError) {
        console.error('Error updating valuation:', valuationError)
        throw new Error('Failed to update valuation premium status')
      }
      
      console.log('Order marked as completed and premium unlocked for valuation:', orderData.valuation_id)
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
