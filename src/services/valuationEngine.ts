// Enhanced Valuation Engine - Calculates valuations from real market data
import { ValuationInput, EnhancedValuationResult, MarketListing } from "@/types/valuation";

export async function calculateValuationFromListings(
  input: ValuationInput, 
  listings: MarketListing[]
): Promise<EnhancedValuationResult> {
  try {
    console.log('⚙️ Valuation Engine: Calculating value from', listings.length, 'market listings');

    // Analyze market listings
    const prices = listings.map(l => l.price).filter(p => p > 0);
    const mileages = listings.map(l => l.mileage).filter(m => m && m > 0);
    
    if (prices.length === 0) {
      throw new Error('No valid price data in market listings');
    }

    // Calculate base value from market data
    const medianPrice = calculateMedian(prices);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const baseValue = Math.round((medianPrice + averagePrice) / 2);

    console.log('📊 Market analysis:', {
      medianPrice,
      averagePrice,
      baseValue,
      listingCount: prices.length
    });

    // Calculate mileage adjustment
    const inputMileage = input.mileage || 50000;
    const validMileages = mileages.filter(m => m != null);
    const averageMileage = validMileages.length > 0 
      ? validMileages.reduce((sum, m) => sum + m, 0) / validMileages.length 
      : 50000;
    
    const mileageDiff = inputMileage - averageMileage;
    const mileageAdjustment = Math.round(mileageDiff * -0.15); // $0.15 per mile difference

    // Calculate condition adjustment
    const conditionAdjustment = calculateConditionAdjustment(input.condition || 'good', baseValue);

    // Calculate final value
    const finalValue = Math.max(
      baseValue + mileageAdjustment + conditionAdjustment,
      1000 // Minimum value
    );

    // Calculate confidence based on data quality
    const confidence = calculateMarketConfidence(listings, input);

    const result: EnhancedValuationResult = {
      estimated_value: finalValue,
      base_value_source: "market_listings",
      mileage_adjustment: mileageAdjustment,
      depreciation: 0, // Not applicable with market data
      value_breakdown: {
        baseValue: baseValue,
        depreciationAdjustment: 0,
        mileageAdjustment: mileageAdjustment,
        conditionAdjustment: conditionAdjustment,
        otherAdjustments: 0
      },
      confidence_score: confidence,
      valuation_explanation: generateMarketExplanation(input, listings, baseValue, finalValue, confidence),
      price_range_low: Math.round(finalValue * 0.9),
      price_range_high: Math.round(finalValue * 1.1)
    };

    console.log('✅ Market-based valuation calculated:', finalValue, 'with', confidence + '% confidence');
    return result;

  } catch (error) {
    console.error('❌ Valuation Engine error:', error);
    throw error;
  }
}

function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

function calculateConditionAdjustment(condition: string, baseValue: number): number {
  const adjustments: { [key: string]: number } = {
    'excellent': 0.10,
    'very good': 0.05,
    'good': 0,
    'fair': -0.10,
    'poor': -0.25
  };
  
  const adjustment = adjustments[condition.toLowerCase()] || 0;
  return Math.round(baseValue * adjustment);
}

function calculateMarketConfidence(listings: MarketListing[], input: ValuationInput): number {
  let confidence = 50; // Base confidence for market data

  // Increase confidence based on listing quality
  confidence += Math.min(listings.length * 5, 25); // Up to 25% for listing count
  
  // Check for similar mileage listings
  const inputMileage = input.mileage || 50000;
  const similarMileageListings = listings.filter(l => 
    l.mileage && Math.abs(l.mileage - inputMileage) < 20000
  );
  confidence += Math.min(similarMileageListings.length * 3, 15); // Up to 15% for mileage similarity

  // Check for recent listings (confidence score in listings indicates freshness)
  const highConfidenceListings = listings.filter(l => (l.confidence_score || 0) > 80);
  confidence += Math.min(highConfidenceListings.length * 2, 10); // Up to 10% for data freshness

  return Math.min(confidence, 95); // Cap at 95%
}

function generateMarketExplanation(
  input: ValuationInput, 
  listings: MarketListing[], 
  baseValue: number, 
  finalValue: number, 
  confidence: number
): string {
  const vehicle = `${input.year} ${input.make} ${input.model}`;
  const sources = Array.from(new Set(listings.map(l => l.source))).join(', ');
  
  return `Market-based valuation for ${vehicle} derived from ${listings.length} recent listings across ${sources}. ` +
    `Base market value: $${baseValue.toLocaleString()}. ` +
    `Adjusted for mileage and condition to: $${finalValue.toLocaleString()}. ` +
    `Confidence: ${confidence}% based on data quality and market coverage.`;
}