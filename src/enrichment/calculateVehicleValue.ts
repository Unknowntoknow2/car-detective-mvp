
import { EnrichedVehicleData } from './getEnrichedVehicleData';

export interface ValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  features?: string[];
  accidents?: boolean;
  serviceHistory?: string;
}

export interface ValuationResult {
  baseValue: number;
  valueRange: [number, number];
  conditionPenalty: number;
  dealerFlipMargin: number;
  marketComparison: {
    belowMarket: boolean;
    competingOffers: number[];
    averageMarketPrice: number;
  };
  confidenceScore: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export function calculateVehicleValue(
  input: ValuationInput,
  enrichedData: EnrichedVehicleData
): ValuationResult {
  console.log('🧮 Calculating enhanced vehicle value with market data');

  // Start with market-based base value if available
  let baseValue = 0;
  const marketPrice = enrichedData.marketAnalysis?.averageMarketPrice;
  
  if (marketPrice && marketPrice > 0) {
    baseValue = marketPrice;
    console.log(`📊 Using market-based base value: $${baseValue}`);
  } else {
    // Fallback to traditional valuation method
    baseValue = calculateTraditionalBaseValue(input);
    console.log(`📈 Using traditional base value: $${baseValue}`);
  }

  const adjustments: Array<{ factor: string; impact: number; description: string }> = [];
  
  // Mileage adjustment
  const mileageAdjustment = calculateMileageAdjustment(input.mileage, input.year);
  adjustments.push({
    factor: 'Mileage',
    impact: mileageAdjustment,
    description: `${input.mileage.toLocaleString()} miles vs. average for ${input.year}`,
  });

  // Condition adjustment
  const conditionAdjustment = calculateConditionAdjustment(input.condition);
  adjustments.push({
    factor: 'Condition',
    impact: conditionAdjustment,
    description: `Vehicle condition: ${input.condition}`,
  });

  // Auction damage penalty (from STAT.vin)
  let auctionDamagePenalty = 0;
  if (enrichedData.sources.statVin?.damage) {
    auctionDamagePenalty = calculateDamagePenalty(enrichedData.sources.statVin.damage);
    adjustments.push({
      factor: 'Auction Damage',
      impact: -auctionDamagePenalty,
      description: `Previous auction damage: ${enrichedData.sources.statVin.damage}`,
    });
  }

  // Market positioning adjustment
  let marketAdjustment = 0;
  if (enrichedData.marketAnalysis) {
    const { auctionDiscount, dealerMargin } = enrichedData.marketAnalysis;
    if (auctionDiscount > 0) {
      marketAdjustment = baseValue * 0.05; // 5% boost for having auction data
      adjustments.push({
        factor: 'Market Intelligence',
        impact: marketAdjustment,
        description: `Auction discount detected: ${auctionDiscount}%`,
      });
    }
  }

  // Apply all adjustments
  const totalAdjustment = mileageAdjustment + conditionAdjustment - auctionDamagePenalty + marketAdjustment;
  const adjustedValue = Math.max(baseValue + totalAdjustment, baseValue * 0.3); // Never go below 30% of base

  // Calculate value range (±10% for uncertainty)
  const valueRange: [number, number] = [
    Math.round(adjustedValue * 0.9),
    Math.round(adjustedValue * 1.1),
  ];

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(enrichedData, input);

  // Market comparison
  const competingOffers = enrichedData.sources.marketplaces?.allListings
    .map(listing => listing.price)
    .filter(price => price > 0)
    .slice(0, 5) || [];

  const marketComparison = {
    belowMarket: marketPrice ? adjustedValue < marketPrice * 0.95 : false,
    competingOffers,
    averageMarketPrice: marketPrice || 0,
  };

  // Calculate dealer flip margin
  const dealerFlipMargin = enrichedData.marketAnalysis?.dealerMargin || 
    (enrichedData.sources.statVin ? 25 : 20); // Higher margin if auction data available

  return {
    baseValue: Math.round(adjustedValue),
    valueRange,
    conditionPenalty: Math.abs(Math.min(conditionAdjustment, 0)),
    dealerFlipMargin,
    marketComparison,
    confidenceScore,
    adjustments,
  };
}

function calculateTraditionalBaseValue(input: ValuationInput): number {
  // Simplified traditional valuation - in production this would use KBB/Edmunds data
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  
  // Base MSRP estimation (this would come from a database in production)
  const estimatedMSRP = getEstimatedMSRP(input.make, input.model, input.year);
  
  // Depreciation curve (simplified)
  const depreciationRate = Math.min(age * 0.15, 0.8); // Max 80% depreciation
  
  return Math.round(estimatedMSRP * (1 - depreciationRate));
}

function calculateMileageAdjustment(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const expectedMileage = age * 12000; // 12k miles per year average
  
  const mileageDifference = mileage - expectedMileage;
  
  // $0.10 per mile over/under expected
  return Math.round(mileageDifference * -0.10);
}

function calculateConditionAdjustment(condition: string): number {
  const conditionMultipliers: { [key: string]: number } = {
    'excellent': 0.05,
    'good': 0,
    'fair': -0.15,
    'poor': -0.30,
  };
  
  const multiplier = conditionMultipliers[condition.toLowerCase()] || 0;
  return Math.round(25000 * multiplier); // Base adjustment of $25k vehicle
}

function calculateDamagePenalty(damage: string): number {
  const damageCategories: { [key: string]: number } = {
    'front': 3000,
    'rear': 2500,
    'side': 2000,
    'roof': 4000,
    'flood': 8000,
    'fire': 10000,
    'total': 15000,
  };
  
  const lowerDamage = damage.toLowerCase();
  let penalty = 0;
  
  for (const [category, amount] of Object.entries(damageCategories)) {
    if (lowerDamage.includes(category)) {
      penalty += amount;
    }
  }
  
  return penalty || 2000; // Default penalty if damage type not recognized
}

function calculateConfidenceScore(enrichedData: EnrichedVehicleData, input: ValuationInput): number {
  let score = 50; // Base confidence
  
  // Add confidence for each data source
  if (enrichedData.sources.statVin) score += 20;
  if (enrichedData.sources.marketplaces?.allListings.length) {
    score += Math.min(enrichedData.sources.marketplaces.allListings.length * 5, 25);
  }
  
  // Reduce confidence for older vehicles
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.year;
  if (age > 10) score -= 10;
  if (age > 20) score -= 10;
  
  // Reduce confidence for high mileage
  if (input.mileage > 150000) score -= 10;
  if (input.mileage > 200000) score -= 10;
  
  return Math.max(Math.min(score, 100), 10); // Clamp between 10-100
}

function getEstimatedMSRP(make: string, model: string, year: number): number {
  // Simplified MSRP estimation - in production this would be a database lookup
  const basePrices: { [key: string]: number } = {
    'honda civic': 25000,
    'honda accord': 35000,
    'toyota camry': 32000,
    'toyota corolla': 24000,
    'ford f-150': 45000,
    'chevrolet silverado': 42000,
    'bmw 3 series': 55000,
    'mercedes c-class': 60000,
  };
  
  const key = `${make.toLowerCase()} ${model.toLowerCase()}`;
  const basePrice = basePrices[key] || 30000; // Default price
  
  // Adjust for year (simplified inflation)
  const currentYear = new Date().getFullYear();
  const yearDifference = currentYear - year;
  const inflationAdjustment = yearDifference * 0.03; // 3% per year
  
  return Math.round(basePrice / (1 + inflationAdjustment));
}
