
import { supabase } from '@/integrations/supabase/client';
import { MarketListing, normalizeListing } from '@/types/marketListing';
import { calculateUnifiedConfidence } from '@/utils/valuation/calculateUnifiedConfidence';
import { BasePriceService } from '@/services/basePriceService';
import { searchMarketListings } from '@/services/valuation/marketSearchAgent';

export interface EnhancedValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
}

export interface EnhancedValuationResult {
  id: string;
  estimatedValue: number;
  confidenceScore: number;
  valuationMethod: 'marketListings' | 'fallbackMSRP';
  isUsingFallbackMethod: boolean;
  basePriceAnchor: {
    price: number;
    source: string;
    confidence: number;
    listingsUsed: number;
  };
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  marketListings: MarketListing[];
  confidenceBreakdown: {
    vinAccuracy: number;
    marketData: number;
    fuelCostMatch: number;
    msrpQuality: number;
    overall: number;
    recommendations: string[];
  };
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
}

export async function calculateEnhancedValuation(
  input: EnhancedValuationInput
): Promise<EnhancedValuationResult> {
  console.log('🚀 Starting enhanced valuation calculation for:', input);
  
  const startTime = Date.now();
  
  try {
    // Step 1: Search for market listings using the unified market search agent
    console.log('📊 Searching for market listings...');
    const marketListings = await searchMarketListings({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
    });
    
    console.log(`✅ Found ${marketListings.length} market listings`);
    console.log('📋 Listings breakdown:', {
      totalListings: marketListings.length,
      sources: [...new Set(marketListings.map(l => l.source))],
      priceRange: marketListings.length > 0 ? {
        min: Math.min(...marketListings.map(l => l.price)),
        max: Math.max(...marketListings.map(l => l.price))
      } : null
    });
    
    // Step 2: Process market listings to determine price anchor
    let basePriceAnchor: EnhancedValuationResult['basePriceAnchor'];
    let isUsingFallbackMethod = false;
    let valuationMethod: 'marketListings' | 'fallbackMSRP' = 'marketListings';
    
    if (marketListings.length >= 2) {
      // Use market listings for price anchor
      console.log('💰 Using market listings for price anchor');
      
      // Filter out extreme outliers (more than 2 standard deviations from mean)
      const prices = marketListings.map(l => l.price);
      const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const stdDev = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length);
      
      const filteredPrices = prices.filter(price => 
        Math.abs(price - mean) <= 2 * stdDev
      );
      
      // Calculate median from filtered prices
      const sortedPrices = filteredPrices.sort((a, b) => a - b);
      const medianPrice = sortedPrices.length % 2 === 0
        ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
        : sortedPrices[Math.floor(sortedPrices.length / 2)];
      
      basePriceAnchor = {
        price: Math.round(medianPrice),
        source: 'market_listings',
        confidence: Math.min(95, 60 + (marketListings.length * 5)), // Max 95% confidence
        listingsUsed: marketListings.length
      };
      
      console.log('📍 Market-based price anchor:', basePriceAnchor);
      
    } else {
      // Use fallback MSRP-based pricing
      console.log('🔄 Using fallback MSRP-based pricing');
      isUsingFallbackMethod = true;
      valuationMethod = 'fallbackMSRP';
      
      const fallbackPrice = BasePriceService.getBasePrice({
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage
      });
      
      basePriceAnchor = {
        price: fallbackPrice,
        source: 'msrp_depreciation',
        confidence: 60, // Lower confidence for fallback
        listingsUsed: 0
      };
      
      console.log('📍 Fallback price anchor:', basePriceAnchor);
    }
    
    // Step 3: Apply adjustments to base price
    console.log('⚙️ Applying valuation adjustments...');
    const adjustments = calculateAdjustments(input, basePriceAnchor.price);
    
    // Calculate final estimated value
    const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const finalEstimatedValue = Math.max(1000, basePriceAnchor.price + totalAdjustment);
    
    console.log('💵 Final valuation calculation:', {
      basePrice: basePriceAnchor.price,
      totalAdjustment,
      finalEstimatedValue
    });
    
    // Step 4: Calculate confidence score
    const confidenceScore = calculateUnifiedConfidence({
      exactVinMatch: marketListings.some(l => l.vin === input.vin),
      marketListings: marketListings,
      sources: marketListings.map(l => l.source),
      trustScore: basePriceAnchor.confidence / 100,
      mileagePenalty: calculateMileagePenalty(input.mileage, input.year),
      zipCode: input.zipCode
    });
    
    // Step 5: Generate confidence breakdown
    const confidenceBreakdown = {
      vinAccuracy: marketListings.some(l => l.vin === input.vin) ? 95 : 70,
      marketData: Math.min(95, 30 + (marketListings.length * 10)),
      fuelCostMatch: 85, // Placeholder
      msrpQuality: isUsingFallbackMethod ? 60 : 90,
      overall: confidenceScore,
      recommendations: generateRecommendations(marketListings.length, isUsingFallbackMethod)
    };
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Enhanced valuation completed in ${processingTime}ms`);
    
    return {
      id: crypto.randomUUID(),
      estimatedValue: finalEstimatedValue,
      confidenceScore,
      valuationMethod,
      isUsingFallbackMethod,
      basePriceAnchor,
      adjustments,
      marketListings: marketListings.map(normalizeListing),
      confidenceBreakdown,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode
    };
    
  } catch (error) {
    console.error('❌ Enhanced valuation calculation failed:', error);
    
    // Return fallback result
    const fallbackPrice = BasePriceService.getBasePrice({
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage
    });
    
    return {
      id: crypto.randomUUID(),
      estimatedValue: fallbackPrice,
      confidenceScore: 50,
      valuationMethod: 'fallbackMSRP',
      isUsingFallbackMethod: true,
      basePriceAnchor: {
        price: fallbackPrice,
        source: 'emergency_fallback',
        confidence: 50,
        listingsUsed: 0
      },
      adjustments: [],
      marketListings: [],
      confidenceBreakdown: {
        vinAccuracy: 50,
        marketData: 0,
        fuelCostMatch: 50,
        msrpQuality: 50,
        overall: 50,
        recommendations: ['Unable to fetch market data', 'Consider running valuation again']
      },
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode
    };
  }
}

function calculateAdjustments(input: EnhancedValuationInput, basePrice: number): Array<{
  factor: string;
  impact: number;
  description: string;
}> {
  const adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }> = [];
  
  // Mileage adjustment
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - input.year;
  const expectedMileage = vehicleAge * 12000; // 12k miles per year
  const mileageDifference = input.mileage - expectedMileage;
  
  if (Math.abs(mileageDifference) > 5000) {
    const mileageAdjustment = -Math.round(mileageDifference * 0.08); // $0.08 per mile difference
    adjustments.push({
      factor: 'Mileage',
      impact: mileageAdjustment,
      description: `${mileageDifference > 0 ? 'Higher' : 'Lower'} than expected mileage (${expectedMileage.toLocaleString()} mi)`
    });
  }
  
  // Condition adjustment
  const conditionMultipliers = {
    'excellent': 0.15,
    'good': 0,
    'fair': -0.15,
    'poor': -0.30
  };
  
  const conditionMultiplier = conditionMultipliers[input.condition as keyof typeof conditionMultipliers] || 0;
  if (conditionMultiplier !== 0) {
    const conditionAdjustment = Math.round(basePrice * conditionMultiplier);
    adjustments.push({
      factor: 'Condition',
      impact: conditionAdjustment,
      description: `Vehicle condition: ${input.condition}`
    });
  }
  
  // Market demand adjustment (simplified)
  const popularModels = ['f-150', 'camry', 'accord', 'civic', 'corolla', 'silverado'];
  const isPopularModel = popularModels.some(model => 
    input.model.toLowerCase().includes(model.toLowerCase())
  );
  
  if (isPopularModel) {
    const demandAdjustment = Math.round(basePrice * 0.05);
    adjustments.push({
      factor: 'Market Demand',
      impact: demandAdjustment,
      description: 'High demand model with strong resale value'
    });
  }
  
  return adjustments;
}

function calculateMileagePenalty(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const expectedMileage = vehicleAge * 12000;
  const excessMileage = Math.max(0, mileage - expectedMileage);
  
  return Math.min(0.15, excessMileage / 100000 * 0.10); // Max 15% penalty
}

function generateRecommendations(listingsCount: number, isUsingFallback: boolean): string[] {
  const recommendations: string[] = [];
  
  if (isUsingFallback) {
    recommendations.push('Limited market data available - consider checking again in a few days');
    recommendations.push('Valuation based on MSRP depreciation model');
  }
  
  if (listingsCount < 3) {
    recommendations.push('Few comparable listings found - expand search radius for better accuracy');
  }
  
  if (listingsCount === 0) {
    recommendations.push('No market listings found - consider manual market research');
  }
  
  return recommendations;
}
