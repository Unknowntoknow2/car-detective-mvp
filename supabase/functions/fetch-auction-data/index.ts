
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
}

// Helper functions for each auction source
async function fetchBidCarsData(vin: string): Promise<any[]> {
  try {
    console.log(`🚗 Fetching Bid.Cars data for VIN: ${vin}`)
    const response = await fetch(`https://api.bid.cars/api/v1/search?q=${vin}`)
    
    if (!response.ok) {
      console.warn(`Bid.Cars API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const records = (data.results || []).map((item: any) => ({
      vin: item.vin || vin,
      auction_source: 'Bid.Cars',
      price: item.price || '0',
      sold_date: item.auctionDate || new Date().toISOString().split('T')[0],
      odometer: item.odometer || '0',
      condition_grade: item.condition || null,
      location: item.location || null,
      photo_urls: item.images ? [item.images[0]] : [],
      source_priority: 1
    }))

    console.log(`✅ Found ${records.length} Bid.Cars records`)
    return records
  } catch (error) {
    console.error('❌ Bid.Cars fetch failed:', error)
    return []
  }
}

async function fetchSTATVinData(vin: string): Promise<any[]> {
  try {
    console.log(`📊 Fetching STAT.vin data for VIN: ${vin}`)
    
    // Call our existing STAT.vin Edge Function
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    const { data, error } = await supabase.functions.invoke('fetch-statvin-data', {
      body: { vin: vin.toUpperCase() }
    })

    if (error || !data || data.error) {
      console.warn('STAT.vin fetch failed:', error || data?.error)
      return []
    }

    // Transform STAT.vin data to our standard format
    const record = {
      vin: data.vin || vin,
      auction_source: 'STAT.vin',
      price: data.salePrice || data.sale_price || '0',
      sold_date: data.auctionDate || data.auction_date || data.sale_date || new Date().toISOString().split('T')[0],
      odometer: data.mileage || data.odometer || '0',
      condition_grade: data.condition || null,
      location: data.location || data.sale_location || null,
      photo_urls: data.images || data.photos || [],
      source_priority: 2
    }

    console.log(`✅ Found STAT.vin record`)
    return [record]
  } catch (error) {
    console.error('❌ STAT.vin fetch failed:', error)
    return []
  }
}

async function fetchAutoAuctionsData(vin: string): Promise<any[]> {
  try {
    console.log(`🏛️ Fetching AutoAuctions.io data for VIN: ${vin}`)
    
    // Currently returns empty array - can be upgraded to real scraping
    // TODO: Implement real AutoAuctions.io scraping when ready
    console.log(`ℹ️ AutoAuctions.io integration is scaffolded for future implementation`)
    return []
  } catch (error) {
    console.error('❌ AutoAuctions.io fetch failed:', error)
    return []
  }
}

async function fetchCopartData(vin: string): Promise<any[]> {
  try {
    console.log(`🔧 Fetching Copart data for VIN: ${vin}`)
    
    // Scaffolded for future implementation
    // TODO: Implement Copart scraping/API integration
    console.log(`ℹ️ Copart integration is scaffolded for future implementation`)
    return []
  } catch (error) {
    console.error('❌ Copart fetch failed:', error)
    return []
  }
}

async function fetchIAAIData(vin: string): Promise<any[]> {
  try {
    console.log(`🏭 Fetching IAAI data for VIN: ${vin}`)
    
    // Scaffolded for future implementation
    // TODO: Implement IAAI scraping/API integration
    console.log(`ℹ️ IAAI integration is scaffolded for future implementation`)
    return []
  } catch (error) {
    console.error('❌ IAAI fetch failed:', error)
    return []
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vin } = await req.json()

    if (!vin || typeof vin !== 'string') {
      return new Response(
        JSON.stringify({ error: 'VIN is required and must be a string' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`🎯 Starting auction data aggregation for VIN: ${vin}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch from all auction sources in parallel
    const sources = await Promise.allSettled([
      fetchBidCarsData(vin),
      fetchSTATVinData(vin),
      fetchAutoAuctionsData(vin),
      fetchCopartData(vin),
      fetchIAAIData(vin)
    ])

    // Collect all successful results
    const auctionResults = sources
      .filter((result): result is PromiseFulfilledResult<any[]> => 
        result.status === 'fulfilled' && Array.isArray(result.value)
      )
      .flatMap(result => result.value)
      .filter(record => record && record.vin) // Filter out invalid records

    console.log(`📊 Collected ${auctionResults.length} total auction records`)

    // Insert/update records in database
    let successCount = 0
    let errorCount = 0

    for (const result of auctionResults) {
      try {
        const { error } = await supabase
          .from('auction_results_by_vin')
          .upsert({
            vin: result.vin,
            auction_source: result.auction_source,
            price: result.price,
            sold_date: result.sold_date,
            odometer: result.odometer,
            condition_grade: result.condition_grade,
            location: result.location,
            photo_urls: result.photo_urls || [],
            source_priority: result.source_priority || 5,
            fetched_at: new Date().toISOString()
          }, {
            onConflict: 'vin,auction_source,sold_date'
          })

        if (error) {
          console.error(`❌ Failed to upsert auction record:`, error)
          errorCount++
        } else {
          successCount++
        }
      } catch (insertError) {
        console.error(`❌ Insert error for auction record:`, insertError)
        errorCount++
      }
    }

    console.log(`✅ Auction data aggregation complete: ${successCount} inserted, ${errorCount} errors`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        totalRecords: auctionResults.length,
        inserted: successCount,
        errors: errorCount,
        sources: {
          'Bid.Cars': auctionResults.filter(r => r.auction_source === 'Bid.Cars').length,
          'STAT.vin': auctionResults.filter(r => r.auction_source === 'STAT.vin').length,
          'AutoAuctions.io': auctionResults.filter(r => r.auction_source === 'AutoAuctions.io').length,
          'Copart': auctionResults.filter(r => r.auction_source === 'Copart').length,
          'IAAI': auctionResults.filter(r => r.auction_source === 'IAAI').length
        }
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('🚨 Master auction fetch failed:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during auction data aggregation',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
