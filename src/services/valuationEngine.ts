import { MarketListing, ValuationInput, EnhancedValuationResult, ValueBreakdown } from "@/types/valuation";
import { logValuationAudit } from "@/services/valuationAuditLogger";
import { fetchRegionalFuelPrice, computeFuelCostImpact } from "@/services/fuelCostService";

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
  const baseValue = average(prices);

  // Fetch regional fuel price for cost-of-ownership calculations
  const regionalFuelPrice = await fetchRegionalFuelPrice(input.zipCode, input.fuelType || 'gasoline');
  const fuelCostImpact = computeFuelCostImpact(regionalFuelPrice, input.mpg || null, input.fuelType || 'gasoline');

  // Multi-factor real-world adjustments
  const adjustments = {
    depreciation: computeDepreciation(input.year),
    mileage: computeMileageAdjustment(input.mileage),
    condition: computeConditionAdjustment(input.condition),
    ownership: computeOwnershipAdjustment(input.ownership),
    usageType: computeUsageAdjustment(input.usageType),
    marketSignal: computeMarketAdjustment(listings),
    fuelCost: Math.round(fuelCostImpact.annualSavings * 0.3), // 30% of annual fuel savings affects resale value
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
    adjustments: { ...adjustments, total_adjustments: totalAdjustments },
    confidence: computeConfidenceScore(listings.length),
    listings_count: listings.length,
    prices,
    timestamp: new Date().toISOString(),
  };

  const audit_id = await logValuationAudit(auditPayload);

  return {
    estimated_value: Math.round(estimatedValue),
    base_value_source: "market_listings",
    price_range_low: Math.min(...prices),
    price_range_high: Math.max(...prices),
    depreciation: adjustments.depreciation,
    mileage_adjustment: adjustments.mileage,
    value_breakdown: breakdown,
    valuation_explanation: `Calculated from ${listings.length} verified listings for ${input.make} ${input.model} in ${input.zipCode}. Adjustments: depreciation (${adjustments.depreciation}), mileage (${adjustments.mileage}), condition (${adjustments.condition}), ownership (${adjustments.ownership}), usage type (${adjustments.usageType}), market volatility (${adjustments.marketSignal}).`,
    confidence_score: computeConfidenceScore(listings.length),
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

function computeConfidenceScore(listingCount: number): number {
  if (listingCount >= 10) return 90;
  if (listingCount >= 5) return 75;
  if (listingCount >= 2) return 60;
  return 40;
}