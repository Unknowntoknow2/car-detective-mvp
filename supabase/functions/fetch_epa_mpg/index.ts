
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { year, make, model } = await req.json()
    
    // Validate input
    if (!year || !make || !model) {
      return new Response(
        JSON.stringify({ error: 'Year, make, and model are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // First, check if we have cached data
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('epa_mpg_cache')
      .select('*')
      .eq('year', year)
      .eq('make', make.toLowerCase())
      .eq('model', model.toLowerCase())
      .single()

    if (cachedData && !cacheError) {
      return new Response(
        JSON.stringify({
          data: {
            menuItem: 'Combined MPG',
            value: cachedData.combined_mpg.toString(),
            text: `${cachedData.combined_mpg} MPG combined (${cachedData.city_mpg} city / ${cachedData.highway_mpg} hwy)`
          },
          source: 'cache'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If not in cache, fetch from external API
    // In a real implementation, you would call the EPA API here
    // For this example, we'll create mock data based on the input
    
    // Mock EPA MPG calculation (in real app, would call external API)
    const cityMpg = Math.max(15, 35 - (2023 - year) - (make.length % 5))
    const highwayMpg = cityMpg + Math.floor(Math.random() * 10) + 5
    const combinedMpg = Math.floor((cityMpg + highwayMpg) / 2)
    
    // Store in cache for future requests
    await supabaseClient
      .from('epa_mpg_cache')
      .upsert({
        year,
        make: make.toLowerCase(),
        model: model.toLowerCase(),
        city_mpg: cityMpg,
        highway_mpg: highwayMpg,
        combined_mpg: combinedMpg,
        fetched_at: new Date().toISOString()
      })
    
    return new Response(
      JSON.stringify({
        data: {
          menuItem: 'Combined MPG',
          value: combinedMpg.toString(),
          text: `${combinedMpg} MPG combined (${cityMpg} city / ${highwayMpg} hwy)`
        },
        source: 'api'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
