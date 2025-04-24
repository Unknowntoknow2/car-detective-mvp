
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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { vin, valuationId } = await req.json()

    // Here you would normally call the CARFAX API
    // For now, we'll use a mock implementation
    const mockReportUrl = `https://carfax.com/report/${vin}`

    // Insert the vehicle history record
    const { data, error } = await supabase
      .from('vehicle_histories')
      .insert({
        valuation_id: valuationId,
        report_url: mockReportUrl,
        provider: 'CARFAX'
      })
      .select()

    if (error) throw error

    return new Response(JSON.stringify({ 
      reportUrl: mockReportUrl,
      success: true 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    })
  } catch (error) {
    console.error('Vehicle history fetch error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    })
  }
})
