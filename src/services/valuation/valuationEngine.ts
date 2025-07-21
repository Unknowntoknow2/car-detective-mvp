import { calculateMileageAdjustment } from './mileageAdjustment';
import { calculateConditionAdjustment } from './conditionAdjustment';
import { calculateTitleAdjustment } from './titleAdjustment';
import { getMarketMultiplier } from '@/utils/valuation/marketData';
import { MarketDataService } from './marketDataService';
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

  try {
    // 1. Fetch real market data
    console.log('📊 Fetching market data...');
    const marketData = await MarketDataService.fetchMarketData({
      make: input.decodedVehicle.make,
      model: input.decodedVehicle.model,
      year: input.decodedVehicle.year,
      zipCode: input.zipCode,
      vin: input.vin,
      condition: input.condition
    });

    // 2. Calculate base value from market data
    let baseValue = marketData.averagePrice;
    
    // If no market data, use fallback estimation
    if (baseValue === 0) {
      console.log('⚠️ No market data available, using fallback estimation');
      baseValue = estimateBaseValue(input.decodedVehicle);
    }

    console.log(`💰 Base value: $${baseValue}`);

    // 3. Calculate adjustments
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

    // 4. Calculate final value
    const zipMultiplier = 1 + (zipAdjustment / 100);
    const finalValue = Math.round(
      (baseValue + conditionDelta + titlePenalty + mileagePenalty) * zipMultiplier
    );

    // 5. Calculate confidence score
    let confidenceScore = marketData.confidenceScore;
    
    // Adjust confidence based on data quality
    if (marketData.listings.length === 0) {
      confidenceScore = Math.max(confidenceScore, 45); // Minimum for no market data
    } else if (marketData.listings.length >= 5) {
      confidenceScore = Math.min(confidenceScore + 10, 90); // Boost for good data
    }

    // 6. Calculate price range
    const priceRange: [number, number] = [
      Math.round(finalValue * 0.9),
      Math.round(finalValue * 1.1)
    ];

    // 7. Create adjustments array
    const adjustments = [
      {
        factor: 'Market Base Value',
        impact: baseValue,
        description: `Base market value from ${marketData.listings.length} listings`
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

    // 8. Generate AI explanation
    const aiExplanation = generateAIExplanation(input, marketData, finalValue, confidenceScore);

    // 9. Transform market listings to expected format
    const transformedListings = marketData.listings.map(listing => ({
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
  confidenceScore: number
): string {
  const vehicleDescription = `${input.decodedVehicle.year} ${input.decodedVehicle.make} ${input.decodedVehicle.model}`;
  
  let explanation = `Your ${vehicleDescription} has an estimated market value of $${finalValue.toLocaleString()}. `;
  
  if (marketData.listings.length > 0) {
    explanation += `This valuation is based on ${marketData.listings.length} similar vehicles currently listed for sale, `;
    explanation += `with an average price of $${marketData.averagePrice.toLocaleString()}. `;
  } else {
    explanation += `This valuation is based on estimated market data as no exact matches were found. `;
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
