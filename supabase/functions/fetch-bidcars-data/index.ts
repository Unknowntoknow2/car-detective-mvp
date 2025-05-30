
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json()

    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Fetching Bid.Cars data for VIN: ${vin}`)

    const res = await fetch(`https://api.bid.cars/api/v1/search?q=${vin}`)
    
    if (!res.ok) {
      throw new Error(`Bid.Cars API error: ${res.status}`)
    }

    const data = await res.json()

    const records = (data.results || []).map((item: any) => ({
      vin: item.vin || vin,
      price: item.price || '0',
      odometer: item.odometer || '0',
      year: item.year,
      make: item.make,
      model: item.model,
      condition: item.condition,
      auction_date: item.auctionDate,
      image: item.images?.[0] || null,
      source: 'bidcars',
    }))

    console.log(`Found ${records.length} Bid.Cars records for VIN: ${vin}`)

    return new Response(
      JSON.stringify({ records }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching Bid.Cars data:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch auction data', records: [] }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
