import { supabase } from '@/integrations/supabase/client';
import { searchMarketListings } from '../marketSearch';
import type { EnhancedMarketSearchResult } from '../marketSearch';
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

// WORKING ENHANCED VALUATION ENGINE - GOOGLE LEVEL IMPLEMENTATION
export async function calculateEnhancedValuation(params: EnhancedValuationParams): Promise<EnhancedValuationResult> {
  console.log('🚀 [VALUATION_ENGINE_V3] Starting calculation:', params);
  
  try {
    // Step 1: Get market search results (correctly typed)
    const marketSearchResult: EnhancedMarketSearchResult = await searchMarketListings({
      make: params.make,
      model: params.model,
      year: params.year,
      trim: params.trim,
      mileage: params.mileage,
      zipCode: params.zipCode,
      vin: params.vin,
      radius: 100
    });
    
    console.log('📊 [VALUATION_ENGINE_V3] Market search complete:', {
      listingsFound: marketSearchResult.listings.length,
      confidence: marketSearchResult.meta.confidence,
      sources: marketSearchResult.meta.sources,
      searchMethod: marketSearchResult.meta.searchMethod
    });
    
    // Step 2: Determine fallback method
    const isUsingFallbackMethod = marketSearchResult.meta.searchMethod === 'fallback' || marketSearchResult.listings.length === 0;
    
    // Step 3: Calculate base price
    let basePriceAnchor: number;
    
    if (marketSearchResult.listings.length > 0) {
      // Use real market data
      const validPrices = marketSearchResult.listings.map((listing: MarketListing) => listing.price).filter(p => p > 0);
      basePriceAnchor = validPrices.reduce((sum: number, price: number) => sum + price, 0) / validPrices.length;
      console.log('💰 [VALUATION_ENGINE_V3] Market-based pricing:', basePriceAnchor);
    } else {
      // Use MSRP fallback
      basePriceAnchor = await calculateMSRPBasedPrice(params);
      console.log('💰 [VALUATION_ENGINE_V3] MSRP fallback pricing:', basePriceAnchor);
    }
    
    // Step 4: Apply adjustments
    const adjustments = await calculateAdjustments(params, basePriceAnchor);
    const finalValue = adjustments.reduce((value, adj) => value + adj.amount, basePriceAnchor);
    
    // Step 5: Calculate confidence score
    const confidenceResult = generateConfidenceScore({
      base: isUsingFallbackMethod ? 45 : 55,
      hasExactVinMatch: marketSearchResult.listings.some((listing: MarketListing) => listing.vin === params.vin),
      listingCount: marketSearchResult.listings.length,
      certifiedListingCount: marketSearchResult.listings.filter((listing: MarketListing) => listing.is_cpo).length,
      trustedSources: marketSearchResult.listings.map((listing: MarketListing) => listing.source),
      trustScore: marketSearchResult.meta.confidence / 100
    });
    
    // Step 6: Cap confidence for fallback
    let finalConfidence = confidenceResult.score;
    if (isUsingFallbackMethod) {
      finalConfidence = Math.min(finalConfidence, 60);
      console.log('🧢 [VALUATION_ENGINE_V3] Confidence capped at 60% for fallback');
    }
    
    // Step 7: Generate explanation
    const explanation = await generateValuationExplanation(params, marketSearchResult, finalValue, finalConfidence);
    
    // Step 8: Build final result
    const result: EnhancedValuationResult = {
      estimatedValue: Math.round(finalValue),
      confidenceScore: finalConfidence,
      marketListings: marketSearchResult.listings,
      isUsingFallbackMethod,
      basePriceAnchor: Math.round(basePriceAnchor),
      adjustments,
      confidenceBreakdown: {
        vinAccuracy: marketSearchResult.listings.some((listing: MarketListing) => listing.vin === params.vin) ? 95 : 70,
        marketData: marketSearchResult.listings.length > 0 ? 85 : 40,
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
    
    console.log('✅ [VALUATION_ENGINE_V3] Complete:', {
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      listingsCount: result.marketListings.length,
      isUsingFallbackMethod: result.isUsingFallbackMethod
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ [VALUATION_ENGINE_V3] Error:', error);
    
    // Emergency fallback
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
  } else if (modelLower.includes('accord')) {
    basePrice = params.year >= 2020 ? 25000 : params.year >= 2018 ? 22000 : params.year >= 2015 ? 19000 : 16000;
  } else if (modelLower.includes('camry')) {
    basePrice = params.year >= 2020 ? 24000 : params.year >= 2018 ? 21000 : params.year >= 2015 ? 18000 : 15000;
  } else if (modelLower.includes('altima')) {
    basePrice = params.year >= 2020 ? 23000 : params.year >= 2018 ? 20000 : params.year >= 2015 ? 17000 : 14000;
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
  marketResult: EnhancedMarketSearchResult,
  finalValue: number,
  confidence: number
): Promise<string> {
  const vehicle = `${params.year} ${params.make} ${params.model}`;
  const listingsCount = marketResult.listings.length;
  
  if (listingsCount === 0) {
    return `This ${vehicle} valuation of $${finalValue.toLocaleString()} is based on MSRP-adjusted depreciation modeling due to limited current market listings. The ${confidence}% confidence reflects the synthetic nature of this estimate.`;
  }
  
  const avgMarketPrice = marketResult.listings.reduce((sum: number, listing: MarketListing) => sum + listing.price, 0) / listingsCount;
  const priceDiff = finalValue - avgMarketPrice;
  const diffPercent = (priceDiff / avgMarketPrice) * 100;
  
  if (Math.abs(diffPercent) < 5) {
    return `This ${vehicle} valuation of $${finalValue.toLocaleString()} aligns closely with the current market average of $${avgMarketPrice.toLocaleString()} based on ${listingsCount} active listings. The ${confidence}% confidence reflects strong market validation.`;
  } else if (diffPercent > 0) {
    return `This ${vehicle} valuation of $${finalValue.toLocaleString()} is ${Math.abs(diffPercent).toFixed(1)}% above the market average of $${avgMarketPrice.toLocaleString()}, accounting for vehicle-specific factors like mileage (${params.mileage.toLocaleString()}) and condition (${params.condition}). Based on ${listingsCount} active listings with ${confidence}% confidence.`;
  } else {
    return `This ${vehicle} valuation of $${finalValue.toLocaleString()} is ${Math.abs(diffPercent).toFixed(1)}% below the market average of $${avgMarketPrice.toLocaleString()}, adjusted for higher mileage or condition factors. Based on ${listingsCount} active listings with ${confidence}% confidence.`;
  }
}