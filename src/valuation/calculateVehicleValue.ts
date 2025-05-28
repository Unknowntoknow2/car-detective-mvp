
import { CalculateVehicleValueInput, VehicleValuationResult, MarketData } from './types';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export function calculateVehicleValue(input: CalculateVehicleValueInput): VehicleValuationResult {
  const { vin, enrichedData, followUpAnswers, basePrice = 18000 } = input;
  
  console.log('🔄 Starting vehicle valuation calculation', { vin, basePrice });

  // Extract market data from enriched sources
  const marketListings = [
    ...(enrichedData.sources.facebook || []),
    ...(enrichedData.sources.craigslist || []),
    ...(enrichedData.sources.ebay || [])
  ];

  // Calculate market insights
  const avgMarketplacePrice = marketListings.length > 0
    ? marketListings.reduce((acc, listing) => acc + listing.price, 0) / marketListings.length
    : basePrice;

  const avgAuctionPrice = enrichedData.sources.statVin?.salePrice 
    ? parseFloat(enrichedData.sources.statVin.salePrice.replace(/[,$]/g, ''))
    : basePrice * 0.85; // Typically 15% below retail

  const listingCount = marketListings.length;
  const prices = marketListings.map(listing => listing.price);
  const priceVariance = prices.length > 1 
    ? (Math.max(...prices) - Math.min(...prices)) / avgMarketplacePrice * 100
    : 0;

  // Start with base value
  let adjustedValue = avgMarketplacePrice;
  const adjustments: Array<{ factor: string; impact: number; description: string }> = [];

  // Calculate penalties based on follow-up answers
  const penalties = {
    mileagePenalty: calculateMileagePenalty(followUpAnswers.mileage, adjustedValue),
    conditionPenalty: calculateConditionPenalty(followUpAnswers.condition, adjustedValue),
    accidentPenalty: calculateAccidentPenalty(followUpAnswers.accidents, adjustedValue),
    auctionDamagePenalty: calculateAuctionDamagePenalty(enrichedData.sources.statVin, adjustedValue),
    ownerPenalty: calculateOwnerPenalty(followUpAnswers.previous_owners, adjustedValue),
    servicePenalty: calculateServicePenalty(followUpAnswers.service_history, adjustedValue)
  };

  // Apply penalties
  const totalPenalties = Object.values(penalties).reduce((sum, penalty) => sum + penalty, 0);
  adjustedValue = Math.max(adjustedValue - totalPenalties, adjustedValue * 0.3); // Don't go below 30% of base

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(enrichedData, followUpAnswers, listingCount);

  // Calculate price range (±10% of adjusted value)
  const priceRange: [number, number] = [
    Math.round(adjustedValue * 0.9),
    Math.round(adjustedValue * 1.1)
  ];

  // Calculate dealer insights
  const dealerInsights = {
    estimatedDealerProfit: Math.round(adjustedValue * 0.15), // 15% typical dealer margin
    avgDealerListPrice: Math.round(adjustedValue * 1.15),
    dealerMargin: 15.0
  };

  // Calculate market insights
  const marketInsights = {
    avgMarketplacePrice: Math.round(avgMarketplacePrice),
    avgAuctionPrice: Math.round(avgAuctionPrice),
    listingCount,
    priceVariance: Math.round(priceVariance * 10) / 10
  };

  const result: VehicleValuationResult = {
    baseValue: Math.round(avgMarketplacePrice),
    adjustedValue: Math.round(adjustedValue),
    confidenceScore,
    priceRange,
    penalties,
    dealerInsights,
    marketInsights,
    adjustments
  };

  console.log('✅ Valuation calculation complete:', result);
  
  return result;
}

function calculateMileagePenalty(mileage: number | undefined, baseValue: number): number {
  if (!mileage) return 0;
  
  // Typical mileage is 12,000 miles per year
  // Penalty for excessive mileage
  if (mileage > 100000) {
    return Math.round(baseValue * 0.15); // 15% penalty for high mileage
  } else if (mileage > 75000) {
    return Math.round(baseValue * 0.08); // 8% penalty for moderate high mileage
  }
  
  return 0;
}

function calculateConditionPenalty(condition: string | undefined, baseValue: number): number {
  if (!condition) return 0;
  
  switch (condition) {
    case 'poor':
      return Math.round(baseValue * 0.25); // 25% penalty
    case 'fair':
      return Math.round(baseValue * 0.12); // 12% penalty
    case 'good':
      return 0; // No penalty
    case 'excellent':
      return -Math.round(baseValue * 0.05); // 5% bonus (negative penalty)
    default:
      return 0;
  }
}

function calculateAccidentPenalty(accidents: any, baseValue: number): number {
  if (!accidents?.hadAccident) return 0;
  
  const count = accidents.count || 1;
  const severity = accidents.severity || 'minor';
  
  let penaltyRate = 0;
  
  switch (severity) {
    case 'minor':
      penaltyRate = 0.05 * count; // 5% per minor accident
      break;
    case 'moderate':
      penaltyRate = 0.12 * count; // 12% per moderate accident
      break;
    case 'major':
      penaltyRate = 0.25 * count; // 25% per major accident
      break;
  }
  
  return Math.round(baseValue * Math.min(penaltyRate, 0.4)); // Cap at 40%
}

function calculateAuctionDamagePenalty(statVinData: any, baseValue: number): number {
  if (!statVinData?.damage && !statVinData?.primaryDamage) return 0;
  
  // Base penalty for any auction damage
  return Math.round(baseValue * 0.15); // 15% penalty
}

function calculateOwnerPenalty(previousOwners: number | undefined, baseValue: number): number {
  if (!previousOwners) return 0;
  
  if (previousOwners > 3) {
    return Math.round(baseValue * 0.08); // 8% penalty for many owners
  } else if (previousOwners > 2) {
    return Math.round(baseValue * 0.04); // 4% penalty for multiple owners
  }
  
  return 0;
}

function calculateServicePenalty(serviceHistory: string | undefined, baseValue: number): number {
  if (!serviceHistory) return Math.round(baseValue * 0.05); // 5% penalty for unknown history
  
  switch (serviceHistory) {
    case 'unknown':
      return Math.round(baseValue * 0.08); // 8% penalty
    case 'owner':
      return Math.round(baseValue * 0.03); // 3% penalty
    case 'independent':
      return 0; // No penalty
    case 'dealer':
      return -Math.round(baseValue * 0.02); // 2% bonus
    default:
      return 0;
  }
}

function calculateConfidenceScore(enrichedData: any, followUpAnswers: FollowUpAnswers, listingCount: number): number {
  let score = 75; // Base confidence
  
  // Boost for data sources
  if (enrichedData.sources.statVin) score += 10;
  if (listingCount > 0) score += Math.min(listingCount * 2, 10);
  
  // Boost for complete follow-up data
  if (followUpAnswers.mileage) score += 2;
  if (followUpAnswers.condition) score += 3;
  if (followUpAnswers.service_history) score += 2;
  if (followUpAnswers.accidents) score += 2;
  
  return Math.min(score, 95); // Cap at 95%
}
