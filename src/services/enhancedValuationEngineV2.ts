import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';
import { ValuationInput, EnhancedValuationResult } from '@/types/valuation';
import { searchMarketListings } from '@/agents/marketSearchAgent';
import { estimateMarketPrice } from '@/agents/marketPriceEstimator';
import { calculateUnifiedConfidence } from '@/utils/valuation/calculateUnifiedConfidence';
import { generateAIExplanation } from '@/services/aiExplanationService';
import { scoreListingQuality } from '@/utils/valuation/listingInclusionAnalyzer';
import { recordListingAudit, recordValuationOutcome, snapshotListing } from '@/services/valuation/listingAuditService';
import { getConfidenceForResult } from '@/utils/valuation/confidence';
import { logPipelineStage } from '@/services/valuationAuditLogger';

interface ConfidenceBreakdown {
  vinAccuracy: number;
  marketData: number;
  recommendations: number;
}

/**
 * Enhanced Valuation Engine - Uses unified MarketListing type
 * Provides transparent confidence calculation and fallback detection
 */
export async function calculateEnhancedValuation(input: ValuationInput): Promise<EnhancedValuationResult> {
  const startTime = Date.now();
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  console.log('🚀 Enhanced Valuation Engine v2.0 - Starting calculation');
  console.log('Input:', { vin: input.vin, make: input.make, model: input.model, year: input.year, zipCode: input.zipCode });
  console.log('🔍 Audit ID:', auditId);

  // Enhanced pipeline tracking
  const pipelineStages = {
    decode: { passed: false, timestamp: '', reason: '' },
    normalize: { passed: false, timestamp: '', reason: '' },
    match: { passed: false, timestamp: '', reason: '' },
    quality_score: { passed: false, timestamp: '', reason: '' },
    comp_inclusion: { passed: false, timestamp: '', reason: '' }
  };

  try {
    // 1. Search for market listings using the enhanced market search agent
    console.log('🔍 Enhanced valuation engine: Searching for market listings...');
    pipelineStages.decode.timestamp = new Date().toISOString();
    
    const rawMarketListings = await searchMarketListings({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      trim: input.trim,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode,
    });

    pipelineStages.decode.passed = !!(rawMarketListings && rawMarketListings.length > 0);
    if (!pipelineStages.decode.passed) {
      pipelineStages.decode.reason = 'No market listings found';
    }

    console.log(`📊 Found ${rawMarketListings?.length || 0} total market listings`);
    console.log(`✅ Decode stage: ${pipelineStages.decode.passed ? 'PASSED' : 'FAILED'} - ${pipelineStages.decode.reason}`);

    // 2. Normalize all listings to unified format early in pipeline
    pipelineStages.normalize.timestamp = new Date().toISOString();
    
    const normalizedListings: MarketListing[] = (rawMarketListings || []).map(listing => {
      const normalized = normalizeListing(listing);
      console.log('🔧 Normalized listing:', {
        price: normalized.price,
        source: normalized.source,
        sourceType: getNormalizedSourceType(normalized),
        url: getNormalizedUrl(normalized)
      });
      return normalized;
    });

    pipelineStages.normalize.passed = normalizedListings.length > 0;
    if (!pipelineStages.normalize.passed) {
      pipelineStages.normalize.reason = 'No listings could be normalized';
    }
    
    console.log(`✅ Normalize stage: ${pipelineStages.normalize.passed ? 'PASSED' : 'FAILED'} - ${pipelineStages.normalize.reason}`);

    // 3. Filter for valid listings with real pricing data and process audit
    pipelineStages.match.timestamp = new Date().toISOString();
    
    const validListings: MarketListing[] = [];
    const excludedListings: any[] = [];

    for (const listing of normalizedListings) {
      // Basic validation
      const basicValid = listing.price > 1000 && listing.price < 200000;
      if (!basicValid) {
        console.log('⚠️ Filtered out invalid listing:', { price: listing.price, source: listing.source });
        continue;
      }

      // Quality scoring and audit
      const qualityResult = scoreListingQuality({
        odometer: listing.mileage,
        hasPhotos: !!(listing.photos?.length),
        photoCount: listing.photos?.length ?? 0,
        hasVinPhoto: false, // Would need VIN photo detection
        feeTransparency: 5, // Default moderate transparency
        sourceTierWeight: listing.source?.toLowerCase().includes('carmax') || 
                         listing.source?.toLowerCase().includes('carvana') ? 0.95 : 0.90,
        withinRadius: true, // Default to true - would calculate based on distance
        priceWithinBand: true, // Default to true - would calculate based on price distribution
        listingFreshDays: 7 // Default fresh listing
      });

      const trustTier = listing.source?.toLowerCase().includes('carmax') || 
                       listing.source?.toLowerCase().includes('carvana') ? 'Tier1' : 'Tier2';
      
      const include = qualityResult.reason === undefined;

      // Record audit for this listing
      await recordListingAudit({
        valuationId: auditId,
        listingUrl: getNormalizedUrl(listing),
        source: listing.source,
        stageStatus: { 
          decode: pipelineStages.decode.passed,
          market_search: true, 
          normalize: pipelineStages.normalize.passed, 
          match: true, 
          quality_score: true 
        },
        trustTier: trustTier,
        qualityScore: qualityResult.score,
        includedInCompSet: include,
        exclusionReason: include ? undefined : qualityResult.reason
      });

      // Snapshot listing
      await snapshotListing(auditId, getNormalizedUrl(listing), listing.source, listing);

      if (include) {
        validListings.push(listing);
      } else {
        excludedListings.push({ 
          listing, 
          score: qualityResult.score, 
          reason: qualityResult.reason 
        });
      }
    }

    pipelineStages.match.passed = validListings.length > 0;
    pipelineStages.quality_score.passed = validListings.length > 0;
    pipelineStages.comp_inclusion.passed = validListings.length >= 3;

    console.log(`✅ ${validListings.length} valid listings after filtering and audit`);

    // 4. Analyze market listings with price estimator
    console.log('📊 Analyzing market listings...');
    const marketPriceEstimate = estimateMarketPrice(validListings);

    // 5. Determine if we're using fallback method
    const isUsingFallbackMethod = validListings.length === 0 || !marketPriceEstimate.estimatedPrice;
    const realListingsCount = validListings.filter(l => 
      getNormalizedSourceType(l) !== 'estimated' && 
      l.source !== 'Market Estimate' &&
      l.source !== 'fallback'
    ).length;

    console.log('🎯 Market data assessment:', {
      totalListings: validListings.length,
      realListings: realListingsCount,
      isUsingFallbackMethod,
      estimatedPrice: marketPriceEstimate.estimatedPrice
    });

    // 6. Calculate base price from market data or fallback
    let basePrice: number;
    let basePriceAnchor: { source: string; amount: number; method: string };
    let finalMethod: 'market_based' | 'fallback_pricing' | 'broadened_search' = 'fallback_pricing';
    
    if (!isUsingFallbackMethod && marketPriceEstimate.estimatedPrice) {
      basePrice = marketPriceEstimate.estimatedPrice;
      basePriceAnchor = {
        source: 'market_median',
        amount: basePrice,
        method: `statistical_analysis_${realListingsCount}_listings`
      };
      finalMethod = 'market_based';
      console.log('💰 Using market-based pricing:', basePrice);
    } else {
      // Fallback pricing using depreciation model
      basePrice = calculateFallbackPrice(input);
      basePriceAnchor = {
        source: 'depreciation_model',
        amount: basePrice,
        method: 'age_based_depreciation'
      };
      finalMethod = 'fallback_pricing';
      console.log('⚠️ Using fallback pricing:', basePrice);
    }

    // 7. Apply adjustments only if we have real market data
    const adjustments: Array<{ label: string; value: number; source: string }> = [];
    let finalPrice = basePrice;

    if (!isUsingFallbackMethod && realListingsCount >= 2) {
      // Apply market-derived adjustments
      const mileageAdjustment = calculateMileageAdjustment(input.mileage || 0, input.year || new Date().getFullYear());
      const conditionAdjustment = calculateConditionAdjustment(input.condition || 'good');
      
      adjustments.push(
        { label: 'Mileage Adjustment', value: mileageAdjustment, source: 'market_analysis' },
        { label: 'Condition Adjustment', value: conditionAdjustment, source: 'market_analysis' }
      );
      
      finalPrice += mileageAdjustment + conditionAdjustment;
      console.log('🔧 Applied market-based adjustments:', { mileage: mileageAdjustment, condition: conditionAdjustment });
    } else {
      console.log('⚠️ Skipping adjustments - insufficient market data');
    }

    // 8. Calculate enhanced confidence score with caps
    const rawConfidenceScore = calculateUnifiedConfidence({
      exactVinMatch: validListings.some(l => l.vin === input.vin),
      marketListings: validListings,
      sources: validListings.map(l => l.source),
      trustScore: marketPriceEstimate.confidence / 100,
      mileagePenalty: 0,
      zipCode: input.zipCode || ''
    });

    const confidenceResult = getConfidenceForResult({
      method: finalMethod,
      confidence_score: rawConfidenceScore / 100
    });

    const confidenceScore = Math.round(confidenceResult.finalConfidence * 100);

    console.log('📊 Confidence calculation:', {
      score: confidenceScore,
      realListings: realListingsCount,
      exactVinMatch: validListings.some(l => l.vin === input.vin),
      sources: validListings.map(l => l.source)
    });

    // 9. Generate market intelligence and confidence breakdown
    const marketIntelligence = !isUsingFallbackMethod ? {
      medianPrice: marketPriceEstimate.median || basePrice,
      priceRange: [
        marketPriceEstimate.min || basePrice * 0.8,
        marketPriceEstimate.max || basePrice * 1.2
      ] as [number, number],
      confidence: marketPriceEstimate.confidence,
      outlierCount: 0,
      adjustedPrice: finalPrice,
      sources: Array.from(new Set(validListings.map(l => l.source)))
    } : undefined;

    const confidenceBreakdown: ConfidenceBreakdown = {
      vinAccuracy: validListings.some(l => l.vin === input.vin) ? 25 : 0,
      marketData: Math.min(realListingsCount * 10, 40),
      recommendations: isUsingFallbackMethod ? 10 : 20
    };

    // 10. Generate AI explanation
    const explanation = await generateAIExplanation({
      baseValue: basePrice,
      adjustments: adjustments.map(adj => ({
        label: adj.label,
        amount: adj.value,
        reason: adj.source || 'calculated'
      })),
      finalValue: finalPrice,
      vehicle: {
        year: input.year || new Date().getFullYear(),
        make: input.make || '',
        model: input.model || '',
        trim: input.trim
      },
      zip: input.zipCode || '',
      mileage: input.mileage || 0,
      listings: validListings,
      confidenceScore
    });

    // 11. Return enhanced valuation result with complete transparency
    console.log(`🎯 Final Enhanced Valuation: $${finalPrice.toLocaleString()} with ${confidenceScore}% confidence`);
    
    // Record final valuation outcome
    const rangePct = finalMethod === 'market_based' ? 0.10 : 0.15;
    const low = Math.round(finalPrice * (1 - rangePct));
    const high = Math.round(finalPrice * (1 + rangePct));
    
    await recordValuationOutcome(auditId, {
      finalMethod,
      confidenceCappedAt: confidenceResult.finalConfidence,
      valueRange: { low, high, pct: rangePct }
    });

    const result: EnhancedValuationResult = {
      estimatedValue: finalPrice,
      confidenceScore,
      marketListings: validListings,
      sources: ['enhanced_valuation_engine', 'market_search'],
      isFallbackMethod: isUsingFallbackMethod,
      explanation: explanation || `Enhanced valuation ${isUsingFallbackMethod ? 'using fallback model' : `based on ${realListingsCount} market listings`} with ${confidenceScore}% confidence.`,
      zipCode: input.zipCode,
      vin: input.vin,
      marketIntelligence,
      // Add audit metadata for UI
      auditTrail: {
        auditId,
        finalMethod,
        excludedListings: excludedListings.length,
        confidenceLabel: confidenceResult.label
      }
    };

    // 12. Log final result for debugging
    console.log('📋 Final valuation result:', {
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      listingsUsed: result.marketListings?.length || 0,
      realListings: realListingsCount,
      isUsingFallbackMethod: result.isFallbackMethod,
      processingTime: Date.now() - startTime
    });

    return result;

  } catch (error) {
    console.error('❌ Enhanced valuation engine error:', error);
    throw new Error(`Valuation calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to calculate fallback price using depreciation model
function calculateFallbackPrice(input: ValuationInput): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(0, currentYear - (input.year || currentYear));
  
  // Enhanced MSRP estimation based on vehicle class
  let estimatedMSRP: number;
  const make = (input.make || '').toLowerCase();
  const model = (input.model || '').toLowerCase();
  
  // Vehicle class-based MSRP estimation
  if (model.includes('f-150') || model.includes('f150')) {
    estimatedMSRP = 45000;
  } else if (model.includes('civic')) {
    estimatedMSRP = 28000;
  } else if (model.includes('accord') || model.includes('camry')) {
    estimatedMSRP = 32000;
  } else if (model.includes('altima') || model.includes('sentra')) {
    estimatedMSRP = 30000;
  } else if (make.includes('bmw') || make.includes('mercedes') || make.includes('audi')) {
    estimatedMSRP = 55000;
  } else {
    // Generic estimation
    estimatedMSRP = 28000;
  }
  
  // Apply depreciation (15% per year, max 70%)
  const depreciation = Math.min(vehicleAge * 0.15, 0.7);
  const depreciatedValue = estimatedMSRP * (1 - depreciation);
  
  return Math.max(depreciatedValue, 8000); // Floor at $8k
}

// Helper function to calculate mileage adjustment
function calculateMileageAdjustment(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const expectedMileage = (currentYear - year) * 12000;
  const mileageDiff = mileage - expectedMileage;
  
  if (mileageDiff > 10000) {
    return -Math.min(mileageDiff * 0.12, 5000);
  } else if (mileageDiff < -5000) {
    return Math.min(Math.abs(mileageDiff) * 0.08, 3000);
  }
  
  return 0;
}

// Helper function to calculate condition adjustment
function calculateConditionAdjustment(condition: string): number {
  const conditionMultipliers: { [key: string]: number } = {
    'excellent': 0.12,
    'very good': 0.06,
    'good': 0,
    'fair': -0.15,
    'poor': -0.35
  };
  
  const multiplier = conditionMultipliers[condition.toLowerCase()] || 0;
  return multiplier * 25000; // Apply to base amount
}

// Helper function to calculate median price
function calculateMedianPrice(prices: number[]): number {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sortedPrices.length / 2);
  
  if (sortedPrices.length % 2 === 0) {
    return (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  } else {
    return sortedPrices[mid];
  }
}