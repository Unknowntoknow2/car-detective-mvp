import { MarketListing, ValuationInput, EnhancedValuationResult, ValueBreakdown } from "@/types/valuation";

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

  const depreciation = computeDepreciation(input.year);
  const mileageAdj = computeMileageAdjustment(input.mileage);

  const estimatedValue = Math.max(baseValue + depreciation + mileageAdj, 0);

  const breakdown: ValueBreakdown = {
    baseValue: baseValue,
    depreciationAdjustment: depreciation,
    mileageAdjustment: mileageAdj,
    conditionAdjustment: 0, // No condition adjustment in market-based valuation
    otherAdjustments: 0,
  };

  return {
    estimated_value: Math.round(estimatedValue),
    base_value_source: "market_listings",
    price_range_low: Math.min(...prices),
    price_range_high: Math.max(...prices),
    depreciation,
    mileage_adjustment: mileageAdj,
    value_breakdown: breakdown,
    valuation_explanation: `Calculated from ${listings.length} real listings for ${input.make} ${input.model} in ${input.zipCode}`,
    confidence_score: computeConfidenceScore(listings.length),
    audit_id: undefined,
  };
}

function computeDepreciation(year?: number): number {
  if (!year) return 0;
  const age = new Date().getFullYear() - year;
  const depreciationRate = 0.15; // 15% per year
  return -1 * age * depreciationRate * 27000; // assume new MSRP $27k
}

function computeMileageAdjustment(mileage?: number): number {
  if (!mileage) return 0;
  const expected = 12000 * 5; // average 60k miles for a 5 year old
  const diff = mileage - expected;
  return -1 * (diff / 1000) * 100; // $100 per 1k miles over
}

function computeConfidenceScore(listingCount: number): number {
  if (listingCount >= 10) return 85;
  if (listingCount >= 5) return 75;
  if (listingCount >= 2) return 60;
  return 40;
}