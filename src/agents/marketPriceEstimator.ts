// src/agents/marketPriceEstimator.ts

import { MarketListing, MarketPriceEstimate } from "@/types/valuationTypes";

export function estimateMarketPrice(listings: MarketListing[]): MarketPriceEstimate {
  if (!listings || listings.length === 0) {
    return {
      estimatedPrice: null,
      min: null,
      max: null,
      average: null,
      median: null,
      stdDev: null,
      confidence: 0,
      usedListings: [],
    };
  }

  // Remove listings with salvage/rebuilt titles or extreme outliers
  const cleaned = listings.filter((l) => {
    const price = l.price;
    if (!price || price < 1000 || price > 200000) return false;
    if ((l.titleStatus ?? "").toLowerCase().includes("salvage")) return false;
    if ((l.titleStatus ?? "").toLowerCase().includes("rebuilt")) return false;
    if ((l.titleStatus ?? "").toLowerCase().includes("flood")) return false;
    if ((l.titleStatus ?? "").toLowerCase().includes("lemon")) return false;
    return true;
  });

  const prices = cleaned.map((l) => l.price).sort((a, b) => a - b);
  const count = prices.length;
  if (count === 0) {
    return {
      estimatedPrice: null,
      min: null,
      max: null,
      average: null,
      median: null,
      stdDev: null,
      confidence: 0,
      usedListings: [],
    };
  }

  const avg = prices.reduce((a, b) => a + b, 0) / count;
  const median = count % 2 === 0 
    ? (prices[Math.floor(count / 2) - 1] + prices[Math.floor(count / 2)]) / 2
    : prices[Math.floor(count / 2)];
  const min = prices[0];
  const max = prices[prices.length - 1];
  const stdDev = Math.sqrt(
    prices.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / count
  );

  // Source weighting (manual for now)
  const sourceTrustWeight: Record<string, number> = {
    "cargurus": 1.0,
    "autotrader": 1.0,
    "cars.com": 1.0,
    "carmax": 0.95,
    "carvana": 0.95,
    "edmunds": 0.9,
    "facebook": 0.8,
    "craigslist": 0.7,
    "offerup": 0.7,
    "ebay": 0.85,
  };

  // Weighted average (using source trust)
  const weightedSum = cleaned.reduce((sum, l) => {
    const sourceKey = (l.source?.toLowerCase() ?? "craigslist").replace(/\s+/g, "");
    const trust = sourceTrustWeight[sourceKey] ?? 0.7;
    return sum + l.price * trust;
  }, 0);
  
  const totalWeight = cleaned.reduce((sum, l) => {
    const sourceKey = (l.source?.toLowerCase() ?? "craigslist").replace(/\s+/g, "");
    const trust = sourceTrustWeight[sourceKey] ?? 0.7;
    return sum + trust;
  }, 0);
  
  const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : avg;

  // Additional filtering: remove extreme outliers (more than 2 standard deviations from mean)
  const filteredPrices = prices.filter(price => Math.abs(price - avg) <= 2 * stdDev);
  const filteredCount = filteredPrices.length;
  
  // Recalculate with filtered prices if we removed outliers
  const finalPrices = filteredCount < count && filteredCount >= 3 ? filteredPrices : prices;
  const finalAvg = finalPrices.reduce((a, b) => a + b, 0) / finalPrices.length;
  
  // Confidence based on # listings, deviation, and source quality
  let confidence = 0;
  
  // Base confidence from listing count (up to 60 points)
  confidence += Math.min(60, (finalPrices.length / 8) * 60);
  
  // Confidence from price consistency (up to 25 points)
  const coefficientOfVariation = stdDev / avg;
  const consistencyScore = Math.max(0, 25 - (coefficientOfVariation * 100));
  confidence += consistencyScore;
  
  // Confidence from source quality (up to 15 points)
  const avgSourceTrust = totalWeight / cleaned.length;
  confidence += avgSourceTrust * 15;
  
  confidence = Math.min(100, Math.max(0, Math.round(confidence)));

  return {
    estimatedPrice: Math.round(weightedAvg),
    average: Math.round(finalAvg),
    median: Math.round(median),
    min,
    max,
    stdDev: Math.round(stdDev),
    confidence,
    usedListings: cleaned,
  };
}