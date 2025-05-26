
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
      condition: requestData.condition
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
    
    // Condition multiplier
    const conditionMultipliers = {
      'excellent': 1.2,
      'very good': 1.1,
      'good': 1.0,
      'fair': 0.8,
      'poor': 0.6
    }
    const conditionMultiplier = conditionMultipliers[requestData.condition?.toLowerCase()] || 1.0

    // Calculate final value
    const estimatedValue = Math.round(baseValue * ageMultiplier * mileageMultiplier * conditionMultiplier)
    
    const valuationResult = {
      estimatedValue,
      confidenceScore: 95,
      conditionScore: 75,
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      condition: requestData.condition,
      vin: requestData.vin,
      fuelType: requestData.fuelType,
      transmission: requestData.transmission,
      bodyType: requestData.bodyType,
      color: requestData.color
    }

    console.log('Valuation result:', valuationResult)

    // Store in database - using correct column names from schema
    const { data: storedValuation, error: storeError } = await supabaseClient
      .from('valuations')
      .insert({
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
        user_id: requestData.userId || null,
        state: requestData.zipCode?.substring(0, 2) || null,
        base_price: Math.round(baseValue),
        is_vin_lookup: true
      })
      .select()
      .single()

    if (storeError) {
      console.error('Error storing valuation:', storeError)
      throw storeError
    }

    return new Response(
      JSON.stringify({
        ...valuationResult,
        id: storedValuation.id,
        valuationId: storedValuation.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
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
