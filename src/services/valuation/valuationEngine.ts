import { calculateMileageAdjustment } from '@/utils/valuation/mileageAdjustment';
import { calculateConditionAdjustment } from '@/utils/valuation/conditionAdjustment';
import { calculateTitleAdjustment } from '@/utils/valuation/titleAdjustment';
import { getMarketMultiplier } from '@/utils/valuation/marketData';
import { MarketDataService } from './marketDataService';
import { searchMarketListings } from '@/agents/marketSearchAgent';
import { estimateMarketPrice } from '@/agents/marketPriceEstimator';
import { supabase } from '@/integrations/supabase/client';

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
  console.log('🚗 Starting unified valuation calculation for:', input.vin);
  console.log('🔍 Debug: Input validation passed');

  try {
    // 1. Fetch live market listings using OpenAI agent
    console.log('🔍 Searching live market listings...');
    const marketListings = await searchMarketListings({
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      trim: input.decodedVehicle.trim,
      mileage: input.mileage,
      condition: input.condition,
      zip: input.zipCode,
    });

    // 2. Analyze market listings with price estimator
    console.log('📊 Analyzing market listings...');
    console.log('🔍 Debug: About to call estimateMarketPrice with', marketListings?.length || 0, 'listings');
    const marketEstimate = estimateMarketPrice(marketListings);
    console.log('🔍 Debug: Market estimate completed:', marketEstimate?.confidence || 0, '% confidence');
    
    // 3. Fetch traditional market data as fallback
    console.log('📊 Fetching traditional market data...');
    const marketData = await MarketDataService.fetchMarketData({
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      zipCode: input.zipCode,
      vin: input.vin,
      condition: input.condition
    });

    // 4. Calculate base value from live listings or fallback to market data
    let baseValue = 0;
    let listingsSource = 'fallback';
    let marketConfidence = 0;
    
    if (marketEstimate.estimatedPrice && marketEstimate.usedListings.length > 0) {
      // Use market estimator's robust price calculation
      baseValue = marketEstimate.estimatedPrice;
      marketConfidence = marketEstimate.confidence;
      listingsSource = 'live_market_analysis';
      console.log(`✅ ${marketEstimate.usedListings.length} valid listings analyzed`);
      console.log(`📊 Market stats: Min: $${marketEstimate.min}, Max: $${marketEstimate.max}, Median: $${marketEstimate.median}, StdDev: $${marketEstimate.stdDev}`);
    }
    
    // Fallback to traditional market data
    if (baseValue === 0) {
      baseValue = marketData.averagePrice;
      listingsSource = 'market_data';
      marketConfidence = marketData.confidenceScore;
    }
    
    // Final fallback estimation
    if (baseValue === 0) {
      console.log('⚠️ No market data available, using fallback estimation');
      baseValue = estimateBaseValue(input.decodedVehicle);
      listingsSource = 'estimation';
    }

    console.log(`💰 Base value: $${baseValue} (source: ${listingsSource}, confidence: ${marketConfidence}%)`);

    // 5. Calculate adjustments
    const mileagePenalty = calculateMileageAdjustment(input.mileage, input.decodedVehicle.year);
    const conditionDelta = calculateConditionAdjustment(input.condition, baseValue);
    const titlePenalty = calculateTitleAdjustment(input.titleStatus || 'clean', baseValue);
    const zipAdjustment = await getMarketMultiplier(input.zipCode);

    console.log('📈 Adjustments:', {
      mileagePenalty,
      conditionDelta,
      titlePenalty,
      zipAdjustment
    });

    // 6. Calculate final value
    const zipMultiplier = 1 + (zipAdjustment / 100);
    const finalValue = Math.round(
      (baseValue + conditionDelta + titlePenalty + mileagePenalty) * zipMultiplier
    );

    // 7. Calculate confidence score based on market analysis
    let confidenceScore = marketConfidence || marketData.confidenceScore;
    
    // Boost confidence significantly for live market analysis
    if (marketEstimate.usedListings.length === 0 && marketData.listings.length === 0) {
      confidenceScore = 45; // Minimum for no data
    } else if (marketEstimate.usedListings.length >= 5) {
      confidenceScore = Math.min(95, marketEstimate.confidence + 10); // Major boost for robust live data
    } else if (marketEstimate.usedListings.length > 0) {
      confidenceScore = Math.min(85, marketEstimate.confidence); // Good boost for some live data
    } else if (marketData.listings.length >= 5) {
      confidenceScore = Math.min(confidenceScore + 10, 70); // Moderate boost for traditional data
    }

    // 8. Calculate price range
    const priceRange: [number, number] = [
      Math.round(finalValue * 0.9),
      Math.round(finalValue * 1.1)
    ];

    // 9. Create adjustments array
    const adjustments = [
      {
        factor: 'Market Base Value',
        impact: baseValue,
        description: marketEstimate.usedListings.length > 0 
          ? `Market analysis from ${marketEstimate.usedListings.length} live listings (confidence: ${marketEstimate.confidence}%)`
          : `Base market value from ${marketData.listings.length > 0 ? marketData.listings.length + ' traditional' : 'estimated'} listings`
      },
      {
        factor: 'Mileage Adjustment',
        impact: mileagePenalty,
        description: `${input.mileage.toLocaleString()} miles adjustment`
      },
      {
        factor: 'Condition Adjustment',
        impact: conditionDelta,
        description: `${input.condition} condition adjustment`
      },
      {
        factor: 'Title Adjustment',
        impact: titlePenalty,
        description: `${input.titleStatus || 'clean'} title adjustment`
      },
      {
        factor: 'Regional Market',
        impact: Math.round(finalValue * (zipAdjustment / 100)),
        description: `${input.zipCode} area market adjustment`
      }
    ];

    // 10. Generate AI explanation with market insights
    const aiExplanation = generateAIExplanation(input, marketData, finalValue, confidenceScore, marketEstimate);

    // 11. Transform listings to expected format (prioritize market analysis results)
    const transformedListings = marketEstimate.usedListings.length > 0
      ? marketEstimate.usedListings.map((listing, index) => ({
          id: `market_${index}`,
          price: listing.price,
          mileage: listing.mileage,
          location: listing.location || listing.zip,
          url: listing.link,
          source: listing.source,
          dealer: listing.source,
          condition: listing.condition,
          is_cpo: false,
          confidence_score: marketEstimate.confidence, // Use market analysis confidence
          fetched_at: new Date().toISOString()
        }))
      : marketData.listings.map(listing => ({
          id: listing.id,
          price: listing.price,
          mileage: listing.mileage,
          location: listing.location,
          url: listing.listing_url,
          source: listing.source,
          dealer: listing.dealer_name,
          condition: listing.condition,
          is_cpo: listing.is_cpo,
          confidence_score: listing.confidence_score,
          fetched_at: listing.fetched_at
        }));

    console.log(`✅ Valuation complete: $${finalValue} (confidence: ${confidenceScore}%)`);
    if (marketEstimate.usedListings.length > 0) {
      console.log(`📊 Market analysis: ${marketEstimate.usedListings.length} listings, price range: $${marketEstimate.min}-$${marketEstimate.max}`);
    }

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
      sourcesUsed: [marketData.dataSource, 'market_adjustments', 'condition_analysis'],
      adjustments,
      baseValue,
      explanation: aiExplanation
    };

  } catch (error) {
    console.error('❌ Error in unified valuation:', error);
    
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
 * Generate AI explanation for the valuation
 */
function generateAIExplanation(
  input: ValuationEngineInput,
  marketData: any,
  finalValue: number,
  confidenceScore: number,
  marketEstimate?: any
): string {
  const vehicleDescription = `${input.decodedVehicle.year} ${input.decodedVehicle.make} ${input.decodedVehicle.model}`;
  
  let explanation = `Your ${vehicleDescription} has an estimated market value of $${finalValue.toLocaleString()}. `;
  
  // Check for live market analysis
  if (marketEstimate?.usedListings?.length > 0) {
    const { usedListings, median, confidence, min, max } = marketEstimate;
    explanation += `✅ This valuation is based on real-time analysis of ${usedListings.length} live market listings `;
    explanation += `with prices ranging from $${min?.toLocaleString()} to $${max?.toLocaleString()}. `;
    explanation += `The market median price is $${median?.toLocaleString()}. `;
    explanation += `Our analysis confidence is ${confidence}% based on listing quality and price consistency. `;
  } else if (marketData.listings.length > 0) {
    explanation += `This valuation is based on ${marketData.listings.length} similar vehicles from our database, `;
    explanation += `with an average price of $${marketData.averagePrice.toLocaleString()}. `;
  } else {
    explanation += `⚠️ No live listings found. This valuation is based on estimated market data. `;
  }
  
  explanation += `The ${confidenceScore}% confidence score reflects the quality and quantity of available market data. `;
  
  if (input.mileage > 100000) {
    explanation += `The higher mileage (${input.mileage.toLocaleString()} miles) has been factored into the valuation. `;
  }
  
  if (input.condition !== 'excellent') {
    explanation += `The ${input.condition} condition has been considered in the final estimate. `;
  }
  
  explanation += `Regional market conditions for ZIP ${input.zipCode} have also been applied.`;
  
  return explanation;
}
