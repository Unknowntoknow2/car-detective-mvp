
import { MarketListing, getNormalizedSourceType } from '@/types/marketListing';

export { generateConfidenceExplanation } from './generateConfidenceExplanation';

export interface ConfidenceContext {
  exactVinMatch: boolean;
  marketListings: MarketListing[];
  sources: string[];
  trustScore: number;
  mileagePenalty: number;
  zipCode: string;
}

export function calculateUnifiedConfidence(context: ConfidenceContext): number {
  const { exactVinMatch, marketListings, sources, trustScore, mileagePenalty, zipCode } = context;
  
  let confidence = 30; // Base confidence
  
  // Market data quality assessment
  const realListingsCount = marketListings.filter(l => 
    getNormalizedSourceType(l) !== 'estimated' && l.source !== 'Market Estimate'
  ).length;
  
  console.log('🔍 Confidence Calculation:', {
    totalListings: marketListings.length,
    realListings: realListingsCount,
    exactVinMatch,
    trustScore
  });
  
  // Exact VIN match bonus
  if (exactVinMatch && realListingsCount > 0) {
    confidence += 25;
    console.log('🎯 Exact VIN match bonus: +25 points');
  }
  
  // Market data availability bonus
  if (realListingsCount >= 5) {
    confidence += 20;
  } else if (realListingsCount >= 3) {
    confidence += 15;
  } else if (realListingsCount >= 1) {
    confidence += 8;
  } else {
    confidence -= 15; // Penalty for no real market data
    console.log('⚠️ No real market data penalty: -15 points');
  }
  
  // Trust score integration
  confidence += Math.round(trustScore * 15);
  
  // Mileage data quality
  if (mileagePenalty === 0) {
    confidence += 5; // Normal mileage
  } else if (mileagePenalty > 5000) {
    confidence -= 8; // High mileage penalty affects confidence
  }
  
  // Source diversity bonus
  confidence += Math.min(sources.length * 2, 10);
  
  // Cap confidence based on data quality
  let maxConfidence = 98;
  
  if (realListingsCount === 0) {
    maxConfidence = 60; // Maximum 60% without real market data
    console.log('🚨 No real market data - capping confidence at 60%');
  } else if (realListingsCount === 1) {
    maxConfidence = 70;
  } else if (realListingsCount === 2) {
    maxConfidence = 80;
  }
  
  const finalConfidence = Math.max(25, Math.min(maxConfidence, confidence));
  
  console.log(`📊 Final confidence: ${finalConfidence}% (capped at ${maxConfidence}%)`);
  
  return finalConfidence;
}
