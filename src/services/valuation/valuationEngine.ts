import { calculateMileageAdjustment } from '@/utils/valuation/mileageAdjustment';
import { calculateConditionAdjustment } from '@/utils/valuation/conditionAdjustment';
import { calculateTitleAdjustment } from '@/utils/valuation/titleAdjustment';
import { getMarketMultiplier } from '@/utils/valuation/marketData';
import { MarketDataService } from './marketDataService';
import { searchMarketListings } from '@/services/valuation/marketSearchAgent';
import { estimateMarketPrice } from '@/agents/marketPriceEstimator';
import { supabase } from '@/integrations/supabase/client';
import { valuationLogger } from '@/utils/valuationLogger';
import { processFollowUpData, ValuationAdjustment } from './followUpDataCalculators';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// ✅ PHASE 2: Source weighting for confidence calculation
const SOURCE_WEIGHTS = {
  'cars.com': 1.0,
  'autotrader.com': 1.0,
  'carfax.com': 0.9,
  'cargurus.com': 0.9,
  'carmax.com': 0.85,
  'carvana.com': 0.85,
  'ebay.com': 0.8,
  'craigslist.org': 0.6,
  'facebook marketplace': 0.6,
  'facebook.com': 0.6
} as const;

export interface ValuationEngineInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  decodedVehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    bodyType?: string;
  };
  fuelType?: string;
  titleStatus?: string;
  followUpData?: any;
}

export interface UnifiedValuationResult {
  finalValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  marketListings: any[];
  zipAdjustment: number;
  mileagePenalty: number;
  conditionDelta: number;
  titlePenalty: number;
  aiExplanation: string;
  sourcesUsed: string[];
  adjustments: any[];
  baseValue: number;
  explanation: string;
}

/**
 * Main valuation engine that processes vehicle data and returns comprehensive results
 */
export async function calculateUnifiedValuation(input: ValuationEngineInput): Promise<UnifiedValuationResult> {
  valuationLogger.valuationEngine(input.vin, 'calculation-start', {
    zipCode: input.zipCode,
    mileage: input.mileage,
    vehicle: {
      year: input.decodedVehicle.year,
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      trim: input.decodedVehicle.trim
    }
  }, true);

  try {
    // ✅ PHASE 2: Radius retry logic - try 100 miles first, then 200 miles
    valuationLogger.valuationEngine(input.vin, 'market-search-start', { radius: 100 }, true);
    
    let marketSearchResult = await searchMarketListings({
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      trim: input.decodedVehicle.trim,
      mileage: input.mileage,
      zipCode: input.zipCode,
      radius: 100
    });

    // If insufficient listings, retry with wider radius
    if (marketSearchResult.listings.length < 5) {
      valuationLogger.valuationEngine(input.vin, 'market-search-retry', { 
        firstAttemptResults: marketSearchResult.listings.length,
        retryRadius: 200 
      }, true);
      
      marketSearchResult = await searchMarketListings({
        make: input.decodedVehicle.make,
        model: input.decodedVehicle.model,
        year: input.decodedVehicle.year,
        trim: input.decodedVehicle.trim,
        mileage: input.mileage,
        zipCode: input.zipCode,
        radius: 200
      });
    }

    const marketListings = marketSearchResult.listings;
    
    valuationLogger.valuationEngine(input.vin, 'market-analysis', { 
      listingsFound: marketListings?.length || 0,
      usedOpenAIFallback: marketSearchResult.searchMethod === 'openai' || false,
      sources: [marketSearchResult.source]
    }, true);
    
    if (!marketListings || marketListings.length < 5) {
      valuationLogger.valuationEngine(input.vin, 'insufficient-data', { 
        listingsFound: marketListings?.length || 0,
        minimumRequired: 5
      }, false, 'Insufficient market data for accurate valuation');
      
      return {
        finalValue: 0,
        priceRange: [0, 0],
        confidenceScore: 0,
        marketListings: [],
        zipAdjustment: 0,
        mileagePenalty: 0,
        conditionDelta: 0,
        titlePenalty: 0,
        aiExplanation: `❌ Unable to provide accurate valuation: Only ${marketListings?.length || 0} live market listings found. We need at least 5 current listings to ensure pricing accuracy. Please try again later or widen your search radius.`,
        sourcesUsed: ['insufficient_data'],
        adjustments: [],
        baseValue: 0,
        explanation: `No sufficient market data available. Found ${marketListings?.length || 0}/5 required listings.`
      };
    }

    // ✅ PHASE 2: Parse prices and calculate median from real listings
    const validPrices = marketListings
      .map((listing: any) => {
        if (typeof listing.price === 'number') return listing.price;
        if (typeof listing.price === 'string') {
          return parseFloat(listing.price.replace(/[^0-9.]/g, ''));
        }
        return 0;
      })
      .filter((price): price is number => price > 1000 && price < 500000); // Reasonable price range

    if (validPrices.length < 5) {
      console.error(`❌ Insufficient valid pricing data: Only ${validPrices.length} valid prices found`);
      return {
        finalValue: 0,
        priceRange: [0, 0],
        confidenceScore: 0,
        marketListings: [],
        zipAdjustment: 0,
        mileagePenalty: 0,
        conditionDelta: 0,
        titlePenalty: 0,
        aiExplanation: `❌ Unable to provide accurate valuation: Only ${validPrices.length} listings with valid pricing found. We need at least 5 listings with reliable pricing data.`,
        sourcesUsed: ['insufficient_pricing_data'],
        adjustments: [],
        baseValue: 0,
        explanation: `Insufficient pricing data. Found ${validPrices.length}/5 required valid prices.`
      };
    }

    // Calculate median price (more robust than average)
    const sortedPrices = validPrices.sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    
    // ✅ PHASE 2: Source-weighted confidence calculation
    const weightedConfidence = marketListings.reduce((sum, listing) => {
      const source = listing.source?.toLowerCase() || '';
      let weight = 0.5; // Default weight
      
      // Match against source weights
      for (const [weightedSource, sourceWeight] of Object.entries(SOURCE_WEIGHTS)) {
        if (source.includes(weightedSource.toLowerCase().replace('.com', ''))) {
          weight = sourceWeight;
          break;
        }
      }
      
      return sum + weight;
    }, 0);

    const sourceBasedConfidence = Math.min(95, Math.round((weightedConfidence / marketListings.length) * 100));
    const baseValue = medianPrice;
    const listingsSource = 'enhanced_market_analysis';
    const marketConfidence = sourceBasedConfidence;

    valuationLogger.valuationEngine(input.vin, 'pricing-calculated', {
      baseValue,
      validPricesCount: validPrices.length,
      confidenceScore: marketConfidence,
      priceRange: [Math.min(...validPrices), Math.max(...validPrices)],
      listingsAnalyzed: marketListings.length
    }, true);

    // 3. Fetch traditional market data as backup context only (not for valuation)
    console.log('📊 Fetching traditional market data for context...');
    const marketData = await MarketDataService.fetchMarketData({
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      zipCode: input.zipCode,
      vin: input.vin,
      condition: input.condition
    });

    console.log(`💰 Base value: $${baseValue} (source: ${listingsSource}, confidence: ${marketConfidence}%)`);

    // 5. Calculate traditional adjustments
    const mileagePenalty = calculateMileageAdjustment(input.mileage, input.decodedVehicle.year);
    const conditionDelta = calculateConditionAdjustment(input.condition, baseValue);
    const titlePenalty = calculateTitleAdjustment(input.titleStatus || 'clean', baseValue);
    const zipAdjustment = await getMarketMultiplier(input.zipCode);

    // 🚀 NEW: Process follow-up data for comprehensive valuation
    let followUpAdjustments: ValuationAdjustment[] = [];
    let followUpTotal = 0;
    let confidenceBoost = 0;
    let dataCompleteness = 0;
    
    if (input.followUpData) {
      valuationLogger.valuationEngine(input.vin, 'followup-processing', {
        hasFollowUpData: true,
        fieldsPresent: Object.keys(input.followUpData).length
      }, true);
      
      const followUpResult = processFollowUpData(input.followUpData as FollowUpAnswers, baseValue);
      followUpAdjustments = followUpResult.adjustments;
      followUpTotal = followUpResult.totalAdjustment;
      confidenceBoost = followUpResult.confidenceBoost;
      dataCompleteness = followUpResult.dataCompleteness;
      
      console.log('🔍 Follow-up data analysis:', {
        adjustmentsCount: followUpAdjustments.length,
        totalAdjustment: followUpTotal,
        confidenceBoost,
        dataCompleteness
      });
    }

    console.log('📈 All adjustments:', {
      mileagePenalty,
      conditionDelta,
      titlePenalty,
      zipAdjustment,
      followUpTotal,
      followUpAdjustmentsCount: followUpAdjustments.length
    });

    // 6. Calculate final value with all adjustments
    const zipMultiplier = 1 + (zipAdjustment / 100);
    const finalValue = Math.round(
      (baseValue + conditionDelta + titlePenalty + mileagePenalty + followUpTotal) * zipMultiplier
    );

    // 7. Enhanced confidence calculation with follow-up data boost
    let confidenceScore = Math.min(100, marketConfidence + confidenceBoost);
    
    // 8. Calculate price range based on actual price spread and confidence
    const variabilityFactor = Math.max(0.05, (100 - confidenceScore) / 1000); // More confident = tighter range
    const priceRange: [number, number] = [
      Math.round(finalValue * (1 - variabilityFactor)),
      Math.round(finalValue * (1 + variabilityFactor))
    ];

    // 9. Create comprehensive adjustments array
    const adjustments: any[] = [
      ...followUpAdjustments.map(adj => ({
        factor: adj.factor,
        impact: adj.impact,
        description: adj.description,
        source: adj.source,
        confidence: adj.confidence
      })),
      {
        factor: 'Mileage',
        impact: mileagePenalty,
        description: `${input.mileage.toLocaleString()} miles for ${input.decodedVehicle.year} ${input.decodedVehicle.make}`,
        source: 'calculated',
        confidence: 90
      },
      {
        factor: 'Condition',
        impact: conditionDelta,
        description: `Vehicle is in ${input.condition} condition`,
        source: 'calculated',
        confidence: 85
      },
      {
        factor: 'Title Status',
        impact: titlePenalty,
        description: `${input.titleStatus || 'clean'} title status`,
        source: 'calculated',
        confidence: 95
      },
      {
        factor: 'Regional Market',
        impact: Math.round((finalValue / zipMultiplier) * (zipAdjustment / 100)),
        description: `Market conditions in ZIP ${input.zipCode}`,
        source: 'calculated',
        confidence: 80
      }
    ].filter(adj => adj.impact !== 0);

    // 10. Generate enhanced AI explanation with comprehensive insights
    const aiExplanation = generatePhase2AIExplanation(input, marketData, finalValue, confidenceScore, marketListings, validPrices);
    
    valuationLogger.valuationEngine(input.vin, 'enhanced-explanation', {
      hasFollowUpData: !!input.followUpData,
      adjustmentsCount: adjustments.length,
      followUpAdjustments: followUpAdjustments.length,
      confidenceWithBoost: confidenceScore,
      dataCompleteness
    }, true);

    // 11. ✅ PHASE 2: Transform listings to expected format using real market data
    const transformedListings = marketListings.map((listing, index) => ({
      id: `market_${index}`,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location || listing.zip,
      url: listing.link || listing.listingUrl,
      source: listing.source,
      dealer: listing.dealerName || listing.dealer_name || listing.source,
      condition: listing.condition,
      is_cpo: listing.isCpo || listing.is_cpo || false,
      confidence_score: sourceBasedConfidence,
      fetched_at: listing.fetchedAt || listing.fetched_at || new Date().toISOString()
    }));

    valuationLogger.valuationEngine(input.vin, 'calculation-complete', {
      finalValue,
      confidenceScore,
      marketListingsCount: marketListings.length,
      validPricesCount: validPrices.length,
      medianPrice,
      usedOpenAIFallback: marketSearchResult.searchMethod === 'openai' || false,
      sourcesUsed: ['enhanced_market_analysis', 'source_weighted_confidence', 'median_pricing']
    }, true);

    return {
      finalValue,
      priceRange,
      confidenceScore,
      marketListings: transformedListings,
      zipAdjustment,
      mileagePenalty,
      conditionDelta,
      titlePenalty,
      aiExplanation,
      sourcesUsed: ['enhanced_market_analysis', 'source_weighted_confidence', 'median_pricing'],
      adjustments,
      baseValue,
      explanation: aiExplanation
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    valuationLogger.valuationEngine(input.vin, 'calculation-error', { 
      error: errorMessage 
    }, false, errorMessage);
    
    // Return fallback result
    const fallbackValue = estimateBaseValue(input.decodedVehicle);
    
    return {
      finalValue: fallbackValue,
      priceRange: [Math.round(fallbackValue * 0.9), Math.round(fallbackValue * 1.1)],
      confidenceScore: 35,
      marketListings: [],
      zipAdjustment: 0,
      mileagePenalty: 0,
      conditionDelta: 0,
      titlePenalty: 0,
      aiExplanation: 'Valuation based on fallback estimation due to data issues',
      sourcesUsed: ['fallback_estimation'],
      adjustments: [],
      baseValue: fallbackValue,
      explanation: 'Fallback valuation due to system error'
    };
  }
}

/**
 * Estimate base value when no market data is available
 */
function estimateBaseValue(vehicle: ValuationEngineInput['decodedVehicle']): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicle.year;
  
  // Base estimates by make/model
  const makeEstimates: Record<string, number> = {
    'TOYOTA': 25000,
    'HONDA': 22000,
    'FORD': 20000,
    'CHEVROLET': 18000,
    'NISSAN': 19000,
    'HYUNDAI': 17000,
    'BMW': 35000,
    'MERCEDES': 40000,
    'AUDI': 32000,
    'LEXUS': 30000
  };

  const baseMakeValue = makeEstimates[vehicle.make.toUpperCase()] || 20000;
  
  // Apply age depreciation (roughly 10% per year)
  const depreciationRate = 0.10;
  const depreciatedValue = baseMakeValue * Math.pow(1 - depreciationRate, vehicleAge);
  
  // Ensure minimum value
  return Math.max(Math.round(depreciatedValue), 5000);
}

/**
 * ✅ ENHANCED: Generate comprehensive AI explanation with follow-up data insights
 */
function generatePhase2AIExplanation(
  input: ValuationEngineInput,
  marketData: any,
  finalValue: number,
  confidenceScore: number,
  marketListings: any[],
  validPrices: number[]
): string {
  const vehicleDescription = `${input.decodedVehicle.year} ${input.decodedVehicle.make} ${input.decodedVehicle.model}`;
  
  let explanation = `Your ${vehicleDescription} has an estimated market value of $${finalValue.toLocaleString()}. `;
  
  // Market analysis explanation
  if (marketListings && marketListings.length >= 5) {
    const sources = [...new Set(marketListings.map(l => l.source))];
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    const medianPrice = validPrices.sort((a, b) => a - b)[Math.floor(validPrices.length / 2)];
    
    explanation += `✅ This valuation is based on real-time analysis of ${marketListings.length} live market listings `;
    explanation += `from ${sources.length} trusted sources including ${sources.slice(0, 3).join(', ')}${sources.length > 3 ? ` and ${sources.length - 3} others` : ''}. `;
    explanation += `Prices range from $${minPrice.toLocaleString()} to $${maxPrice.toLocaleString()}, `;
    explanation += `with a median price of $${medianPrice.toLocaleString()}. `;
  } else if (marketData.listings.length > 0) {
    explanation += `This valuation is based on ${marketData.listings.length} similar vehicles from our database, `;
    explanation += `with an average price of $${marketData.averagePrice.toLocaleString()}. `;
  } else {
    explanation += `⚠️ Limited market data available. This estimate uses industry depreciation models. `;
  }

  // 🚀 NEW: Follow-up data insights
  if (input.followUpData) {
    const followUp = input.followUpData as FollowUpAnswers;
    
    // Service history insights
    if (followUp.serviceHistory?.hasRecords) {
      if (followUp.serviceHistory.regularMaintenance) {
        explanation += ` Your documented regular maintenance history positively impacts the valuation.`;
      }
      if (followUp.serviceHistory.dealerMaintained) {
        explanation += ` Dealer-maintained service records add credibility and value.`;
      }
    } else {
      explanation += ` Limited service records may slightly affect buyer confidence.`;
    }

    // Accident history insights
    if (followUp.accidents?.hadAccident === false) {
      explanation += ` The clean accident history enhances your vehicle's appeal.`;
    } else if (followUp.accidents?.hadAccident) {
      if (followUp.accidents.frameDamage) {
        explanation += ` Frame damage significantly impacts the valuation as noted.`;
      } else {
        explanation += ` Previous accident history has been factored into the pricing.`;
      }
    }

    // Condition details
    if (followUp.tire_condition === 'excellent' || followUp.brake_condition === 'excellent') {
      explanation += ` Excellent tire and brake condition adds to the overall value.`;
    } else if (followUp.tire_condition === 'poor' || followUp.brake_condition === 'poor') {
      explanation += ` Tire or brake replacement needs have been considered in the valuation.`;
    }

    // Dashboard lights
    if (followUp.dashboard_lights && followUp.dashboard_lights.length > 0) {
      explanation += ` Active dashboard warning lights reduce the estimated value as they indicate potential repair needs.`;
    }

    // Modifications
    if (followUp.modifications?.hasModifications) {
      if (followUp.modifications.reversible) {
        explanation += ` Vehicle modifications are reversible, which minimizes impact on resale value.`;
      } else {
        explanation += ` Permanent modifications may affect marketability to general buyers.`;
      }
    }

    // Additional notes insights
    if (followUp.additional_notes && followUp.additional_notes.length > 20) {
      const notes = followUp.additional_notes.toLowerCase();
      if (notes.includes('garage') || notes.includes('covered')) {
        explanation += ` Garage-kept storage helps preserve vehicle condition.`;
      }
      if (notes.includes('smoke') && notes.includes('free')) {
        explanation += ` Smoke-free environment enhances interior value.`;
      }
      if (notes.includes('highway')) {
        explanation += ` Highway miles typically result in less wear than city driving.`;
      }
    }
  }
  
  // Traditional factors
  if (input.mileage > 100000) {
    explanation += ` The higher mileage (${input.mileage.toLocaleString()} miles) has been factored into the valuation.`;
  }
  
  if (input.condition !== 'excellent') {
    explanation += ` The ${input.condition} condition has been considered in the final estimate.`;
  }
  
  explanation += ` Regional market conditions for ZIP ${input.zipCode} have also been applied.`;
  explanation += ` Our ${confidenceScore}% confidence score reflects data quality and completeness.`;
  
  return explanation;
}
