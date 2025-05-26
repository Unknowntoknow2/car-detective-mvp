
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData = await req.json()
    console.log('Received request for valuation:', {
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      vin: requestData.vin
    })

    // Calculate estimated value based on basic formula
    let baseValue = 15000 // Base value
    const currentYear = new Date().getFullYear()
    const age = currentYear - requestData.year
    
    // Age depreciation: 10% per year for first 5 years, 5% after
    let ageMultiplier = 1
    if (age <= 5) {
      ageMultiplier = 1 - (age * 0.1)
    } else {
      ageMultiplier = 0.5 - ((age - 5) * 0.05)
    }
    ageMultiplier = Math.max(ageMultiplier, 0.1) // Minimum 10% of original value

    // Mileage adjustment
    const avgMileagePerYear = 12000
    const expectedMileage = age * avgMileagePerYear
    const mileageDiff = requestData.mileage - expectedMileage
    const mileageMultiplier = 1 - (mileageDiff / 100000) * 0.2 // 20% reduction per 100k excess miles
    
    // Calculate final value
    const estimatedValue = Math.round(baseValue * ageMultiplier * mileageMultiplier)
    
    const valuationResult = {
      estimatedValue,
      confidenceScore: 95,
      conditionScore: 75,
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      vin: requestData.vin,
      fuelType: requestData.fuelType,
      transmission: requestData.transmission,
      bodyType: requestData.bodyType,
      color: requestData.color
    }

    console.log('Valuation result:', valuationResult)

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    let userId = null
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
        if (!authError && user) {
          userId = user.id
        }
      } catch (error) {
        console.log('Auth error (continuing without user):', error)
      }
    }

    try {
      // Store in database using service role to bypass RLS
      const valuationData = {
        make: requestData.make,
        model: requestData.model,
        year: requestData.year,
        mileage: requestData.mileage,
        estimated_value: estimatedValue,
        confidence_score: 95,
        vin: requestData.vin,
        fuel_type: requestData.fuelType,
        transmission: requestData.transmission,
        body_type: requestData.bodyType,
        color: requestData.color,
        user_id: userId, // This can now be null for anonymous users
        state: requestData.zipCode?.substring(0, 2) || null,
        base_price: Math.round(baseValue),
        is_vin_lookup: true
      }

      console.log('Attempting to store valuation:', valuationData)

      const { data: storedValuation, error: storeError } = await supabaseClient
        .from('valuations')
        .insert(valuationData)
        .select()
        .single()

      if (storeError) {
        console.error('Error storing valuation:', storeError)
        // Continue without storing - just return the calculated result
        return new Response(
          JSON.stringify({
            ...valuationResult,
            id: `temp-${Date.now()}`,
            valuationId: `temp-${Date.now()}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      } else {
        console.log('Valuation stored successfully:', storedValuation?.id)
        return new Response(
          JSON.stringify({
            ...valuationResult,
            id: storedValuation?.id || `temp-${Date.now()}`,
            valuationId: storedValuation?.id || `temp-${Date.now()}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }

    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return the calculation result even if storage fails
      return new Response(
        JSON.stringify({
          ...valuationResult,
          id: `temp-${Date.now()}`,
          valuationId: `temp-${Date.now()}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

  } catch (error) {
    console.error('Error in car-price-prediction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
