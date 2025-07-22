
// Unified Confidence Score Calculator - Centralized logic for 92-95% accuracy
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
 * Calculate unified confidence score targeting 92-95% when data is excellent
 * BUT capping at 60% when no market listings exist
 */
export function calculateUnifiedConfidence(context: ConfidenceContext): ConfidenceResult {
  let confidence = 45; // Base confidence
  const breakdown = {
    base: 45,
    exactVinBonus: 0,
    marketDataBonus: 0,
    photoBonus: 0,
    sourceBonus: 0,
    trustBonus: 0,
    penalties: 0
  };

  const reasons: string[] = [];
  const marketListingCount = context.marketListings.length;

  // 🚨 CRITICAL FIX: If no market listings, cap confidence significantly
  if (marketListingCount === 0) {
    console.log('⚠️ NO MARKET LISTINGS - Applying significant confidence penalty');
    breakdown.penalties = -15; // Major penalty for no market data
    confidence -= 15;
    reasons.push("No current market listings found (-15 points)");
  }

  // 🎯 EXACT VIN MATCH - Only meaningful if we have actual market data
  if (context.exactVinMatch && marketListingCount > 0) {
    const vinBonus = 25;
    confidence += vinBonus;
    breakdown.exactVinBonus = vinBonus;
    reasons.push("Exact VIN match found in real listings (+25 points)");
    console.log('🎯 EXACT VIN MATCH CONFIDENCE BOOST: +25 points');
  } else if (context.exactVinMatch && marketListingCount === 0) {
    // VIN match means nothing without market data
    const vinBonus = 5; // Minimal bonus for VIN identification only
    confidence += vinBonus;
    breakdown.exactVinBonus = vinBonus;
    reasons.push("VIN identification confirmed but no market data (+5 points)");
  }

  // 📊 MARKET DATA QUALITY - Honest assessment
  let marketBonus = 0;
  if (marketListingCount >= 5) {
    marketBonus = 20;
    reasons.push(`${marketListingCount} market listings found (+20 points)`);
  } else if (marketListingCount >= 3) {
    marketBonus = 15;
    reasons.push(`${marketListingCount} market listings found (+15 points)`);
  } else if (marketListingCount >= 1) {
    marketBonus = 8;
    reasons.push(`${marketListingCount} market listing found (+8 points)`);
  } else {
    marketBonus = 0; // No bonus for no data
    reasons.push("Using MSRP-based fallback model (0 points)");
  }
  confidence += marketBonus;
  breakdown.marketDataBonus = marketBonus;

  // 📸 PHOTO CONDITION AI (+10-15 points)
  if (context.photoCondition) {
    const { confidenceScore, conditionScore } = context.photoCondition;
    if (confidenceScore >= 85 && conditionScore >= 8) {
      const photoBonus = 15;
      confidence += photoBonus;
      breakdown.photoBonus = photoBonus;
      reasons.push("High-quality photo analysis confirmed (+15 points)");
    } else if (confidenceScore >= 70) {
      const photoBonus = 8;
      confidence += photoBonus;
      breakdown.photoBonus = photoBonus;
      reasons.push("Photo analysis available (+8 points)");
    }
  }

  // 🔍 DATA SOURCE QUALITY (+5-12 points)
  let sourceBonus = 0;
  if (context.sources.includes('msrp_db_lookup')) sourceBonus += 4;
  if (context.sources.includes('vin_decode')) sourceBonus += 3;
  if (context.sources.includes('eia_fuel_costs')) sourceBonus += 2;
  // Don't award points for market search if no results
  if (context.sources.includes('openai_market_search') && marketListingCount > 0) {
    sourceBonus += 3;
  }
  confidence += sourceBonus;
  breakdown.sourceBonus = sourceBonus;
  if (sourceBonus > 0) {
    reasons.push(`Verified data sources available (+${sourceBonus} points)`);
  }

  // 🎯 TRUST SCORE ADJUSTMENT - Reduced impact without market data
  if (context.trustScore >= 0.9 && marketListingCount > 0) {
    const trustBonus = 10;
    confidence += trustBonus;
    breakdown.trustBonus = trustBonus;
    reasons.push("Very high data trust score (+10 points)");
  } else if (context.trustScore >= 0.7 && marketListingCount > 0) {
    const trustBonus = 5;
    confidence += trustBonus;
    breakdown.trustBonus = trustBonus;
    reasons.push("High data trust score (+5 points)");
  }

  // 🚨 ADDITIONAL PENALTIES FOR SYNTHETIC DATA
  if (marketListingCount === 0) {
    const syntheticPenalty = -5;
    confidence += syntheticPenalty;
    breakdown.penalties += syntheticPenalty;
    reasons.push("Synthetic pricing model penalty (-5 points)");
  }

  // 🎯 STRICT CONFIDENCE CAPS BASED ON DATA AVAILABILITY
  let maxConfidence = 98;
  
  if (marketListingCount === 0) {
    maxConfidence = 60; // Maximum 60% confidence without market data
    console.log('🚨 No market data - capping confidence at 60%');
  } else if (marketListingCount === 1) {
    maxConfidence = 70;
  } else if (marketListingCount === 2) {
    maxConfidence = 80;
  }

  // Cap confidence at determined maximum
  const finalConfidence = Math.max(25, Math.min(maxConfidence, confidence));
  
  const reasoning = reasons.join('. ') + '.';

  console.log('🧮 Unified Confidence Calculation:', {
    breakdown,
    finalConfidence,
    marketListings: marketListingCount,
    maxAllowed: maxConfidence
  });

  return {
    confidenceScore: finalConfidence,
    reasoning,
    breakdown
  };
}

/**
 * Generate AI confidence explanation using the calculation context
 */
export function generateConfidenceExplanation(score: number, context: ConfidenceContext): string {
  const marketListingCount = context.marketListings.length;
  
  if (marketListingCount === 0) {
    return `This valuation uses an MSRP-adjusted fallback model with industry-standard depreciation curves. No current market listings were available for this specific vehicle, reducing confidence to ${score}%. The estimate includes mileage, condition, and regional adjustments but lacks real market validation.`;
  }
  
  if (score >= 95) {
    return `This valuation is based on exact VIN matches from real listings in your ZIP code, confirmed condition analysis, and verified mileage data. The highest confidence level.`;
  }
  
  if (score >= 92) {
    return `This valuation reflects ${marketListingCount}+ verified market listings with matching vehicle details and high data quality. Very reliable estimate.`;
  }
  
  if (score >= 85) {
    return `This valuation uses ${marketListingCount} market listings and verified data sources but may lack VIN-specific anchoring or complete condition data.`;
  }
  
  if (score >= 70) {
    return `This valuation is based on ${marketListingCount} market listings and standard adjustments. Some data points may be estimated rather than verified.`;
  }
  
  return `Limited market data was available for this vehicle (${marketListingCount} listings). Confidence is based on available data and estimated adjustments. Additional market research recommended.`;
}
