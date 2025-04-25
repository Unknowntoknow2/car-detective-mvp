
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

    const { vin, valuationId } = await req.json()

    if (!vin || !valuationId) {
      return new Response(JSON.stringify({ error: 'VIN and ValuationID are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Mock CARFAX report generation (replace with actual service in production)
    const mockCarfaxReport = {
      reportUrl: `https://mock-carfax.com/report/${vin}`,
      owners: 2,
      accidentsReported: 1,
      damageTypes: ['Minor collision'],
      serviceRecords: 3,
      titleEvents: ['Clean title'],
      estimatedValueImpact: -500
    }

    // Store vehicle history in Supabase
    const { error: historyError } = await supabase
      .from('vehicle_histories')
      .insert({
        valuation_id: valuationId,
        report_url: mockCarfaxReport.reportUrl,
        provider: 'CARFAX',
        report_data: mockCarfaxReport
      })

    if (historyError) throw historyError

    return new Response(JSON.stringify({ 
      reportUrl: mockCarfaxReport.reportUrl,
      reportData: mockCarfaxReport 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Vehicle history fetch error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
