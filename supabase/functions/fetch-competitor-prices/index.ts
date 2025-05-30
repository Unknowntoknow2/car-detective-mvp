
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { fetchCarvanaPrice } from './scrapers/carvana.ts'
import { fetchCarmaxPrice } from './scrapers/carmax.ts'
import { fetchCarfaxPrice } from './scrapers/carfax.ts'
import { fetchCarsDotComPrice } from './scrapers/carsdotcom.ts'
import { fetchAutotraderPrice } from './scrapers/autotrader.ts'

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

    // Run all scrapers in parallel with proper error handling
    const [carvanaPrice, carmaxPrice, carfaxPrice, carsdotcomPrice, autotraderPrice] = await Promise.allSettled([
      fetchCarvanaPrice(vin, make, model, year),
      fetchCarmaxPrice(vin, make, model, year),
      fetchCarfaxPrice(vin, make, model, year),
      fetchCarsDotComPrice(vin, make, model, year),
      fetchAutotraderPrice(vin, make, model, year)
    ])

    const competitorData = {
      vin,
      make: make || null,
      model: model || null,
      year: year || null,
      carvana_value: carvanaPrice.status === 'fulfilled' ? carvanaPrice.value : null,
      carmax_value: carmaxPrice.status === 'fulfilled' ? carmaxPrice.value : null,
      edmunds_value: null, // Edmunds not implemented in current scrapers
      carfax_value: carfaxPrice.status === 'fulfilled' ? carfaxPrice.value : null,
      carsdotcom_value: carsdotcomPrice.status === 'fulfilled' ? carsdotcomPrice.value : null,
      autotrader_value: autotraderPrice.status === 'fulfilled' ? autotraderPrice.value : null,
      fetched_at: new Date().toISOString()
    }

    // First check if record exists for this VIN
    const { data: existingRecord } = await supabase
      .from('competitor_prices')
      .select('id')
      .eq('vin', vin)
      .single()

    let data, error

    if (existingRecord) {
      // Update existing record
      const updateResult = await supabase
        .from('competitor_prices')
        .update(competitorData)
        .eq('vin', vin)
        .select()
      
      data = updateResult.data
      error = updateResult.error
    } else {
      // Insert new record
      const insertResult = await supabase
        .from('competitor_prices')
        .insert(competitorData)
        .select()
      
      data = insertResult.data
      error = insertResult.error
    }

    if (error) {
      console.error('❌ Database operation error:', error)
      throw error
    }

    console.log(`✅ Successfully stored competitor prices for VIN: ${vin}`)

    return new Response(JSON.stringify({ 
      success: true, 
      data: competitorData,
      summary: {
        total_scrapers: 5,
        successful_scrapers: Object.values(competitorData)
          .filter(val => val !== null && typeof val === 'string' && val !== '0').length - 4, // Exclude metadata fields
        prices_found: Object.entries(competitorData)
          .filter(([key, value]) => key.endsWith('_value') && value && value !== '0')
          .map(([key, value]) => ({ source: key.replace('_value', ''), price: value }))
      }
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
