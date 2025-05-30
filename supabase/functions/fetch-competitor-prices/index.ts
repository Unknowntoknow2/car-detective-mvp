
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { fetchCarvanaPrice } from './scrapers/carvana.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vin, make, model, year } = await req.json()

    if (!vin) {
      return new Response(JSON.stringify({ error: 'VIN is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`🔍 Fetching competitor prices for VIN: ${vin}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Start with Carvana, will add others incrementally
    const [carvanaPrice] = await Promise.allSettled([
      fetchCarvanaPrice(vin, make, model, year)
    ])

    const competitorData = {
      vin,
      make: make || null,
      model: model || null,
      year: year || null,
      carvana_value: carvanaPrice.status === 'fulfilled' ? carvanaPrice.value : null,
      carmax_value: null, // To be implemented
      edmunds_value: null, // To be implemented
      carfax_value: null, // To be implemented
      carsdotcom_value: null, // To be implemented
      autotrader_value: null, // To be implemented
      fetched_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('competitor_prices')
      .upsert(competitorData, {
        onConflict: 'vin',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('❌ Database upsert error:', error)
      throw error
    }

    console.log(`✅ Successfully stored competitor prices for VIN: ${vin}`)

    return new Response(JSON.stringify({ 
      success: true, 
      data: competitorData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('💥 fetch-competitor-prices failed:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
