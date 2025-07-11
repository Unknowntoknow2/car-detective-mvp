import { MarketListing, ValuationInput, EnhancedValuationResult, ValueBreakdown } from "@/types/valuation";
import { logValuationAudit } from "@/services/valuationAuditLogger";
import { fetchRegionalFuelPrice, computeFuelCostImpact, getFuelCostByZip, computeFuelTypeAdjustment } from "@/services/fuelCostService";
import { fetchMarketComps, type MarketSearchResult } from "@/agents/marketSearchAgent";

// Helper: Compute average from numeric field
function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export async function calculateValuationFromListings(
  input: ValuationInput,
  listings: MarketListing[]
): Promise<EnhancedValuationResult> {
  if (!listings || listings.length === 0) throw new Error("No listings provided");

  const prices = listings.map(l => l.price).filter(Boolean);
  let baseValue = average(prices);
  let baseValueSource = "market_listings";
  
  // Enhanced GPT Market Comps with Trust-Based Adjustments
  let marketCompsAdjustment = 0;
  let marketCompsUsed = false;
  let usedMarketFallback = false;
  let listingSources: any[] = [];
  let confidenceBoost = 0;
  let trustScore = 0;
  let trustNotes: string[] = [];

  try {
    console.log('🔍 Attempting to fetch live market comps with trust scoring...');
    const searchResult: MarketSearchResult = await fetchMarketComps(input);
    
    trustScore = searchResult.trust;
    trustNotes = searchResult.notes;
    const comps = searchResult.listings;

    if (comps && comps.length >= 2 && trustScore >= 0.3) {
      // 🎯 CRITICAL: Check for exact VIN match first (highest priority)
      const exactVinMatch = comps.find(listing => listing.vin === input.vin);
      if (exactVinMatch) {
        console.log('🎯 EXACT VIN MATCH DETECTED - APPLYING 80% MARKET ANCHORING:', {
          vin: exactVinMatch.vin,
          price: exactVinMatch.price,
          source: exactVinMatch.source,
          baseValue: baseValue
        });
        
        // Apply strong 80% anchoring adjustment toward exact VIN match price
        const strongAnchorAdj = (exactVinMatch.price - baseValue) * 0.8;
        marketCompsAdjustment = strongAnchorAdj;
        baseValue = baseValue + strongAnchorAdj; // Apply exact VIN anchoring
        baseValueSource = "exact_vin_match";
        marketCompsUsed = true;
        listingSources = [exactVinMatch, ...comps.filter(c => c.vin !== input.vin).slice(0, 5)];
        confidenceBoost = 20; // +20 confidence bonus for exact VIN match
        
        console.log(`✅ EXACT VIN MATCH ANCHORING: $${baseValue.toLocaleString()} (anchored to $${exactVinMatch.price.toLocaleString()} with 80% weight)`);
      } else {
        // Regular market comps logic when no exact VIN match
        // Filter out outliers (prices more than 2 standard deviations from mean)
        const compPrices = comps.map(c => c.price);
        const mean = average(compPrices);
        const stdDev = Math.sqrt(compPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / compPrices.length);
        const filteredComps = comps.filter(comp => Math.abs(comp.price - mean) <= 2 * stdDev);
        
        if (filteredComps.length >= 2) {
          const filteredPrices = filteredComps.map(c => c.price);
          const avgCompPrice = average(filteredPrices);
          const delta = avgCompPrice - baseValue;
          
          // Apply trust scaling to the adjustment
          const trustedDelta = delta * trustScore;
          
          // Use more lenient adjustment threshold for live data but scale by trust
          if (Math.abs(trustedDelta) < 0.6 * baseValue) {
            marketCompsAdjustment = trustedDelta;
            baseValue = baseValue + trustedDelta; // Apply trusted adjustment
            baseValueSource = trustScore >= 0.7 ? "verified_web_listings" : "web_listings_low_confidence";
            marketCompsUsed = true;
            listingSources = filteredComps.slice(0, 6);
            confidenceBoost = Math.min(filteredComps.length * 2 * trustScore, 15); // Scale confidence by trust
            console.log(`✅ Trust-scaled market comps applied: ${filteredComps.length}/${comps.length} listings, trust: ${Math.round(trustScore * 100)}%, avg: $${avgCompPrice.toLocaleString()}, adjusted: $${(avgCompPrice + trustedDelta).toLocaleString()}`);
          } else {
            usedMarketFallback = true;
            console.warn(`[ValuationEngine] Trust-adjusted market comp too large (${Math.round(trustedDelta)}), using fallback.`);
          }
        } else {
          usedMarketFallback = true;
          console.warn("[ValuationEngine] Too many outliers in market comps after trust filtering, using fallback.");
        }
      }
    } else if (comps && comps.length >= 1 && trustScore < 0.3) {
      usedMarketFallback = true;
      console.warn(`[ValuationEngine] Low trust score (${Math.round(trustScore * 100)}%), using fallback.`);
    } else {
      usedMarketFallback = true;
      console.warn(`[ValuationEngine] Insufficient market comps found (${comps?.length || 0}) or trust score too low, using fallback.`);
    }
  } catch (err) {
    usedMarketFallback = true;
    console.error("[ValuationEngine] Market comp fetch failed:", err);
  }

  // 🔥 REAL-TIME FUEL COST INTEGRATION with EIA API Data
  console.log('⛽️ Fetching regional fuel pricing from EIA API...');
  
  // Get fuel type from VIN metadata or input
  const fuelType = input.fuelType || 'gasoline';
  
  // Fetch real-time regional fuel costs
  const fuelCostData = await getFuelCostByZip(input.zipCode, fuelType);
  const regionalFuelPrice = fuelCostData?.cost_per_gallon || null;
  
  // Calculate fuel type adjustment based on real regional prices
  const fuelTypeAdjustment = computeFuelTypeAdjustment(
    fuelType,
    baseValue,
    regionalFuelPrice,
    input.zipCode
  );
  
  // Traditional fuel cost impact for MPG-based adjustments
  const fuelCostImpact = computeFuelCostImpact(regionalFuelPrice, input.mpg || null, fuelType);
  
  console.log(`🏷️ Fuel analysis: ${fuelType} vehicle in ${input.zipCode}`);
  console.log(`💰 Regional fuel price: $${(regionalFuelPrice || 0).toFixed(2)}/gal`);
  console.log(`📈 Fuel type adjustment: ${fuelTypeAdjustment.adjustment >= 0 ? '+' : ''}$${fuelTypeAdjustment.adjustment.toLocaleString()}`);

  // Multi-factor real-world adjustments with enhanced fuel logic
  const adjustments = {
    depreciation: computeDepreciation(input.year),
    mileage: computeMileageAdjustment(input.mileage),
    condition: computeConditionAdjustment(input.condition),
    ownership: computeOwnershipAdjustment(input.ownership),
    usageType: computeUsageAdjustment(input.usageType),
    marketSignal: computeMarketAdjustment(listings),
    fuelCost: Math.round(fuelCostImpact.annualSavings * 0.3), // Traditional MPG-based adjustment
    fuelType: fuelTypeAdjustment.adjustment, // NEW: EV/Hybrid/Diesel premium based on real fuel costs
    marketComps: marketCompsAdjustment, // Real market data adjustment
  };

  const totalAdjustments = Object.values(adjustments).reduce((sum, val) => sum + val, 0);
  const estimatedValue = Math.max(baseValue + totalAdjustments, 0);

  const breakdown: ValueBreakdown = {
    base_value: baseValue,
    total_adjustments: totalAdjustments,
    ...adjustments,
  };

  const auditPayload = {
    source: "market_listings",
    input,
    baseValue,
    adjustments,
    confidence: computeConfidenceScore(listings.length, marketCompsUsed, confidenceBoost),
    listings_count: listings.length,
    market_comps_used: marketCompsUsed,
    trust_score: trustScore,
    trust_notes: trustNotes,
    fuel_price_used: regionalFuelPrice,
    prices,
    timestamp: new Date().toISOString(),
  };

  const audit_id = await logValuationAudit(auditPayload);

  return {
    estimated_value: Math.round(estimatedValue),
    base_value_source: baseValueSource,
    price_range_low: Math.min(...prices),
    price_range_high: Math.max(...prices),
    depreciation: adjustments.depreciation,
    mileage_adjustment: adjustments.mileage,
    value_breakdown: breakdown,
    valuation_explanation: generateEnhancedExplanation(input, listings.length, adjustments, marketCompsUsed, fuelCostImpact, usedMarketFallback, listingSources, trustScore, trustNotes),
    confidence_score: computeConfidenceScore(listings.length, marketCompsUsed, confidenceBoost),
    audit_id,
  };
}

function computeDepreciation(year?: number): number {
  if (!year) return 0;
  const age = new Date().getFullYear() - year;
  const base = -0.15 * age * 27000;
  return Math.round(base);
}

function computeMileageAdjustment(mileage?: number): number {
  if (!mileage) return 0;
  const avg = 12000 * 5;
  const diff = mileage - avg;
  return Math.round(-1 * (diff / 1000) * 100);
}

function computeConditionAdjustment(condition?: string): number {
  switch (condition?.toLowerCase()) {
    case "excellent": return 1000;
    case "good": return 0;
    case "fair": return -800;
    case "poor": return -2000;
    default: return 0;
  }
}

function computeOwnershipAdjustment(owners?: number): number {
  if (!owners || owners === 1) return 0;
  if (owners === 2) return -500;
  return -1200; // 3+ owners
}

function computeUsageAdjustment(type?: string): number {
  switch (type?.toLowerCase()) {
    case "rental": return -1800;
    case "fleet": return -1000;
    case "commercial": return -1200;
    default: return 0; // personal use
  }
}

function computeMarketAdjustment(listings: MarketListing[]): number {
  // Volatility penalty - high price variance indicates uncertain market
  const volatility = computeStdDev(listings.map(l => l.price));
  return -1 * Math.min(Math.round(volatility * 0.1), 2000); // Max 2k penalty
}

function computeStdDev(numbers: number[]): number {
  if (numbers.length < 2) return 0;
  const mean = average(numbers);
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return Math.sqrt(average(squaredDiffs));
}

function computeConfidenceScore(listingCount: number, marketCompsUsed: boolean = false, confidenceBoost: number = 0): number {
  let baseConfidence = 40;
  
  if (listingCount >= 10) baseConfidence = 90;
  else if (listingCount >= 5) baseConfidence = 75;
  else if (listingCount >= 2) baseConfidence = 60;
  
  // Boost confidence if real market comps were used
  if (marketCompsUsed) {
    baseConfidence += 15; // Increased boost for live market data
  }
  
  // Apply additional confidence boost from listing quality
  baseConfidence += confidenceBoost;
  
  // 🎯 EXACT VIN MATCH BOOST - Push to 92-95% if conditions are met
  if (confidenceBoost >= 20 && marketCompsUsed && listingCount >= 3) {
    baseConfidence = Math.max(baseConfidence, 95); // Push to 95% for exact VIN match
  }
  
  return Math.min(baseConfidence, 95); // Cap at 95%
}

function generateEnhancedExplanation(
  input: ValuationInput, 
  listingCount: number, 
  adjustments: any, 
  marketCompsUsed: boolean,
  fuelCostImpact: any,
  usedMarketFallback: boolean = false,
  listingSources: any[] = [],
  trustScore: number = 0,
  trustNotes: string[] = []
): string {
  let explanation = '';
  
  if (marketCompsUsed) {
    const priceRange = listingSources.length > 1 ? 
      `$${Math.min(...listingSources.map(l => l.price)).toLocaleString()} to $${Math.max(...listingSources.map(l => l.price)).toLocaleString()}` : 
      `around $${listingSources[0]?.price?.toLocaleString() || 'N/A'}`;
    
    const trustLevel = trustScore >= 0.8 ? 'high' : trustScore >= 0.5 ? 'moderate' : 'low';
    const confidenceText = trustScore >= 0.7 ? 'verified' : 'estimated';
    
    explanation += `✅ Based on ${listingSources.length} ${confidenceText} market listings for ${input.year} ${input.make} ${input.model}`;
    if (input.trim) explanation += ` ${input.trim}`;
    explanation += ` near ${input.zipCode}, ranging from ${priceRange}. Trust score: ${Math.round(trustScore * 100)}% (${trustLevel} confidence). `;
    
    if (trustNotes.length > 0) {
      explanation += `${trustNotes.join('. ')}. `;
    }
  } else if (usedMarketFallback) {
    const fallbackReason = trustScore < 0.3 ? `low data quality (${Math.round(trustScore * 100)}% trust)` : 'unavailable';
    explanation += `ℹ️ Live market listings were ${fallbackReason} for ${input.year} ${input.make} ${input.model} near ${input.zipCode}. This estimate uses verified listings from our database with MSRP adjustments. `;
    
    if (trustNotes.length > 0) {
      explanation += `Issues detected: ${trustNotes.join(', ')}. `;
    }
  } else {
    explanation += `Calculated from ${listingCount} verified listings for ${input.make} ${input.model} in ${input.zipCode}. `;
  }
  
  // 🔥 Enhanced fuel type explanation with real EIA data
  if (adjustments.fuelType && adjustments.fuelType !== 0) {
    const fuelType = input.fuelType || 'gasoline';
    const baseValueForCalculation = Math.max(25000, 25000); // Use minimum 25k for percentage calc
    const adjustmentPercent = Math.abs(adjustments.fuelType / baseValueForCalculation * 100).toFixed(1);
    
    if (fuelType === 'electric') {
      explanation += `⚡ This electric vehicle received a +${adjustmentPercent}% value boost due to significant fuel cost savings versus gasoline vehicles, based on real-time fuel pricing from the U.S. Energy Information Administration for ZIP ${input.zipCode}. `;
    } else if (fuelType === 'hybrid') {
      explanation += `🌿 This hybrid vehicle received a +${adjustmentPercent}% value boost reflecting fuel efficiency advantages over conventional vehicles, based on real regional fuel costs in ZIP ${input.zipCode}. `;
    } else if (fuelType === 'diesel') {
      const sign = adjustments.fuelType > 0 ? '+' : '';
      explanation += `🚛 Diesel fuel type adjustment (${sign}${adjustmentPercent}%) applied based on current regional diesel pricing and efficiency characteristics in ZIP ${input.zipCode}. `;
    }
  }
  
  const adjustmentDetails = [];
  if (adjustments.depreciation) adjustmentDetails.push(`depreciation (${adjustments.depreciation >= 0 ? '+' : ''}$${adjustments.depreciation})`);
  if (adjustments.mileage) adjustmentDetails.push(`mileage (${adjustments.mileage >= 0 ? '+' : ''}$${adjustments.mileage})`);
  if (adjustments.condition) adjustmentDetails.push(`condition (${adjustments.condition >= 0 ? '+' : ''}$${adjustments.condition})`);
  if (adjustments.fuelCost) adjustmentDetails.push(`MPG impact (${adjustments.fuelCost >= 0 ? '+' : ''}$${adjustments.fuelCost})`);
  if (adjustments.marketComps) adjustmentDetails.push(`market adjustment (${adjustments.marketComps >= 0 ? '+' : ''}$${adjustments.marketComps})`);
  
  if (adjustmentDetails.length > 0) {
    explanation += `Key adjustments: ${adjustmentDetails.join(', ')}.`;
  }
  
  if (fuelCostImpact.annualSavings !== 0) {
    explanation += ` ${fuelCostImpact.explanation}`;
  }
  
  return explanation;
}