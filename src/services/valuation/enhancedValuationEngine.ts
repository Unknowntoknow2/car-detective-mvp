import { supabase } from '@/integrations/supabase/client';
import { searchMarketListings } from './marketSearchAgent';
import { generateConfidenceScore } from '../generateConfidenceScore';
import type { MarketListing } from '@/types/marketListing';

export interface EnhancedValuationParams {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
}

export interface EnhancedValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  marketListings: MarketListing[];
  isUsingFallbackMethod: boolean;
  basePriceAnchor: number;
  adjustments: Array<{
    type: string;
    amount: number;
    reason: string;
  }>;
  confidenceBreakdown: {
    vinAccuracy: number;
    marketData: number;
    fuelCostMatch: number;
    msrpQuality: number;
    overall: number;
    recommendations: string[];
  };
  mileage: number;
  condition: string;
  zipCode: string;
  explanation?: string;
}

export async function calculateEnhancedValuation(params: EnhancedValuationParams): Promise<EnhancedValuationResult> {
  console.log('🚀 [ENHANCED_VALUATION] Starting enhanced valuation calculation:', params);
  
  try {
    // Step 1: Search for market listings using the new agent
    const marketResult = await searchMarketListings({
      make: params.make,
      model: params.model,
      year: params.year,
      trim: params.trim,
      mileage: params.mileage,
      zipCode: params.zipCode,
      vin: params.vin,
      radius: 100
    });
    
    console.log('📊 [ENHANCED_VALUATION] Market search result:', {
      listingsFound: marketResult.listings.length,
      trust: marketResult.trust,
      source: marketResult.source,
      searchMethod: marketResult.searchMethod
    });
    
    // Step 2: Determine if we're using fallback method
    const isUsingFallbackMethod = marketResult.searchMethod === 'fallback' || marketResult.listings.length === 0;
    
    // Step 3: Calculate base price anchor
    let basePriceAnchor: number;
    
    if (marketResult.listings.length > 0) {
      // Use market data for base price
      const prices = marketResult.listings.map((l: MarketListing) => l.price).filter(p => p > 0);
      basePriceAnchor = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
      console.log('💰 [ENHANCED_VALUATION] Using market-based pricing:', basePriceAnchor);
    } else {
      // Use MSRP-based fallback pricing
      basePriceAnchor = await calculateMSRPBasedPrice(params);
      console.log('💰 [ENHANCED_VALUATION] Using MSRP-based fallback pricing:', basePriceAnchor);
    }
    
    // Step 4: Apply adjustments
    const adjustments = await calculateAdjustments(params, basePriceAnchor);
    const finalValue = adjustments.reduce((value, adj) => value + adj.amount, basePriceAnchor);
    
    // Step 5: Calculate confidence score
    const confidenceResult = generateConfidenceScore({
      base: isUsingFallbackMethod ? 45 : 55,
      hasExactVinMatch: marketResult.listings.some((l: MarketListing) => l.vin === params.vin),
      listingCount: marketResult.listings.length,
      certifiedListingCount: marketResult.listings.filter((l: MarketListing) => l.is_cpo).length,
      trustedSources: marketResult.listings.map((l: MarketListing) => l.source),
      trustScore: marketResult.trust
    });
    
    // Step 6: Apply fallback confidence cap
    let finalConfidence = confidenceResult.score;
    if (isUsingFallbackMethod) {
      finalConfidence = Math.min(finalConfidence, 60);
      console.log('🧢 [ENHANCED_VALUATION] Confidence capped at 60% due to fallback method');
    }
    
    // Step 7: Generate explanation
    const explanation = await generateValuationExplanation(params, marketResult, finalValue, finalConfidence);
    
    const result: EnhancedValuationResult = {
      estimatedValue: Math.round(finalValue),
      confidenceScore: finalConfidence,
      marketListings: marketResult.listings,
      isUsingFallbackMethod,
      basePriceAnchor: Math.round(basePriceAnchor),
      adjustments,
      confidenceBreakdown: {
        vinAccuracy: marketResult.listings.some((l: MarketListing) => l.vin === params.vin) ? 95 : 70,
        marketData: marketResult.listings.length > 0 ? 85 : 40,
        fuelCostMatch: 75,
        msrpQuality: 80,
        overall: finalConfidence,
        recommendations: confidenceResult.explanation
      },
      mileage: params.mileage,
      condition: params.condition,
      zipCode: params.zipCode,
      explanation
    };
    
    console.log('✅ [ENHANCED_VALUATION] Calculation complete:', {
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      listingsCount: result.marketListings.length,
      isUsingFallbackMethod: result.isUsingFallbackMethod
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ [ENHANCED_VALUATION] Calculation failed:', error);
    
    // Return fallback result on error
    const fallbackPrice = await calculateMSRPBasedPrice(params);
    
    return {
      estimatedValue: Math.round(fallbackPrice),
      confidenceScore: 30,
      marketListings: [],
      isUsingFallbackMethod: true,
      basePriceAnchor: Math.round(fallbackPrice),
      adjustments: [],
      confidenceBreakdown: {
        vinAccuracy: 50,
        marketData: 20,
        fuelCostMatch: 60,
        msrpQuality: 70,
        overall: 30,
        recommendations: ['Error occurred during valuation - using basic fallback method']
      },
      mileage: params.mileage,
      condition: params.condition,
      zipCode: params.zipCode,
      explanation: `Valuation calculation encountered an error. Using basic MSRP-based fallback pricing with reduced confidence.`
    };
  }
}

async function calculateMSRPBasedPrice(params: EnhancedValuationParams): Promise<number> {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - params.year;
  
  let basePrice: number;
  const modelLower = params.model.toLowerCase();
  
  if (modelLower.includes('f-150') || modelLower.includes('f150')) {
    basePrice = params.year >= 2020 ? 35000 : params.year >= 2018 ? 30000 : params.year >= 2015 ? 25000 : 20000;
  } else if (modelLower.includes('civic')) {
    basePrice = params.year >= 2020 ? 22000 : params.year >= 2018 ? 19000 : params.year >= 2015 ? 16000 : 13000;
  } else {
    basePrice = params.year >= 2020 ? 28000 : params.year >= 2018 ? 24000 : params.year >= 2015 ? 20000 : 16000;
  }
  
  const depreciatedPrice = Math.max(basePrice - (vehicleAge * 2000), basePrice * 0.4);
  return depreciatedPrice;
}

async function calculateAdjustments(params: EnhancedValuationParams, basePrice: number): Promise<Array<{
  type: string;
  amount: number;
  reason: string;
}>> {
  const adjustments: Array<{
    type: string;
    amount: number;
    reason: string;
  }> = [];
  
  const avgMileagePerYear = 12000;
  const expectedMileage = (new Date().getFullYear() - params.year) * avgMileagePerYear;
  const mileageDifference = params.mileage - expectedMileage;
  
  if (Math.abs(mileageDifference) > 5000) {
    const mileageAdjustment = (mileageDifference / 1000) * -50;
    adjustments.push({
      type: 'mileage',
      amount: mileageAdjustment,
      reason: mileageDifference > 0 ? 'Higher than average mileage' : 'Lower than average mileage'
    });
  }
  
  const conditionMultipliers = {
    'excellent': 0.05,
    'good': 0,
    'fair': -0.1,
    'poor': -0.25
  };
  
  const conditionMultiplier = conditionMultipliers[params.condition as keyof typeof conditionMultipliers] || 0;
  if (conditionMultiplier !== 0) {
    adjustments.push({
      type: 'condition',
      amount: basePrice * conditionMultiplier,
      reason: `Vehicle condition: ${params.condition}`
    });
  }
  
  return adjustments;
}

async function generateValuationExplanation(
  params: EnhancedValuationParams,
  marketResult: any,
  finalValue: number,
  confidence: number
): Promise<string> {
  const vehicle = `${params.year} ${params.make} ${params.model}`;
  const listingsCount = marketResult.listings.length;
  
  if (listingsCount === 0) {
    return `This ${vehicle} valuation of ${finalValue.toLocaleString()} is based on MSRP-adjusted depreciation modeling due to limited current market listings. The ${confidence}% confidence reflects the synthetic nature of this estimate.`;
  }
  
  const avgMarketPrice = marketResult.listings.reduce((sum: number, l: MarketListing) => sum + l.price, 0) / listingsCount;
  
  return `This ${vehicle} valuation of ${finalValue.toLocaleString()} aligns with current market data from ${listingsCount} active listings. The ${confidence}% confidence reflects strong market validation.`;
}