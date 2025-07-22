
import { supabase } from '@/integrations/supabase/client';
import { MarketListing, ValuationInput } from '@/types/valuation';
import { calculateUnifiedConfidence, generateConfidenceExplanation } from '@/utils/valuation/calculateUnifiedConfidence';
import { AdjustmentEngine } from '@/services/adjustmentEngine';
import { ValidatedAdjustment } from '@/types/adjustments';
import { searchMarketListings } from '@/agents/marketSearchAgent';

export interface EnhancedValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  marketIntelligence: {
    medianPrice: number;
    averagePrice: number;
    sampleSize: number;
    inventoryLevel: string;
    demandIndicator: number;
    debugInfo?: {
      totalFound: number;
      afterTrimFilter: number;
      trimFallbackUsed: boolean;
      filters: Record<string, any>;
    };
  };
  marketListings: MarketListing[];
  adjustments: ValidatedAdjustment[];
  basePriceAnchor: {
    source: string;
    amount: number;
    method: string;
  };
  sources: string[];
  isFallbackMethod: boolean;
  explanation: string;
  zipCode?: string;
  vin?: string;
}

export async function calculateEnhancedValuation(input: ValuationInput): Promise<EnhancedValuationResult> {
  console.log('🔍 Enhanced Valuation Engine - Starting calculation for:', {
    make: input.make,
    model: input.model,
    year: input.year,
    zipCode: input.zipCode,
    vin: input.vin
  });

  // Step 1: Use UNIFIED market search agent (live search → database fallback)
  console.log('🔍 Using Unified Market Search Agent for listings...');
  
  const realListings = await searchMarketListings({
    make: input.make || '',
    model: input.model || '',
    year: input.year,
    trim: input.trim,
    zipCode: input.zipCode
  });

  console.log(`📊 Unified agent returned ${realListings.length} listings`);
  
  // Track listing source for transparency
  const listingSource = realListings.length > 0 && realListings[0].source_type === 'live' ? 'live' : 'database';
  console.log(`📡 Listing source: ${listingSource}`);

  // Enhanced trim matching with fallback logic
  let trimMatchedListings = realListings;
  let trimFallbackUsed = false;

  if (input.trim && input.trim.trim() && realListings.length > 0) {
    // Try exact trim match first
    const exactTrimMatches = realListings.filter(l => 
      l.trim && l.trim.toLowerCase().includes(input.trim!.toLowerCase())
    );

    if (exactTrimMatches.length >= 2) {
      trimMatchedListings = exactTrimMatches;
      console.log(`✅ Found ${exactTrimMatches.length} exact trim matches for "${input.trim}"`);
    } else {
      // Use fuzzy matching or all listings if insufficient exact matches
      const fuzzyTrimMatches = realListings.filter(l => 
        !l.trim || l.trim.toLowerCase() === 'unknown' || 
        (l.trim && (
          l.trim.toLowerCase().includes(input.trim!.toLowerCase()) ||
          input.trim!.toLowerCase().includes(l.trim.toLowerCase())
        ))
      );
      
      if (fuzzyTrimMatches.length > exactTrimMatches.length) {
        trimMatchedListings = fuzzyTrimMatches;
        trimFallbackUsed = true;
        console.log(`⚠️ Using fuzzy trim matching: ${fuzzyTrimMatches.length} listings`);
      } else {
        trimMatchedListings = realListings; // Use all if no good matches
        trimFallbackUsed = true;
        console.log(`⚠️ Using all listings due to insufficient trim matches`);
      }
    }
  }

  const finalListings = trimMatchedListings.slice(0, 20); // Limit final results
  console.log(`📊 Final filtered listings: ${finalListings.length}`);

  // Step 2: Calculate market intelligence 
  let marketIntelligence = {
    medianPrice: 0,
    averagePrice: 0,
    sampleSize: finalListings.length,
    inventoryLevel: 'low' as const,
    demandIndicator: 0.5,
    debugInfo: {
      totalFound: realListings.length,
      afterTrimFilter: finalListings.length,
      trimFallbackUsed,
      filters: {
        make: input.make,
        model: input.model,
        year: input.year,
        trim: input.trim,
        zipCode: input.zipCode,
        withinDays: 30
      }
    }
  };

  if (realListings.length > 0) {
    try {
      const { data: intelligenceData, error: intelligenceError } = await supabase
        .rpc('calculate_market_intelligence', {
          p_make: input.make,
          p_model: input.model,
          p_year: input.year,
          p_zip_code: input.zipCode || '00000',
          p_radius_miles: 100
        });

      if (!intelligenceError && intelligenceData && intelligenceData.length > 0) {
        const intel = intelligenceData[0];
        marketIntelligence = {
          ...marketIntelligence,
          medianPrice: intel.median_price || 0,
          averagePrice: intel.average_price || 0,
          sampleSize: intel.sample_size || realListings.length,
          inventoryLevel: intel.inventory_level || 'low',
          demandIndicator: intel.demand_indicator || 0.5
        };
        console.log('📈 Market Intelligence calculated:', {
          sample_size: marketIntelligence.sampleSize,
          median_price: marketIntelligence.medianPrice,
          average_price: marketIntelligence.averagePrice,
          confidence_score: intel.confidence_score
        });
      } else {
        console.error('⚠️ Database function returned no data:', intelligenceError);
        // Fallback calculation from direct listings
        const prices = realListings.map(l => l.price).filter(p => p > 0).sort((a, b) => a - b);
        if (prices.length > 0) {
          const medianIndex = Math.floor(prices.length / 2);
          marketIntelligence.medianPrice = prices.length % 2 === 0 
            ? (prices[medianIndex - 1] + prices[medianIndex]) / 2 
            : prices[medianIndex];
          marketIntelligence.averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          console.log('📊 Fallback price calculation:', {
            medianPrice: marketIntelligence.medianPrice,
            averagePrice: marketIntelligence.averagePrice,
            priceCount: prices.length
          });
        }
      }
    } catch (error) {
      console.error('❌ Error calculating market intelligence:', error);
    }
  } else {
    console.log('⚠️ No listings found - will use fallback method');
  }

  // Step 3: Determine if we're using fallback method
  const isFallbackMethod = realListings.length === 0;
  console.log(`🎯 Using ${isFallbackMethod ? 'FALLBACK' : 'MARKET'} method`);

  // Step 4: Calculate base price anchor
  let basePriceAnchor;
  let estimatedValue;
  
  if (isFallbackMethod) {
    // Fallback to MSRP-based calculation
    const basePrice = calculateFallbackPrice(input);
    basePriceAnchor = {
      source: 'MSRP-Adjusted Model',
      amount: basePrice,
      method: 'Synthetic pricing using industry depreciation curves'
    };
    estimatedValue = basePrice;
  } else {
    // Use market data
    const marketPrice = marketIntelligence.medianPrice || marketIntelligence.averagePrice;
    basePriceAnchor = {
      source: `${realListings.length} Market Listings`,
      amount: marketPrice,
      method: `Median price from ${realListings.length} comparable listings`
    };
    estimatedValue = marketPrice;
  }

  // Step 5: Calculate REAL adjustments using the centralized engine
  console.log('🔧 Calculating real adjustments with AdjustmentEngine...');
  
  const adjustmentContext = {
    vehicleMileage: input.mileage,
    marketAverageMileage: realListings.length > 0 
      ? realListings.reduce((sum, l) => sum + (l.mileage || 0), 0) / realListings.length 
      : undefined,
    condition: input.condition,
    titleStatus: undefined, // Could be enhanced to get from VIN decode
    zipCode: input.zipCode,
    marketListings: realListings,
    baseValue: estimatedValue
  };

  const adjustmentResult = AdjustmentEngine.calculateAdjustments(adjustmentContext);
  
  // Apply calculated adjustments to estimated value
  estimatedValue += adjustmentResult.totalAdjustment;
  
  console.log('✅ Adjustments calculated:', {
    adjustmentsCount: adjustmentResult.adjustments.length,
    totalAdjustment: adjustmentResult.totalAdjustment,
    confidencePenalty: adjustmentResult.confidencePenalty,
    notes: adjustmentResult.calculationNotes
  });

  // Step 6: Calculate confidence score using unified system
  const sources = isFallbackMethod 
    ? ['msrp_fallback', 'depreciation_model']
    : ['market_listings', 'price_analysis'];

  const confidenceContext = {
    exactVinMatch: false, // We'll implement VIN matching later
    marketListings: realListings,
    sources,
    trustScore: isFallbackMethod ? 0.3 : 0.8,
    mileagePenalty: 0,
    zipCode: input.zipCode || ''
  };

  let confidenceResult = calculateUnifiedConfidence(confidenceContext);
  
  // CRITICAL: Enforce honest confidence caps based on data quality
  const confidencePenaltyReasons: string[] = [];
  let maxAllowedConfidence = 95;
  
  // Apply base confidence penalties
  let totalConfidencePenalty = adjustmentResult.confidencePenalty;
  
  if (isFallbackMethod) {
    maxAllowedConfidence = 60;
    totalConfidencePenalty += 15; // Additional penalty for fallback method
    confidencePenaltyReasons.push('No comparable market listings found');
    confidencePenaltyReasons.push('Fallback MSRP method used');
    confidencePenaltyReasons.push('Synthetic adjustments applied');
  } else if (realListings.length < 3) {
    maxAllowedConfidence = 75;
    totalConfidencePenalty += 5;
    confidencePenaltyReasons.push(`Limited market data (${realListings.length} listing${realListings.length > 1 ? 's' : ''})`);
  }
  
  // Additional penalty if no adjustments could be calculated
  if (adjustmentResult.fallbackExplanation) {
    confidencePenaltyReasons.push(adjustmentResult.fallbackExplanation);
  }
  
  // Apply the cap and create penalty explanation
  const originalConfidence = confidenceResult.confidenceScore;
  const adjustedConfidence = Math.max(0, originalConfidence - totalConfidencePenalty);
  
  if (adjustedConfidence > maxAllowedConfidence) {
    confidenceResult = {
      ...confidenceResult,
      confidenceScore: maxAllowedConfidence
    };
    confidencePenaltyReasons.push(`Confidence capped at ${maxAllowedConfidence}% due to data quality limitations`);
  } else {
    confidenceResult = {
      ...confidenceResult,
      confidenceScore: adjustedConfidence
    };
  }
  
  // Step 7: Generate explanation with penalty context
  const explanation = generateConfidenceExplanation(
    confidenceResult.confidenceScore,
    confidenceContext
  ) + (confidencePenaltyReasons.length > 0 ? ` ${confidencePenaltyReasons.join('. ')}.` : '');

  console.log('✅ Enhanced Valuation Complete:', {
    estimatedValue,
    originalConfidence,
    finalConfidence: confidenceResult.confidenceScore,
    totalConfidencePenalty,
    confidenceCap: maxAllowedConfidence,
    penaltyReasons: confidencePenaltyReasons,
    marketListingsCount: realListings.length,
    isFallbackMethod,
    adjustmentsCount: adjustmentResult.adjustments.length,
    adjustmentTotal: adjustmentResult.totalAdjustment
  });

  return {
    estimatedValue: Math.round(estimatedValue),
    confidenceScore: confidenceResult.confidenceScore,
    marketIntelligence,
    marketListings: realListings.map(listing => ({
      id: listing.id,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location,
      source: listing.source,
      source_type: listing.source_type || 'dealer',
      listing_url: listing.listing_url || '',
      dealer_name: listing.dealer_name,
      year: listing.year,
      make: listing.make,
      model: listing.model,
      is_cpo: listing.is_cpo || false,
      fetched_at: listing.updated_at || listing.created_at || new Date().toISOString(),
      confidence_score: 0.8
    })),
    adjustments: adjustmentResult.adjustments,
    basePriceAnchor,
    sources,
    isFallbackMethod,
    explanation,
    zipCode: input.zipCode,
    vin: input.vin
  };
}

function calculateFallbackPrice(input: ValuationInput): number {
  // Simple MSRP-based depreciation model for fallback
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - (input.year || currentYear);
  
  // Base MSRP estimation (simplified)
  let baseMSRP = 35000; // Default fallback
  
  // Adjust for make/model if known
  if (input.make?.toLowerCase().includes('ford') && input.model?.toLowerCase().includes('f-150')) {
    baseMSRP = 45000; // Ford F-150 base MSRP
  }
  
  // Apply depreciation (10% first year, 8% subsequent years)
  let depreciatedValue = baseMSRP;
  for (let i = 0; i < vehicleAge; i++) {
    const depreciationRate = i === 0 ? 0.10 : 0.08;
    depreciatedValue *= (1 - depreciationRate);
  }
  
  // Mileage adjustment for fallback (very basic)
  if (input.mileage) {
    const expectedMileage = vehicleAge * 12000;
    const mileageDiff = input.mileage - expectedMileage;
    const mileageAdjustment = (mileageDiff / 1000) * -200;
    depreciatedValue += mileageAdjustment;
  }
  
  return Math.max(depreciatedValue, baseMSRP * 0.2); // Never go below 20% of MSRP
}
