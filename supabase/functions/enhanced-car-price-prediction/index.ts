
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnhancedValuationRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
  condition?: string;
  accidents?: number;
  titleStatus?: string;
  maintenanceRecords?: string;
  location?: string;
  photos?: string[];
  followupData?: Record<string, any>;
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

    const requestData: EnhancedValuationRequest = await req.json()
    console.log('Enhanced valuation request:', requestData)

    // Calculate base value
    let baseValue = 15000
    const currentYear = new Date().getFullYear()
    const age = currentYear - requestData.year
    
    // Age depreciation
    let ageMultiplier = 1
    if (age <= 5) {
      ageMultiplier = 1 - (age * 0.1)
    } else {
      ageMultiplier = 0.5 - ((age - 5) * 0.05)
    }
    ageMultiplier = Math.max(ageMultiplier, 0.1)

    // Mileage adjustment
    const avgMileagePerYear = 12000
    const expectedMileage = age * avgMileagePerYear
    const mileageDiff = requestData.mileage - expectedMileage
    const mileageMultiplier = Math.max(0.5, 1 - (mileageDiff / 100000) * 0.2)
    
    // Enhanced condition adjustments
    let conditionMultiplier = 1
    if (requestData.condition) {
      switch (requestData.condition.toLowerCase()) {
        case 'excellent':
          conditionMultiplier = 1.15
          break
        case 'good':
          conditionMultiplier = 1.0
          break
        case 'fair':
          conditionMultiplier = 0.85
          break
        case 'poor':
          conditionMultiplier = 0.65
          break
      }
    }

    // Accident history adjustment
    let accidentMultiplier = 1
    if (requestData.accidents !== undefined) {
      if (requestData.accidents === 0) {
        accidentMultiplier = 1.05
      } else if (requestData.accidents === 1) {
        accidentMultiplier = 0.92
      } else {
        accidentMultiplier = 0.80
      }
    }

    // Title status adjustment
    let titleMultiplier = 1
    if (requestData.titleStatus) {
      switch (requestData.titleStatus.toLowerCase()) {
        case 'clean':
          titleMultiplier = 1.0
          break
        case 'salvage':
          titleMultiplier = 0.65
          break
        case 'rebuilt':
          titleMultiplier = 0.75
          break
        case 'lemon':
          titleMultiplier = 0.60
          break
      }
    }

    // Maintenance records adjustment
    let maintenanceMultiplier = 1
    if (requestData.maintenanceRecords) {
      switch (requestData.maintenanceRecords.toLowerCase()) {
        case 'complete':
          maintenanceMultiplier = 1.05
          break
        case 'partial':
          maintenanceMultiplier = 1.0
          break
        case 'none':
          maintenanceMultiplier = 0.95
          break
      }
    }

    // Calculate final value
    const estimatedValue = Math.round(
      baseValue * 
      ageMultiplier * 
      mileageMultiplier * 
      conditionMultiplier * 
      accidentMultiplier * 
      titleMultiplier * 
      maintenanceMultiplier
    )

    // Calculate enhanced confidence score based on data completeness
    let confidenceScore = 75 // Base confidence
    
    if (requestData.condition) confidenceScore += 8
    if (requestData.accidents !== undefined) confidenceScore += 5
    if (requestData.titleStatus) confidenceScore += 4
    if (requestData.maintenanceRecords) confidenceScore += 3
    if (requestData.location) confidenceScore += 2
    if (requestData.photos && requestData.photos.length > 0) confidenceScore += 3

    // Cap at 100%
    confidenceScore = Math.min(100, confidenceScore)

    // Create detailed adjustments breakdown
    const adjustments = [
      {
        factor: 'Vehicle Age',
        impact: Math.round((ageMultiplier - 1) * baseValue),
        description: `${age} years old (${ageMultiplier > 1 ? '+' : ''}${Math.round((ageMultiplier - 1) * 100)}%)`
      },
      {
        factor: 'Mileage',
        impact: Math.round((mileageMultiplier - 1) * baseValue * ageMultiplier),
        description: `${requestData.mileage.toLocaleString()} miles vs ${expectedMileage.toLocaleString()} expected`
      }
    ]

    if (requestData.condition) {
      adjustments.push({
        factor: 'Condition',
        impact: Math.round((conditionMultiplier - 1) * baseValue * ageMultiplier * mileageMultiplier),
        description: `${requestData.condition} condition`
      })
    }

    if (requestData.accidents !== undefined) {
      adjustments.push({
        factor: 'Accident History',
        impact: Math.round((accidentMultiplier - 1) * baseValue * ageMultiplier * mileageMultiplier * conditionMultiplier),
        description: `${requestData.accidents} accident${requestData.accidents !== 1 ? 's' : ''} reported`
      })
    }

    const valuationResult = {
      estimatedValue,
      confidenceScore,
      basePrice: Math.round(baseValue),
      adjustments,
      priceRange: {
        low: Math.round(estimatedValue * 0.85),
        high: Math.round(estimatedValue * 1.15)
      },
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      vin: requestData.vin,
      condition: requestData.condition,
      isEnhanced: true,
      dataCompleteness: Math.round(confidenceScore)
    }

    console.log('Enhanced valuation result:', valuationResult)

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

    // Store enhanced valuation in database
    try {
      const valuationData = {
        make: requestData.make,
        model: requestData.model,
        year: requestData.year,
        mileage: requestData.mileage,
        estimated_value: estimatedValue,
        confidence_score: confidenceScore,
        vin: requestData.vin,
        condition: requestData.condition,
        user_id: userId,
        base_price: Math.round(baseValue),
        is_enhanced: true,
        followup_data: requestData.followupData || null,
        state: requestData.location?.substring(0, 2) || null
      }

      const { data: storedValuation, error: storeError } = await supabaseClient
        .from('valuations')
        .insert(valuationData)
        .select()
        .single()

      if (storeError) {
        console.error('Error storing enhanced valuation:', storeError)
      } else {
        console.log('Enhanced valuation stored successfully:', storedValuation?.id)
        valuationResult.id = storedValuation?.id
        valuationResult.valuationId = storedValuation?.id
      }

    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify(valuationResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in enhanced-car-price-prediction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
