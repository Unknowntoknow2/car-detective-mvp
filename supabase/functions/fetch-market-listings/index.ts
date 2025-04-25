
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { zipCode, make, model, year } = await req.json()

    if (!zipCode) {
      return new Response(JSON.stringify({ error: 'ZIP Code is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Mock market listings data
    const mockMarketListings = {
      'Facebook Marketplace': 24500,
      'Craigslist': 23800,
      'OfferUp': 25100,
      'Carvana': 26000
    }

    // Note: In a real implementation, you'd query actual market data sources
    const { error } = await supabase
      .from('market_listings')
      .insert(
        Object.entries(mockMarketListings).map(([source, price]) => ({
          source,
          price,
          valuation_id: null,  // You'd link this to a specific valuation in production
          url: `https://mock-marketplace.com/${source.toLowerCase()}`
        }))
      )

    if (error) throw error

    return new Response(JSON.stringify({ 
      zipCode, 
      averages: mockMarketListings,
      sources: {
        'Facebook Marketplace': `https://www.facebook.com/marketplace/search/?query=${make}%20${model}%20${year}`,
        'Craigslist': `https://craigslist.org/search/cta?query=${make}%20${model}%20${year}`,
        'OfferUp': `https://offerup.com/search/?q=${make}%20${model}%20${year}`,
        'Carvana': `https://www.carvana.com/vehicles/${make}-${model}-${year}`
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Market listings fetch error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
