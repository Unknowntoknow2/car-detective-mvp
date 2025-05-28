
import { EnrichedVehicleData } from './types';

export interface ValuationResult {
  baseValue: number;
  adjustedValue: number;
  confidenceScore: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  marketComparison: {
    averagePrice: number;
    belowMarket: boolean;
    dataPoints: number;
  };
}

export async function calculateVehicleValue(
  vehicleData: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    zipCode: string;
    vin?: string;
  },
  enrichedData?: EnrichedVehicleData
): Promise<ValuationResult> {
  
  console.log('🔢 Calculating vehicle value with enriched data');
  
  // Start with a base value calculation
  let baseValue = calculateBaseValue(vehicleData);
  let adjustments: Array<{ factor: string; impact: number; description: string }> = [];
  let confidenceScore = 50; // Base confidence
  
  // Market comparison data
  let marketComparison = {
    averagePrice: 0,
    belowMarket: false,
    dataPoints: 0
  };

  // Apply enriched data adjustments if available
  if (enrichedData) {
    console.log('📊 Applying enrichment data adjustments');
    
    // Apply STAT.vin auction data adjustments
    if (enrichedData.sources.statVin) {
      const auctionAdjustment = calculateAuctionAdjustment(enrichedData.sources.statVin, baseValue);
      if (auctionAdjustment) {
        adjustments.push(auctionAdjustment);
        baseValue += auctionAdjustment.impact;
        confidenceScore += 10; // Increase confidence with auction data
      }
    }

    // Calculate market comparison
    marketComparison = calculateMarketComparison(enrichedData, baseValue);
    
    // Adjust confidence based on data availability
    if (marketComparison.dataPoints > 0) {
      confidenceScore += Math.min(marketComparison.dataPoints * 5, 25);
    }
  }

  // Apply condition and mileage adjustments
  const conditionAdjustment = calculateConditionAdjustment(vehicleData.condition, baseValue);
  adjustments.push(conditionAdjustment);
  baseValue += conditionAdjustment.impact;

  const mileageAdjustment = calculateMileageAdjustment(vehicleData.mileage, vehicleData.year, baseValue);
  adjustments.push(mileageAdjustment);
  baseValue += mileageAdjustment.impact;

  // Cap confidence score
  confidenceScore = Math.min(confidenceScore, 95);

  const result: ValuationResult = {
    baseValue: Math.round(baseValue - adjustments.reduce((sum, adj) => sum + adj.impact, 0)),
    adjustedValue: Math.round(baseValue),
    confidenceScore,
    adjustments,
    marketComparison
  };

  console.log('✅ Vehicle valuation completed:', result);
  return result;
}

function calculateBaseValue(vehicleData: {
  make: string;
  model: string;
  year: number;
  mileage: number;
}): number {
  // Simplified base value calculation
  // In production, this would use comprehensive market data
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicleData.year;
  
  // Base depreciation curve
  let baseValue = 35000; // Average new car price
  
  // Apply age depreciation (steeper in first few years)
  if (age <= 2) {
    baseValue *= (1 - (age * 0.15)); // 15% per year for first 2 years
  } else {
    baseValue *= 0.7; // 30% depreciation for first 2 years
    baseValue *= (1 - ((age - 2) * 0.08)); // 8% per year after that
  }

  return Math.max(baseValue, 2000); // Minimum value floor
}

function calculateAuctionAdjustment(
  statVinData: any,
  baseValue: number
): { factor: string; impact: number; description: string } | null {
  
  if (!statVinData.salePrice) return null;
  
  const auctionPrice = parseFloat(statVinData.salePrice.replace(/[,$]/g, ''));
  if (isNaN(auctionPrice)) return null;

  // If vehicle has auction history, it may indicate damage or title issues
  let impact = 0;
  let description = '';

  if (statVinData.primaryDamage || statVinData.damage) {
    const damageType = statVinData.primaryDamage || statVinData.damage;
    if (damageType.toLowerCase().includes('front')) {
      impact = -baseValue * 0.15; // 15% reduction for front damage
      description = `Front damage history reduces value`;
    } else if (damageType.toLowerCase().includes('rear')) {
      impact = -baseValue * 0.10; // 10% reduction for rear damage  
      description = `Rear damage history reduces value`;
    } else {
      impact = -baseValue * 0.12; // 12% reduction for other damage
      description = `${damageType} damage history reduces value`;
    }
  }

  if (impact === 0) {
    // Vehicle has clean auction history
    impact = baseValue * 0.05; // 5% increase for verified clean history
    description = 'Clean auction history increases confidence';
  }

  return {
    factor: 'Auction History',
    impact: Math.round(impact),
    description
  };
}

function calculateMarketComparison(enrichedData: EnrichedVehicleData, baseValue: number) {
  const prices: number[] = [];
  
  // Collect prices from all sources
  if (enrichedData.sources.statVin?.salePrice) {
    const price = parseFloat(enrichedData.sources.statVin.salePrice.replace(/[,$]/g, ''));
    if (!isNaN(price)) prices.push(price);
  }

  [
    enrichedData.sources.facebook,
    enrichedData.sources.craigslist, 
    enrichedData.sources.ebay
  ].forEach(listings => {
    if (Array.isArray(listings)) {
      listings.forEach(listing => {
        if (listing.price > 0) prices.push(listing.price);
      });
    }
  });

  if (prices.length === 0) {
    return { averagePrice: 0, belowMarket: false, dataPoints: 0 };
  }

  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const belowMarket = baseValue < averagePrice * 0.9; // 10% threshold

  return {
    averagePrice: Math.round(averagePrice),
    belowMarket,
    dataPoints: prices.length
  };
}

function calculateConditionAdjustment(condition: string, baseValue: number) {
  const conditionMultipliers: Record<string, number> = {
    excellent: 0.1,
    good: 0,
    fair: -0.15,
    poor: -0.3
  };

  const multiplier = conditionMultipliers[condition.toLowerCase()] || 0;
  const impact = baseValue * multiplier;

  return {
    factor: 'Vehicle Condition',
    impact: Math.round(impact),
    description: `${condition.charAt(0).toUpperCase() + condition.slice(1)} condition adjustment`
  };
}

function calculateMileageAdjustment(mileage: number, year: number, baseValue: number) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const expectedMileage = age * 12000; // 12k miles per year average
  const mileageDifference = mileage - expectedMileage;
  
  // $0.10 per mile over/under expected
  const impact = -mileageDifference * 0.10;
  
  let description = '';
  if (mileageDifference > 0) {
    description = `High mileage (${mileageDifference.toLocaleString()} over average)`;
  } else if (mileageDifference < 0) {
    description = `Low mileage (${Math.abs(mileageDifference).toLocaleString()} under average)`;
  } else {
    description = 'Average mileage for year';
  }

  return {
    factor: 'Mileage',
    impact: Math.round(Math.max(Math.min(impact, baseValue * 0.2), -baseValue * 0.2)), // Cap at ±20%
    description
  };
}
