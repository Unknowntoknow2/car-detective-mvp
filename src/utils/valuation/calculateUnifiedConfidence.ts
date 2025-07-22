
// Unified Confidence Score Calculator - Phase 2 Audit Fix
import { MarketListing, ValuationInput } from "@/types/valuation";

interface ConfidenceContext {
  exactVinMatch: boolean;
  marketListings: MarketListing[];
  photoCondition?: {
    confidenceScore: number;
    conditionScore: number;
  };
  sources: string[];
  trustScore: number;
  mileagePenalty: number;
  zipCode: string;
  priceVariance?: number;
}

interface ConfidenceResult {
  confidenceScore: number;
  reasoning: string;
  breakdown: {
    base: number;
    exactVinBonus: number;
    marketDataBonus: number;
    photoBonus: number;
    sourceBonus: number;
    trustBonus: number;
    penalties: number;
  };
}

/**
 * Calculate unified confidence score with STRICT fallback method detection
 * Ensures no confidence inflation when market data is missing
 */
export function calculateUnifiedConfidence(context: ConfidenceContext): ConfidenceResult {
  let confidence = 30; // Conservative base confidence
  const breakdown = {
    base: 30,
    exactVinBonus: 0,
    marketDataBonus: 0,
    photoBonus: 0,
    sourceBonus: 0,
    trustBonus: 0,
    penalties: 0
  };

  const reasons: string[] = [];
  const marketListingCount = context.marketListings.length;

  console.log('🧮 Confidence Calculation - Input:', {
    marketListings: marketListingCount,
    sources: context.sources,
    exactVinMatch: context.exactVinMatch,
    trustScore: context.trustScore
  });

  // 🚨 CRITICAL: Detect fallback method early
  const isFallbackMethod = marketListingCount === 0 || 
    context.sources.includes('msrp_fallback') || 
    context.sources.includes('depreciation_model');

  if (isFallbackMethod) {
    console.log('⚠️ FALLBACK METHOD DETECTED - Applying strict confidence limits');
    
    // Major penalty for fallback method
    const fallbackPenalty = -15;
    confidence += fallbackPenalty;
    breakdown.penalties = fallbackPenalty;
    reasons.push("Using synthetic pricing model due to no market data (-15 points)");
    
    // Additional penalty for zero market listings
    if (marketListingCount === 0) {
      const noDataPenalty = -10;
      confidence += noDataPenalty;
      breakdown.penalties += noDataPenalty;
      reasons.push("No current market listings available (-10 points)");
    }
  }

  // 🎯 VIN MATCHING - Only meaningful with real market data
  if (context.exactVinMatch && !isFallbackMethod && marketListingCount > 0) {
    const vinBonus = 20;
    confidence += vinBonus;
    breakdown.exactVinBonus = vinBonus;
    reasons.push("Exact VIN match found in real market listings (+20 points)");
  } else if (context.exactVinMatch && isFallbackMethod) {
    // VIN identification only, no market benefit
    const vinBonus = 3;
    confidence += vinBonus;
    breakdown.exactVinBonus = vinBonus;
    reasons.push("VIN decoded but no market validation available (+3 points)");
  }

  // 📊 MARKET DATA QUALITY - Honest assessment only
  if (!isFallbackMethod && marketListingCount > 0) {
    let marketBonus = 0;
    if (marketListingCount >= 10) {
      marketBonus = 25;
      reasons.push(`Excellent market coverage: ${marketListingCount} listings (+25 points)`);
    } else if (marketListingCount >= 5) {
      marketBonus = 18;
      reasons.push(`Good market coverage: ${marketListingCount} listings (+18 points)`);
    } else if (marketListingCount >= 3) {
      marketBonus = 12;
      reasons.push(`Adequate market data: ${marketListingCount} listings (+12 points)`);
    } else if (marketListingCount >= 1) {
      marketBonus = 6;
      reasons.push(`Limited market data: ${marketListingCount} listing(s) (+6 points)`);
    }
    
    confidence += marketBonus;
    breakdown.marketDataBonus = marketBonus;
  } else {
    breakdown.marketDataBonus = 0;
    reasons.push("No real market data available for comparison (0 points)");
  }

  // 📸 PHOTO CONDITION AI - Only if available
  if (context.photoCondition && !isFallbackMethod) {
    const { confidenceScore, conditionScore } = context.photoCondition;
    if (confidenceScore >= 85 && conditionScore >= 8) {
      const photoBonus = 10;
      confidence += photoBonus;
      breakdown.photoBonus = photoBonus;
      reasons.push("High-quality condition analysis confirmed (+10 points)");
    } else if (confidenceScore >= 70) {
      const photoBonus = 5;
      confidence += photoBonus;
      breakdown.photoBonus = photoBonus;
      reasons.push("Basic condition analysis available (+5 points)");
    }
  }

  // 🔍 DATA SOURCE QUALITY - Reduced for fallback
  let sourceBonus = 0;
  if (!isFallbackMethod) {
    if (context.sources.includes('market_listings')) sourceBonus += 5;
    if (context.sources.includes('price_analysis')) sourceBonus += 3;
    if (context.sources.includes('vin_decode')) sourceBonus += 2;
  } else {
    // Minimal points for fallback sources
    if (context.sources.includes('msrp_fallback')) sourceBonus += 2;
    if (context.sources.includes('depreciation_model')) sourceBonus += 1;
  }
  
  confidence += sourceBonus;
  breakdown.sourceBonus = sourceBonus;
  if (sourceBonus > 0) {
    reasons.push(`Data source verification (+${sourceBonus} points)`);
  }

  // 🎯 TRUST SCORE - Only meaningful with real data
  if (!isFallbackMethod && context.trustScore >= 0.8 && marketListingCount >= 3) {
    const trustBonus = 8;
    confidence += trustBonus;
    breakdown.trustBonus = trustBonus;
    reasons.push("High data quality and consistency (+8 points)");
  } else if (!isFallbackMethod && context.trustScore >= 0.6) {
    const trustBonus = 4;
    confidence += trustBonus;
    breakdown.trustBonus = trustBonus;
    reasons.push("Good data quality (+4 points)");
  }

  // 🚨 STRICT CONFIDENCE CAPS BASED ON METHOD
  let maxConfidence = 98;
  
  if (isFallbackMethod) {
    maxConfidence = 55; // STRICT: Maximum 55% for fallback methods
    console.log('🚨 Fallback method - capping confidence at 55%');
  } else if (marketListingCount === 1) {
    maxConfidence = 65;
    console.log('⚠️ Single listing - capping confidence at 65%');
  } else if (marketListingCount === 2) {
    maxConfidence = 75;
    console.log('⚠️ Two listings - capping confidence at 75%');
  } else if (marketListingCount < 5) {
    maxConfidence = 85;
    console.log('⚠️ Limited listings - capping confidence at 85%');
  }

  // Apply the cap
  const finalConfidence = Math.max(15, Math.min(maxConfidence, confidence));
  
  const reasoning = reasons.join('. ') + '.';

  console.log('🧮 Final Confidence Calculation:', {
    breakdown,
    finalConfidence,
    maxAllowed: maxConfidence,
    isFallbackMethod,
    marketListings: marketListingCount
  });

  return {
    confidenceScore: finalConfidence,
    reasoning,
    breakdown
  };
}

/**
 * Generate HONEST confidence explanation based on actual data availability
 */
export function generateConfidenceExplanation(score: number, context: ConfidenceContext): string {
  const marketListingCount = context.marketListings.length;
  const isFallbackMethod = marketListingCount === 0 || 
    context.sources.includes('msrp_fallback') || 
    context.sources.includes('depreciation_model');
  
  if (isFallbackMethod) {
    return `This ${score}% confidence valuation uses a synthetic MSRP-adjusted pricing model with industry-standard depreciation curves. No current market listings were available for validation, which significantly limits accuracy. The estimate includes mileage, age, and regional adjustments but lacks real market transaction data. For high-value decisions, consider obtaining multiple independent appraisals.`;
  }
  
  if (score >= 90) {
    return `High confidence (${score}%) based on ${marketListingCount} verified market listings with strong data consistency. This valuation reflects current market conditions with excellent comparable vehicle coverage.`;
  }
  
  if (score >= 80) {
    return `Good confidence (${score}%) derived from ${marketListingCount} market listings. The estimate reflects current market trends with reliable comparable data, though some variation may exist.`;
  }
  
  if (score >= 65) {
    return `Moderate confidence (${score}%) based on ${marketListingCount} available listings. While the data provides a reasonable market estimate, limited sample size may affect precision.`;
  }
  
  return `Lower confidence (${score}%) due to limited market data (${marketListingCount} listings). The estimate provides a general market range but may have reduced accuracy due to insufficient comparable vehicles.`;
}
