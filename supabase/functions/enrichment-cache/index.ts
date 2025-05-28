
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple StatVin data fetcher (mock implementation for now)
async function fetchStatVinData(vin: string) {
  console.log(`Fetching StatVin data for VIN: ${vin}`)
  
  // Mock data structure - in production this would call real StatVin API
  return {
    vin,
    statVinData: {
      auctionHistory: [
        {
          date: '2024-01-15',
          price: 25000,
          location: 'Manheim Dallas',
          condition: 'Run and Drive',
          mileage: 45000
        }
      ],
      damageHistory: [
        {
          type: 'Minor',
          location: 'Front Bumper',
          severity: 'Light'
        }
      ],
      titleHistory: [
        {
          state: 'TX',
          type: 'Clean',
          date: '2023-12-01'
        }
      ]
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { vin, source = 'statvin' } = await req.json()
    
    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing enrichment request for VIN: ${vin}, source: ${source}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check cache first (24-hour freshness)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: cached, error: cacheError } = await supabase
      .from('auction_enrichment_by_vin')
      .select('*')
      .eq('vin', vin)
      .eq('source', source)
      .gt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cached && !cacheError) {
      console.log(`Cache hit for VIN: ${vin}`)
      return new Response(
        JSON.stringify({ 
          data: cached.data, 
          cached: true, 
          lastUpdated: cached.created_at 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Cache miss for VIN: ${vin}, fetching fresh data`)

    // Fetch fresh data
    let enrichedData
    if (source === 'statvin') {
      enrichedData = await fetchStatVinData(vin)
    } else {
      throw new Error(`Unsupported source: ${source}`)
    }

    if (!enrichedData) {
      return new Response(
        JSON.stringify({ error: 'No enrichment data found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store in cache
    const { error: insertError } = await supabase
      .from('auction_enrichment_by_vin')
      .insert([{ 
        vin, 
        source, 
        data: enrichedData 
      }])

    if (insertError) {
      console.error('Cache insert error:', insertError)
      // Continue anyway, just return the data without caching
    }

    return new Response(
      JSON.stringify({ 
        data: enrichedData, 
        cached: false, 
        lastUpdated: new Date().toISOString() 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Enrichment cache error:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
