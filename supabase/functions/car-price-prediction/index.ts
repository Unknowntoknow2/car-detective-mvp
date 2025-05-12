
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts"

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the input schema using Zod for validation
const ValuationRequestSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0).optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).optional().default("good"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  features: z.array(z.string()).optional(),
  hasAccident: z.union([z.boolean(), z.enum(["yes", "no"])]).optional(),
  accidentDetails: z.object({
    count: z.string().optional(),
    severity: z.string().optional(),
    area: z.string().optional()
  }).optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  trim: z.string().optional(),
  includeCarfax: z.boolean().optional(),
  drivingProfile: z.string().optional(),
  colorMultiplier: z.number().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  aiConditionOverride: z.object({
    condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
    confidenceScore: z.number()
  }).optional()
})

type ValuationRequest = z.infer<typeof ValuationRequestSchema>

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const requestData = await req.json()
    
    console.log('Received car price prediction request:', requestData)
    
    // Validate the request data
    const validationResult = ValuationRequestSchema.safeParse(requestData)
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request data', 
          details: validationResult.error.format() 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    const data = validationResult.data
    
    // Calculate the base price using make, model, and year
    const basePrice = calculateBasePrice(data.make, data.model, data.year)
    
    // Calculate adjustments based on various factors
    const adjustments = calculateAdjustments(data, basePrice)
    
    // Sum up all adjustments
    const totalAdjustmentValue = adjustments.reduce((sum, adj) => sum + adj.impact, 0)
    
    // Calculate final estimated value
    const estimatedValue = Math.round(basePrice + totalAdjustmentValue)
    
    // Calculate confidence score (75-95%)
    const confidenceScore = calculateConfidenceScore(data)
    
    // Create price range (±5%)
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05)
    ]
    
    // Prepare and return the response
    const response = {
      baseValue: basePrice,
      estimatedValue,
      confidenceScore,
      priceRange,
      valuationFactors: adjustments
    }
    
    console.log('Returning valuation:', response)
    
    return new Response(
      JSON.stringify(response),
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

// Function to calculate base price based on make, model, and year
function calculateBasePrice(make: string, model: string, year: number): number {
  // Normalize make and model to lowercase for consistent matching
  const normMake = make.toLowerCase()
  const normModel = model.toLowerCase()
  
  // Define base prices for popular makes
  const makeMultipliers: Record<string, number> = {
    'toyota': 1.0,
    'honda': 0.98,
    'ford': 0.92,
    'chevrolet': 0.9,
    'nissan': 0.88,
    'hyundai': 0.85,
    'kia': 0.83,
    'subaru': 0.95,
    'mazda': 0.93,
    'volkswagen': 0.9,
    'bmw': 1.2,
    'mercedes': 1.25,
    'audi': 1.15,
    'lexus': 1.1,
    'acura': 1.05,
    'infiniti': 1.0,
    'tesla': 1.3,
    'porsche': 1.5
  }
  
  // Luxury models that command higher prices
  const luxuryModels = [
    'model s', 'model x', '911', 'cayenne', '7 series', 's-class', 
    'a8', 'ls', 'q7', 'x5', 'range rover'
  ]
  
  // SUVs and trucks that tend to hold value better
  const suvAndTrucks = [
    'f-150', 'silverado', 'ram', 'sierra', 'tacoma', 'tundra', 'rav4',
    'cr-v', 'highlander', 'pilot', 'explorer', 'escape', 'rogue', 'murano'
  ]
  
  // Base calculation starting point based on year
  // Newer cars have higher base values
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  
  let basePrice = 0
  
  // Base price calculation based on age
  if (age <= 1) {
    basePrice = 30000
  } else if (age <= 3) {
    basePrice = 25000
  } else if (age <= 5) {
    basePrice = 20000
  } else if (age <= 10) {
    basePrice = 15000
  } else if (age <= 15) {
    basePrice = 8000
  } else {
    basePrice = 3000
  }
  
  // Apply make multiplier
  const makeMultiplier = makeMultipliers[normMake] || 0.85
  basePrice *= makeMultiplier
  
  // Apply model adjustments
  if (luxuryModels.some(m => normModel.includes(m))) {
    basePrice *= 1.4
  } else if (suvAndTrucks.some(m => normModel.includes(m))) {
    basePrice *= 1.15
  }
  
  // Apply some randomization to make values look more realistic (±5%)
  const randomFactor = 0.95 + Math.random() * 0.1
  basePrice *= randomFactor
  
  // Round to nearest 100
  return Math.round(basePrice / 100) * 100
}

// Function to calculate adjustments based on various factors
function calculateAdjustments(data: ValuationRequest, basePrice: number): Array<{factor: string, impact: number, description: string}> {
  const adjustments = []
  
  // 1. Mileage adjustment
  if (data.mileage !== undefined) {
    const averageMileage = (new Date().getFullYear() - data.year) * 12000
    const mileageDifference = averageMileage - data.mileage
    
    // Calculate impact as percentage of base price
    let mileageImpactPercentage = 0
    if (mileageDifference > 0) {
      // Below average mileage (positive adjustment)
      mileageImpactPercentage = Math.min(10, mileageDifference / 5000)
    } else {
      // Above average mileage (negative adjustment)
      mileageImpactPercentage = Math.max(-15, mileageDifference / 3000)
    }
    
    const mileageImpact = Math.round((basePrice * mileageImpactPercentage) / 100)
    
    adjustments.push({
      factor: 'Mileage',
      impact: mileageImpact,
      description: mileageImpactPercentage > 0 
        ? 'Lower than average mileage' 
        : 'Higher than average mileage'
    })
  }
  
  // 2. Condition adjustment
  const conditionMap: Record<string, number> = {
    'excellent': 5,
    'good': 0,
    'fair': -5,
    'poor': -15
  }
  
  // Use the AI condition override if provided
  let conditionValue = data.condition.toLowerCase()
  if (data.aiConditionOverride) {
    conditionValue = data.aiConditionOverride.condition.toLowerCase()
  }
  
  const conditionPercentage = conditionMap[conditionValue as keyof typeof conditionMap] || 0
  const conditionImpact = Math.round((basePrice * conditionPercentage) / 100)
  
  adjustments.push({
    factor: 'Condition',
    impact: conditionImpact,
    description: `${conditionValue.charAt(0).toUpperCase() + conditionValue.slice(1)} condition`
  })
  
  // 3. ZIP code market adjustment (varies by region)
  // Real implementation would use actual market data by region
  const zipPrefix = data.zipCode.substring(0, 1)
  const zipMarketMultipliers: Record<string, number> = {
    '0': 0.5,  // Northeast
    '1': 0.75, // Northeast
    '2': 0,    // Mid-Atlantic
    '3': -0.5, // Southeast
    '4': -1,   // Midwest
    '5': -0.5, // South
    '6': -0.25,// South/Central
    '7': -0.75,// Central
    '8': 0.5,  // Mountain
    '9': 1     // West Coast
  }
  
  const zipMarketPercentage = zipMarketMultipliers[zipPrefix] || 0
  const zipMarketImpact = Math.round((basePrice * zipMarketPercentage) / 100)
  
  adjustments.push({
    factor: 'Market Demand',
    impact: zipMarketImpact,
    description: zipMarketPercentage > 0 
      ? 'High demand in your area' 
      : zipMarketPercentage < 0 
        ? 'Lower demand in your area' 
        : 'Average demand in your area'
  })
  
  // 4. Accident history adjustment
  let hasAccident = false
  if (typeof data.hasAccident === 'boolean') {
    hasAccident = data.hasAccident
  } else if (data.hasAccident === 'yes') {
    hasAccident = true
  }
  
  if (hasAccident) {
    const accidentImpact = Math.round((basePrice * -7) / 100) // -7% for accident history
    
    adjustments.push({
      factor: 'Accident History',
      impact: accidentImpact,
      description: 'Previous accident record'
    })
  }
  
  // 5. Features adjustment (if provided)
  if (data.features && data.features.length > 0) {
    const featureImpact = Math.round((basePrice * data.features.length) / 100)
    
    adjustments.push({
      factor: 'Features',
      impact: featureImpact,
      description: `${data.features.length} additional feature${data.features.length > 1 ? 's' : ''}`
    })
  }
  
  // 6. Fuel type adjustment
  if (data.fuelType) {
    const fuelTypePercentages: Record<string, number> = {
      'gasoline': 0,
      'hybrid': 3,
      'electric': 5,
      'diesel': 2,
      'plug-in hybrid': 4
    }
    
    const normalizedFuelType = data.fuelType.toLowerCase()
    const fuelPercentage = fuelTypePercentages[normalizedFuelType as keyof typeof fuelTypePercentages] || 0
    const fuelImpact = Math.round((basePrice * fuelPercentage) / 100)
    
    if (fuelPercentage !== 0) {
      adjustments.push({
        factor: 'Fuel Type',
        impact: fuelImpact,
        description: `${data.fuelType} powertrain`
      })
    }
  }
  
  // 7. Color adjustment (if provided)
  if (data.exteriorColor && data.colorMultiplier) {
    const colorImpact = Math.round((basePrice * (data.colorMultiplier - 1)) / 100)
    
    if (colorImpact !== 0) {
      adjustments.push({
        factor: 'Exterior Color',
        impact: colorImpact,
        description: `${data.exteriorColor} exterior`
      })
    }
  }
  
  // 8. Driving profile adjustment (if provided)
  if (data.drivingProfile) {
    const drivingProfileMap: Record<string, number> = {
      'gentle': 2,
      'average': 0,
      'aggressive': -2
    }
    
    const drivingPercentage = drivingProfileMap[data.drivingProfile as keyof typeof drivingProfileMap] || 0
    const drivingImpact = Math.round((basePrice * drivingPercentage) / 100)
    
    if (drivingPercentage !== 0) {
      adjustments.push({
        factor: 'Driving History',
        impact: drivingImpact,
        description: `${data.drivingProfile} driving profile`
      })
    }
  }
  
  return adjustments
}

// Function to calculate confidence score based on available data
function calculateConfidenceScore(data: ValuationRequest): number {
  let score = 80 // Base confidence score
  
  // Add points for completeness of data
  if (data.mileage !== undefined) score += 2
  if (data.condition) score += 2
  if (data.features && data.features.length > 0) score += 1
  if (data.fuelType) score += 1
  if (data.transmission) score += 1
  if (data.zipCode) score += 1
  if (data.aiConditionOverride) score += 5
  
  // Deduct points for factors that reduce certainty
  const currentYear = new Date().getFullYear()
  const age = currentYear - data.year
  if (age > 15) score -= 5
  
  if (typeof data.hasAccident === 'boolean' && data.hasAccident) score -= 3
  else if (data.hasAccident === 'yes') score -= 3
  
  // Ensure score stays within 75-95 range
  return Math.min(95, Math.max(75, score))
}
