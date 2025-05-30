
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { fetchCraigslistListings } from './scrapers/craigslist.ts'
import { fetchFacebookMarketplaceListings } from './scrapers/facebook.ts'
import { fetchEbayMotorsListings } from './scrapers/ebay.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || 'toyota camry'
    const zipCode = searchParams.get('zip') || '95814'
    const platform = searchParams.get('platform') || 'craigslist'

    console.log(`🔍 Fetching marketplace data: ${platform} - ${query} in ${zipCode}`)

    let listings: any[] = []

    switch (platform.toLowerCase()) {
      case 'craigslist':
        listings = await fetchCraigslistListings(query, zipCode)
        break
      case 'facebook':
        listings = await fetchFacebookMarketplaceListings(query, zipCode)
        break
      case 'ebay':
        listings = await fetchEbayMotorsListings(query, zipCode)
        break
      default:
        throw new Error(`Platform ${platform} not implemented yet`)
    }

    console.log(`📊 Found ${listings.length} listings`)

    // Insert listings into database
    if (listings.length > 0) {
      const { data, error } = await supabase
        .from('scraped_listings')
        .upsert(listings, {
          onConflict: 'url',
          ignoreDuplicates: false
        })

      if (error) {
        console.error('❌ Database insert error:', error)
        throw error
      }

      console.log(`✅ Successfully inserted ${listings.length} listings`)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: listings.length,
      platform,
      query,
      zipCode
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('💥 fetch-marketplace-data failed:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
