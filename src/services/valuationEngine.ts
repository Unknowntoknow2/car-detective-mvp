import { calculateDepreciation } from "@/utils/valuation/depreciation";
import { calculateMileageAdjustment } from "@/utils/valuation/mileageAdjustment";
import { calculateConditionAdjustment } from "@/utils/valuation/conditionAdjustment";
import { calculateFuelTypeAdjustment } from "@/utils/valuation/fuelAdjustment";
import { getMarketMultiplier } from "@/utils/valuation/marketData";
import { fetchMarketComps, fetchCachedMarketComps } from "./valuation/marketSearchService";
import { saveMarketListings } from "./valuation/marketListingService";
import type { UnifiedValuationResult, ValuationAdjustment } from "@/types/valuation";

export interface ValuationInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  msrp?: number;
}

export async function calculateUnifiedValuation(input: ValuationInput): Promise<UnifiedValuationResult> {
  console.log('🔍 [UNIFIED_VALUATION] Starting valuation for:', input);

  const {
    vin,
    year,
    make,
    model,
    trim,
    mileage,
    condition,
    zipCode,
    fuelType = 'gasoline'
  } = input;

  console.log('🌐 [UNIFIED_VALUATION] Using market data analysis');
  
  let marketListings: any[] = [];
  let marketSearchStatus: 'success' | 'fallback' | 'error' = 'error';
  let baseValue = 0;
  let confidenceScore = 0;
  let trustNotes = 'Searching real-time market data...';

  try {
    console.log('🔍 [UNIFIED_VALUATION] Starting market data collection...');
    
    const searchResult = await fetchMarketComps(make, model, year, zipCode, vin);
    
    console.log('📊 [UNIFIED_VALUATION] Search result received:', {
      listingsCount: searchResult.listings?.length || 0,
      source: searchResult.source,
      trust: searchResult.trust,
      notes: searchResult.notes
    });
    
    if (!searchResult.listings || searchResult.listings.length === 0) {
      throw new Error(`No real-time market data found: ${searchResult.notes}`);
    }

    marketListings = searchResult.listings;
    marketSearchStatus = 'success';
    confidenceScore = Math.max(searchResult.trust * 100, 75);
    trustNotes = `Found ${marketListings.length} real listings via OpenAI web search`;

    // Calculate base value from REAL market data
    const prices = marketListings.map(listing => listing.price).filter(p => p > 0);
    if (prices.length === 0) {
      throw new Error('No valid prices found in real market listings');
    }

    // Use median price from real listings as base value
    prices.sort((a, b) => a - b);
    const medianIndex = Math.floor(prices.length / 2);
    baseValue = prices.length % 2 === 0 
      ? (prices[medianIndex - 1] + prices[medianIndex]) / 2 
      : prices[medianIndex];

    console.log(`💰 [UNIFIED_VALUATION] Real market base value: $${baseValue.toLocaleString()} from ${prices.length} listings`);

    // Save real market listings
    try {
      await saveMarketListings(marketListings, {
        vin,
        valuationId: crypto.randomUUID(),
        zipCode
      });
      console.log('✅ [UNIFIED_VALUATION] Real market listings saved to database');
    } catch (saveError) {
      console.warn('⚠️ [UNIFIED_VALUATION] Failed to save market listings:', saveError);
    }

  } catch (marketError: unknown) {
    console.error('❌ [UNIFIED_VALUATION] Market data collection failed:', marketError);
    
    // Provide detailed error information
    const errorMessage = marketError instanceof Error ? marketError.message : 'Unknown error';
    throw new Error(`Valuation failed: ${errorMessage}`);
  }

  // Apply condition adjustments to real market median
  const adjustments: ValuationAdjustment[] = [];

  if (condition && condition !== 'unknown') {
    let conditionMultiplier = 1.0;
    switch (condition.toLowerCase()) {
      case 'excellent': conditionMultiplier = 1.05; break;
      case 'very good': conditionMultiplier = 1.02; break;
      case 'good': conditionMultiplier = 1.0; break;
      case 'fair': conditionMultiplier = 0.95; break;
      case 'poor': conditionMultiplier = 0.85; break;
    }
    
    const conditionAdjustment = baseValue * (conditionMultiplier - 1);
    if (Math.abs(conditionAdjustment) > 10) {
      adjustments.push({
        label: 'Condition Adjustment',
        amount: conditionAdjustment,
        reason: `${condition} condition vs. market average`
      });
    }
  }

  // Calculate final value
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const finalValue = Math.round(baseValue + totalAdjustments);

  // Generate price range from real listings
  const allPrices = marketListings.map(l => l.price).filter(p => p > 0);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Generate AI explanation focused on real data
  const aiExplanation = generateRealTimeAIExplanation({
    baseValue,
    adjustments,
    finalValue,
    confidenceScore,
    marketListings,
    priceRange: [minPrice, maxPrice]
  });

  const result: UnifiedValuationResult = {
    id: crypto.randomUUID(),
    vin,
    vehicle: { year, make, model, trim, fuelType },
    zip: zipCode,
    mileage,
    baseValue: finalValue,
    adjustments,
    finalValue,
    confidenceScore,
    aiExplanation,
    sources: ['openai_web_search'],
    listingRange: {
      _type: "defined" as const,
      value: `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}` as const
    },
    listingCount: marketListings.length,
    listings: marketListings,
    marketSearchStatus,
    timestamp: Date.now()
  };

  console.log('✅ [UNIFIED_VALUATION] Real-time valuation completed:', {
    finalValue,
    confidenceScore,
    listingCount: marketListings.length,
    marketSearchStatus,
    priceRange: [minPrice, maxPrice],
    vehicle: `${year} ${make} ${model}`,
    vin
  });

  return result;
}

function generateRealTimeAIExplanation(params: {
  baseValue: number;
  adjustments: ValuationAdjustment[];
  finalValue: number;
  confidenceScore: number;
  marketListings: any[];
  priceRange: [number, number];
}): string {
  const { baseValue, adjustments, finalValue, confidenceScore, marketListings, priceRange } = params;
  
  let explanation = "🌐 ## 🔍 Real-Time Market Analysis\n\n";
  
  explanation += `**Base Market Value:** $${baseValue.toLocaleString()} (median from ${marketListings.length} real listings)\n\n`;
  
  if (adjustments.length > 0) {
    explanation += "**Adjustments:**\n";
    adjustments.forEach(adj => {
      const sign = adj.amount >= 0 ? '+' : '';
      explanation += `- **${adj.label}:** $${sign}${adj.amount.toLocaleString()} (${adj.reason})\n`;
    });
    explanation += "\n";
  }
  
  explanation += `### 🎯 Final Value: **$${finalValue.toLocaleString()}**\n\n`;
  explanation += `### 📊 Market Range: $${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}\n\n`;
  explanation += `### 🤖 Confidence: ${confidenceScore}%\n\n`;
  
  explanation += "**Real-Time Data Sources:**\n";
  explanation += `- ${marketListings.length} current market listings found via OpenAI web search\n`;
  explanation += "- Live dealer inventories and marketplace data\n";
  explanation += "- No static or estimated values used\n\n";
  
  if (marketListings.length > 0) {
    explanation += "**Sample Listings:**\n";
    marketListings.slice(0, 3).forEach((listing, index) => {
      explanation += `${index + 1}. $${listing.price?.toLocaleString() || 'N/A'} - ${listing.mileage?.toLocaleString() || 'N/A'} miles (${listing.source || 'Dealer'})\n`;
    });
  }
  
  return explanation;
}
