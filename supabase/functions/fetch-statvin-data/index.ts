
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const STATVIN_API_KEY = Deno.env.get('STATVIN_API_KEY')

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Define types locally since we can't import from src
interface StatVinAuctionResult {
  vin: string
  price: string
  sold_date: string
  odometer: string
  condition_grade?: string
  location?: string
  auction_source: string
  photo_urls: string[]
  fetched_at: string
}

interface StatVinApiResponse {
  success: boolean
  data?: {
    auctions?: Array<{
      saleDate: string
      source: string
      price: string
      odometer: string
      location: string
      condition: string
      photos: string[]
      lot?: string
      damage?: string
    }>
  }
  message?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vin, debug = false } = await req.json()
    
    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`🔍 Processing STAT.vin request for VIN: ${vin}`)

    // Check if STAT.vin API key is available
    if (!STATVIN_API_KEY) {
      console.log('❌ STATVIN_API_KEY not configured, cannot fetch real data')
      return new Response(
        JSON.stringify({ 
          error: 'STATVIN_API_KEY not configured',
          vin: vin,
          status: 'api_key_missing'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Make real API call to STAT.vin
    console.log(`📡 Calling STAT.vin API for VIN: ${vin}`)
    
    try {
      const statVinResponse = await fetch(
        `https://api.stat.vin/v2/history/${vin}?key=${STATVIN_API_KEY}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CarDetective/1.0'
          }
        }
      )

      if (!statVinResponse.ok) {
        console.error(`❌ STAT.vin API error: ${statVinResponse.status} ${statVinResponse.statusText}`)
        
        return new Response(
          JSON.stringify({ 
            error: 'STAT.vin API request failed',
            status_code: statVinResponse.status,
            vin: vin
          }),
          { 
            status: 502, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const apiData: StatVinApiResponse = await statVinResponse.json()
      
      if (!apiData.success || !apiData.data?.auctions?.length) {
        console.log(`ℹ️ No auction data found for VIN: ${vin}`)
        
        // Still save to enrichment cache that we checked this VIN
        await supabase.from('auction_enrichment_by_vin').upsert({
          vin: vin.toUpperCase(),
          source: 'statvin_api',
          data: { checked_at: new Date().toISOString(), results: [] },
          updated_at: new Date().toISOString()
        })

        return new Response(
          JSON.stringify({ 
            success: true,
            vin: vin,
            message: 'No auction history found for this VIN',
            count: 0
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Normalize the auction data
      const normalizedResults: StatVinAuctionResult[] = apiData.data.auctions.map(auction => ({
        vin: vin.toUpperCase(),
        price: auction.price || '0',
        sold_date: auction.saleDate || new Date().toISOString().split('T')[0],
        odometer: auction.odometer || '0',
        condition_grade: auction.condition || 'Unknown',
        location: auction.location || 'Unknown',
        auction_source: auction.source || 'STAT.vin',
        photo_urls: auction.photos || [],
        fetched_at: new Date().toISOString()
      }))

      console.log(`✅ Successfully normalized ${normalizedResults.length} auction records`)

      // Insert into auction_results_by_vin table
      const { error: insertError } = await supabase
        .from('auction_results_by_vin')
        .upsert(normalizedResults, {
          onConflict: 'vin,sold_date'
        })

      if (insertError) {
        console.error('❌ Error inserting auction results:', insertError)
        return new Response(
          JSON.stringify({ 
            error: 'Database insert failed',
            details: insertError.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Cache the enrichment data
      const { error: cacheError } = await supabase
        .from('auction_enrichment_by_vin')
        .upsert({
          vin: vin.toUpperCase(),
          source: 'statvin_api',
          data: {
            fetched_at: new Date().toISOString(),
            api_response: apiData,
            normalized_count: normalizedResults.length
          },
          updated_at: new Date().toISOString()
        })

      if (cacheError) {
        console.error('❌ Error caching enrichment data:', cacheError)
        // Don't fail the request for cache errors
      }

      const response = {
        success: true,
        vin: vin,
        message: `Fetched ${normalizedResults.length} auction records from STAT.vin`,
        count: normalizedResults.length,
        source: 'statvin_api',
        fetched_at: new Date().toISOString()
      }

      // Include results in debug mode
      if (debug) {
        response.results = normalizedResults
      }

      console.log(`🎯 Successfully processed VIN ${vin}: ${normalizedResults.length} records`)

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (apiError) {
      console.error('❌ STAT.vin API call failed:', apiError)
      
      return new Response(
        JSON.stringify({ 
          error: 'STAT.vin API call failed',
          details: apiError.message,
          vin: vin
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('❌ Fatal error in fetch-statvin-data function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
