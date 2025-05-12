
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PredictionRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  hasAccident?: boolean;
  drivingProfile?: string;
  aiConditionData?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const requestData: PredictionRequest = await req.json()
    
    // Validate required fields
    if (!requestData.make || !requestData.model || !requestData.year) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: make, model, year' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Car price prediction request:', requestData)

    // Get base price for the make/model/year
    let basePrice = 0
    
    // Try to get from model_trims first for more accurate base price
    const { data: trimData } = await supabase
      .from('model_trims')
      .select('msrp')
      .eq('year', requestData.year)
      .ilike('trim_name', '%' + (requestData.bodyType || 'Standard') + '%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (trimData?.msrp) {
      basePrice = Number(trimData.msrp)
    } else {
      // Fallback to valuations table
      const { data: valuationData } = await supabase
        .from('valuations')
        .select('base_price, estimated_value')
        .eq('make', requestData.make)
        .eq('model', requestData.model)
        .eq('year', requestData.year)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        
      if (valuationData?.base_price) {
        basePrice = Number(valuationData.base_price)
      } else if (valuationData?.estimated_value) {
        basePrice = Number(valuationData.estimated_value)
      } else {
        // Last resort fallback
        basePrice = requestData.year < 2010 ? 8000 : 
                    requestData.year < 2015 ? 12000 : 
                    requestData.year < 2020 ? 18000 : 24000
      }
    }
    
    console.log(`Base price for ${requestData.year} ${requestData.make} ${requestData.model}: $${basePrice}`)
    
    // Calculate adjustments
    const adjustments = []
    let totalAdjustment = 0
    
    // Mileage adjustment
    // Average mileage is ~12K per year
    const averageMileage = (new Date().getFullYear() - requestData.year) * 12000
    const mileageDifference = averageMileage - (requestData.mileage || 0)
    const mileageAdjustment = mileageDifference * 0.05
    totalAdjustment += mileageAdjustment
    
    adjustments.push({
      factor: 'Mileage',
      impact: mileageAdjustment,
      description: mileageAdjustment > 0 ? 'Below average mileage' : 'Above average mileage'
    })
    
    // Condition adjustment
    let conditionMultiplier = 0
    switch (requestData.condition) {
      case 'Excellent':
        conditionMultiplier = 0.08
        break
      case 'Good':
        conditionMultiplier = 0.03
        break
      case 'Fair':
        conditionMultiplier = -0.05
        break
      case 'Poor':
        conditionMultiplier = -0.15
        break
      default:
        conditionMultiplier = 0
    }
    
    const conditionAdjustment = basePrice * conditionMultiplier
    totalAdjustment += conditionAdjustment
    
    adjustments.push({
      factor: 'Condition',
      impact: conditionAdjustment,
      description: `${requestData.condition} condition`
    })
    
    // Get ZIP demand factor
    const { data: zipData } = await supabase
      .from('market_adjustments')
      .select('market_multiplier')
      .eq('zip_code', requestData.zipCode.substring(0, 3) + 'XX')
      .order('last_updated', { ascending: false })
      .limit(1)
      .maybeSingle()
      
    const zipMultiplier = zipData?.market_multiplier || 1
    const zipAdjustment = basePrice * (zipMultiplier - 1)
    totalAdjustment += zipAdjustment
    
    adjustments.push({
      factor: 'Market Demand',
      impact: zipAdjustment,
      description: zipAdjustment > 0 ? 'High demand in your area' : 'Lower demand in your area'
    })
    
    // Accident history adjustment
    if (requestData.hasAccident) {
      const accidentAdjustment = basePrice * -0.07
      totalAdjustment += accidentAdjustment
      
      adjustments.push({
        factor: 'Accident History',
        impact: accidentAdjustment,
        description: 'Previous accident record'
      })
    }
    
    // Features adjustment for premium features
    if (requestData.features && requestData.features.length > 0) {
      // Get feature values
      const { data: featureData } = await supabase
        .from('features')
        .select('name, value_impact')
        .in('id', requestData.features)
        
      if (featureData && featureData.length > 0) {
        const featuresAdjustment = featureData.reduce((sum, feature) => sum + feature.value_impact, 0)
        totalAdjustment += featuresAdjustment
        
        adjustments.push({
          factor: 'Premium Features',
          impact: featuresAdjustment,
          description: `${featureData.length} premium features`
        })
      }
    }
    
    // Calculate final value
    const estimatedValue = Math.round(basePrice + totalAdjustment)
    
    // Create price range (±5%)
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05)
    ]
    
    // Calculate confidence score (75-95%)
    const confidenceScore = Math.min(95, Math.max(75, 85 + (requestData.features?.length || 0) * 2))
    
    return new Response(
      JSON.stringify({
        baseValue: basePrice,
        estimatedValue,
        confidenceScore,
        priceRange,
        adjustments
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in car-price-prediction function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to predict car price', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
