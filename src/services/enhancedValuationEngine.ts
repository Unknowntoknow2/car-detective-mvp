
import { supabase } from '@/integrations/supabase/client';
import { MarketListing, ValuationInput } from '@/types/valuation';
import { calculateUnifiedConfidence, generateConfidenceExplanation } from '@/utils/valuation/calculateUnifiedConfidence';

export interface EnhancedValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  marketIntelligence: {
    medianPrice: number;
    averagePrice: number;
    sampleSize: number;
    inventoryLevel: string;
    demandIndicator: number;
  };
  marketListings: MarketListing[];
  adjustments: Array<{
    factor: string;
    amount: number;
    description: string;
    source?: 'market' | 'synthetic';
    synthetic?: boolean;
  }>;
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

  // Step 1: Fetch market listings with case-insensitive search
  const { data: marketListings, error: listingsError } = await supabase
    .from('enhanced_market_listings')
    .select('*')
    .ilike('make', input.make || '')
    .ilike('model', input.model || '')
    .eq('year', input.year)
    .eq('listing_status', 'active')
    .order('updated_at', { ascending: false })
    .limit(20);

  if (listingsError) {
    console.error('❌ Error fetching market listings:', listingsError);
  }

  const realListings = marketListings || [];
  console.log(`📊 Found ${realListings.length} real market listings`);

  // Step 2: Calculate market intelligence using the database function
  let marketIntelligence = {
    medianPrice: 0,
    averagePrice: 0,
    sampleSize: realListings.length,
    inventoryLevel: 'low' as const,
    demandIndicator: 0.5
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
          medianPrice: intel.median_price || 0,
          averagePrice: intel.average_price || 0,
          sampleSize: intel.sample_size || realListings.length,
          inventoryLevel: intel.inventory_level || 'low',
          demandIndicator: intel.demand_indicator || 0.5
        };
        console.log('📈 Market Intelligence calculated:', marketIntelligence);
      }
    } catch (error) {
      console.error('❌ Error calculating market intelligence:', error);
    }
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

  // Step 5: Apply REAL adjustments only when we have market data
  const adjustments: Array<{
    factor: string;
    amount: number;
    description: string;
    source?: 'market' | 'synthetic';
    synthetic?: boolean;
  }> = [];

  if (!isFallbackMethod && input.mileage && realListings.length > 0) {
    // Only apply real market-based adjustments when we have data
    const avgMileage = realListings.reduce((sum, l) => sum + (l.mileage || 0), 0) / realListings.length;
    if (avgMileage > 0) {
      const mileageDiff = (input.mileage - avgMileage) / 1000;
      const mileageAdjustment = mileageDiff * -150; // $150 per 1k miles difference
      
      if (Math.abs(mileageAdjustment) > 100) {
        adjustments.push({
          factor: 'Mileage Adjustment',
          amount: mileageAdjustment,
          description: `${input.mileage.toLocaleString()} mi vs market avg ${Math.round(avgMileage).toLocaleString()} mi`,
          source: 'market',
          synthetic: false
        });
        estimatedValue += mileageAdjustment;
      }
    }
  }
  
  // CRITICAL: Do NOT add synthetic adjustments for fallback methods
  // The fallback price already includes depreciation and mileage factors

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
  
  if (isFallbackMethod) {
    maxAllowedConfidence = 60;
    confidencePenaltyReasons.push('No comparable market listings found');
    confidencePenaltyReasons.push('Fallback MSRP method used');
    confidencePenaltyReasons.push('Synthetic adjustments applied');
  } else if (realListings.length < 3) {
    maxAllowedConfidence = 75;
    confidencePenaltyReasons.push(`Limited market data (${realListings.length} listing${realListings.length > 1 ? 's' : ''})`);
  }
  
  // Apply the cap and create penalty explanation
  const originalConfidence = confidenceResult.confidenceScore;
  if (originalConfidence > maxAllowedConfidence) {
    confidenceResult = {
      ...confidenceResult,
      confidenceScore: maxAllowedConfidence
    };
    confidencePenaltyReasons.push(`Confidence capped at ${maxAllowedConfidence}% due to data quality limitations`);
  }
  
  // Step 7: Generate explanation with penalty context
  const explanation = generateConfidenceExplanation(
    confidenceResult.confidenceScore,
    confidenceContext
  ) + (confidencePenaltyReasons.length > 0 ? ` ${confidencePenaltyReasons.join('. ')}.` : '');

  console.log('✅ Enhanced Valuation Complete:', {
    estimatedValue,
    originalConfidence,
    cappedConfidence: confidenceResult.confidenceScore,
    confidenceCap: maxAllowedConfidence,
    penaltyReasons: confidencePenaltyReasons,
    marketListingsCount: realListings.length,
    isFallbackMethod,
    adjustmentsCount: adjustments.length
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
    adjustments,
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
