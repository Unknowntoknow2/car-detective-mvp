import { ValuationInput, EnhancedValuationResult } from '@/types/valuation';
import { supabase } from '@/integrations/supabase/client';
import { searchMarketListings } from '@/agents/marketSearchAgent';
import { scoreListingQuality } from '@/utils/valuation/listingInclusionAnalyzer';
import { recordListingAudit, recordValuationOutcome, snapshotListing } from '@/services/valuation/listingAuditService';
import { getConfidenceForResult } from '@/utils/valuation/confidence';

/**
 * Enhanced Valuation Engine V2 - Full Process Audit Implementation
 * 
 * Features:
 * - Stage-by-stage logging with API outcomes
 * - Listing quality scoring and inclusion/exclusion tracking
 * - Confidence guardrails (fallback ≤60%, market ≤85%)
 * - Value range calculation with method-based adjustments
 * - Complete audit trail for transparency
 */

/**
 * Enhanced Valuation Engine - Uses unified MarketListing type
 */
export async function calculateEnhancedValuation(input: ValuationInput): Promise<EnhancedValuationResult> {
  const featureAuditEnabled = import.meta.env.VITE_FEATURE_AUDIT === '1';
  
  console.log('🚀 Starting Enhanced Valuation Engine V2 with audit:', featureAuditEnabled);
  
  const valuationId = crypto.randomUUID();
  const stage: any = { decode: true };
  const included: any[] = [];
  const excluded: any[] = [];

  try {
    // Step 1: Market Search
    console.log('📊 Fetching market listings...');
    stage.market_search = true;
    
    const listings = await searchMarketListings({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
    });

    console.log(`Found ${listings.length} raw listings`);
    stage.normalize = true;

    // Step 2: Process each listing for quality and inclusion
    for (const listing of listings) {
      // Compute listing quality score
      const { score, reason } = scoreListingQuality({
        odometer: listing.mileage,
        hasPhotos: Boolean(listing.photos?.length),
        photoCount: listing.photos?.length || 0,
        hasVinPhoto: Boolean(listing.vin),
        feeTransparency: Math.floor(Math.random() * 10), // Mock fee transparency
        sourceTierWeight: listing.source === 'EchoPark' ? 0.95 : 0.85,
        withinRadius: true, // Assuming within radius from search
        priceWithinBand: listing.price > 5000 && listing.price < 100000,
        listingFreshDays: 0 // Mock days on market
      });

      const trustTier = listing.source === 'EchoPark' ? 'Tier1' : 'Tier2';
      const include = reason === undefined;

      // Snapshot listing (if audit enabled)
      if (featureAuditEnabled) {
        await snapshotListing(valuationId, listing.url, listing.source, listing);

        // Record audit for this listing
        await recordListingAudit({
          valuationId,
          listingUrl: listing.url,
          source: listing.source,
          stageStatus: { 
            ...stage, 
            match: Boolean(listing.trim), 
            quality_score: true 
          },
          trustTier,
          qualityScore: score,
          includedInCompSet: include,
          exclusionReason: reason
        });
      }

      if (include) {
        included.push({ ...listing, qualityScore: score });
      } else {
        excluded.push({ ...listing, qualityScore: score, reason });
      }
    }

    stage.comp_inclusion = true;

    // Step 3: Choose valuation method based on included comps
    let method: 'market_based' | 'fallback_pricing' | 'broadened_search' = 'fallback_pricing';
    let estimated = 0;
    let rangePct = 0.15; // Default ±15% for fallback

    if (included.length >= 3) {
      method = 'market_based';
      rangePct = 0.10; // Tighter ±10% for market-based
      
      // Calculate median price from included listings
      const prices = included.map(x => x.price).sort((a, b) => a - b);
      const mid = Math.floor(prices.length / 2);
      estimated = prices.length % 2 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);
      
      console.log(`✅ Market-based valuation: $${estimated.toLocaleString()} from ${included.length} comps`);
    } else {
      // Fallback to depreciation model
      estimated = await computeDepreciationFallback(input);
      console.log(`⚠️ Fallback valuation: $${estimated.toLocaleString()} (insufficient comps: ${included.length})`);
    }

    const low = Math.round(estimated * (1 - rangePct));
    const high = Math.round(estimated * (1 + rangePct));

    // Step 4: Apply confidence guardrails
    const rawConfidence = inferConfidence(included);
    const conf = getConfidenceForResult({ method, confidence_score: rawConfidence });

    console.log(`🎯 Confidence: ${conf.finalConfidence}% (${conf.label}, capped from ${rawConfidence}%)`);

    // Step 5: Record final valuation outcome (if audit enabled)
    if (featureAuditEnabled) {
      await recordValuationOutcome(valuationId, {
        finalMethod: method,
        confidenceCappedAt: conf.finalConfidence,
        valueRange: { low, high, pct: rangePct }
      });
    }

    stage.valuation = true;

    // Build final result
    const result: EnhancedValuationResult = {
      id: valuationId,
      estimatedValue: estimated,
      priceRange: [low, high],
      confidenceScore: conf.finalConfidence * 100, // Convert to 0-100 scale
      confidenceLabel: conf.label,
      valuationMethod: method,
      isUsingFallbackMethod: method === 'fallback_pricing',
      
      // Market data
      marketListings: included,
      marketSearchStatus: included.length > 0 ? 'success' : 'fallback',
      
      // Adjustments (simplified for now)
      adjustments: [],
      baseValue: estimated,
      
      // Audit data (if enabled)
      processAuditTrail: featureAuditEnabled ? {
        includedListings: included.length,
        excludedListings: excluded.length,
        exclusionReasons: excluded.map(e => ({ source: e.source, url: e.url, reason: e.reason })),
        processStages: stage,
        valuationId
      } : undefined,

      // Vehicle info
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition || 'good',
      zipCode: input.zipCode
    };

    console.log('✅ Enhanced Valuation V2 completed successfully');
    return result;

  } catch (error) {
    console.error('❌ Enhanced Valuation V2 failed:', error);
    
    // Return fallback result with audit info
    const fallbackEstimate = await computeDepreciationFallback(input);
    const conf = getConfidenceForResult({ method: 'fallback_pricing', confidence_score: 0.5 });

    return {
      id: valuationId,
      estimatedValue: fallbackEstimate,
      priceRange: [Math.round(fallbackEstimate * 0.85), Math.round(fallbackEstimate * 1.15)],
      confidenceScore: conf.finalConfidence * 100,
      confidenceLabel: conf.label,
      valuationMethod: 'fallback_pricing',
      isUsingFallbackMethod: true,
      
      marketListings: [],
      marketSearchStatus: 'error',
      adjustments: [],
      baseValue: fallbackEstimate,
      
      processAuditTrail: featureAuditEnabled ? {
        includedListings: 0,
        excludedListings: 0,
        exclusionReasons: [],
        processStages: { ...stage, valuation: false, error: true },
        valuationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      } : undefined,

      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition || 'good',
      zipCode: input.zipCode
    };
  }
}

/**
 * Fallback depreciation model for when insufficient market comps are found
 */
async function computeDepreciationFallback(input: ValuationInput): Promise<number> {
  try {
    // Try to get MSRP from database
    const { data: msrpData } = await supabase
      .from('model_trims')
      .select('msrp')
      .eq('year', input.year)
      .ilike('trim_name', `%${input.make}%`)
      .ilike('trim_name', `%${input.model}%`)
      .order('msrp', { ascending: false })
      .limit(1)
      .single();

    let baseMSRP = msrpData?.msrp || estimateMSRPFromYear(input.year);
    
    // Apply depreciation curve
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - input.year);
    
    // Standard depreciation: ~20% first year, ~15% years 2-3, ~10% thereafter
    let depreciationFactor = 1.0;
    if (age >= 1) depreciationFactor *= 0.80; // First year
    if (age >= 2) depreciationFactor *= Math.pow(0.85, Math.min(2, age - 1)); // Years 2-3
    if (age >= 4) depreciationFactor *= Math.pow(0.90, age - 3); // Years 4+
    
    // Mileage adjustment
    const expectedMileage = age * 12000;
    const excessMileage = Math.max(0, (input.mileage || 0) - expectedMileage);
    const mileagePenalty = Math.min(0.20, excessMileage / 100000 * 0.15); // Max 20% penalty
    depreciationFactor *= (1 - mileagePenalty);
    
    // Condition adjustment
    const conditionMultiplier = {
      'excellent': 1.10,
      'good': 1.00,
      'fair': 0.85,
      'poor': 0.70
    }[input.condition || 'good'] || 1.00;
    
    const estimatedValue = Math.round(baseMSRP * depreciationFactor * conditionMultiplier);
    
    console.log(`📊 Depreciation calculation: MSRP $${baseMSRP.toLocaleString()} × ${(depreciationFactor * conditionMultiplier).toFixed(3)} = $${estimatedValue.toLocaleString()}`);
    
    return Math.max(1000, estimatedValue); // Minimum $1,000
    
  } catch (error) {
    console.warn('Depreciation fallback failed, using basic estimate:', error);
    // Very basic estimate based on year
    return estimateMSRPFromYear(input.year) * 0.60; // 60% of estimated MSRP
  }
}

/**
 * Estimate MSRP from year for common vehicle classes
 */
function estimateMSRPFromYear(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Base MSRP estimates by era (average mid-size sedan)
  let baseMSRP = 25000; // Modern baseline
  if (year < 2010) baseMSRP = 18000;
  else if (year < 2015) baseMSRP = 22000;
  else if (year < 2020) baseMSRP = 24000;
  
  // Adjust for inflation (rough 3% annually)
  return Math.round(baseMSRP * Math.pow(1.03, Math.max(0, 2024 - year)));
}

/**
 * Infer raw confidence score based on market data quality
 */
function inferConfidence(included: any[]): number {
  if (included.length >= 10) return 0.90;
  if (included.length >= 7) return 0.85;
  if (included.length >= 5) return 0.80;
  if (included.length >= 3) return 0.75;
  if (included.length >= 1) return 0.65;
  return 0.55; // No market data
}