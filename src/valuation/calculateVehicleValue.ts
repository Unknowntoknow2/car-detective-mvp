
import { EnrichedVehicleData } from '@/enrichment/types';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { 
  CalculateVehicleValueInput, 
  VehicleValuationResult, 
  MarketData 
} from './types';

/**
 * Calculate vehicle value based on enriched data and follow-up answers
 */
export function calculateVehicleValue(input: CalculateVehicleValueInput): VehicleValuationResult {
  const { vin, enrichedData, followUpAnswers, basePrice } = input;
  
  // Extract market data from enriched sources
  const marketData = extractMarketData(enrichedData);
  
  // Start with base value from market data or fallback
  const baseValue = marketData.avgMarketplacePrice || basePrice || 15000;
  
  // Calculate penalties based on follow-up answers
  const penalties = calculatePenalties(followUpAnswers, enrichedData, baseValue);
  
  // Calculate adjusted value
  const totalPenalties = Object.values(penalties).reduce((sum: number, penalty: number) => sum + penalty, 0);
  const adjustedValue = Math.max(baseValue + totalPenalties, baseValue * 0.3); // Floor at 30% of base
  
  // Calculate confidence score (higher penalties = lower confidence)
  const penaltyRatio = Math.abs(totalPenalties) / baseValue;
  const confidenceScore = Math.max(50, Math.min(95, 90 - (penaltyRatio * 40)));
  
  // Calculate price range (±7% of adjusted value)
  const priceRange: [number, number] = [
    Math.round(adjustedValue * 0.93),
    Math.round(adjustedValue * 1.07)
  ];
  
  // Calculate dealer insights
  const dealerInsights = calculateDealerInsights(adjustedValue, marketData);
  
  // Calculate market insights
  const marketInsights = calculateMarketInsights(marketData, enrichedData);
  
  // Create adjustment details for transparency
  const adjustments = createAdjustmentDetails(penalties, followUpAnswers);
  
  return {
    baseValue: Math.round(baseValue),
    adjustedValue: Math.round(adjustedValue),
    confidenceScore: Math.round(confidenceScore),
    priceRange,
    penalties,
    dealerInsights,
    marketInsights,
    adjustments
  };
}

/**
 * Extract market data from enriched vehicle data
 */
function extractMarketData(enrichedData: EnrichedVehicleData): MarketData {
  const prices: number[] = [];
  
  // Collect prices from all marketplace sources
  if (enrichedData.sources.facebook) {
    enrichedData.sources.facebook.forEach((listing: any) => {
      if (listing.price > 0) prices.push(listing.price);
    });
  }
  
  if (enrichedData.sources.craigslist) {
    enrichedData.sources.craigslist.forEach((listing: any) => {
      if (listing.price > 0) prices.push(listing.price);
    });
  }
  
  if (enrichedData.sources.ebay) {
    enrichedData.sources.ebay.forEach((listing: any) => {
      if (listing.price > 0) prices.push(listing.price);
    });
  }
  
  // Calculate averages
  const avgMarketplacePrice = prices.length > 0 
    ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
    : 0;
  
  // Extract auction price from STAT.vin if available
  let avgAuctionPrice = 0;
  if (enrichedData.sources.statVin?.salePrice) {
    const auctionPrice = parseFloat(enrichedData.sources.statVin.salePrice.replace(/[,$]/g, ''));
    if (!isNaN(auctionPrice)) {
      avgAuctionPrice = auctionPrice;
    }
  }
  
  // Estimate recent dealer price (typically 15-20% above market)
  const recentDealerPrice = avgMarketplacePrice * 1.175;
  
  // Calculate price variance
  const priceVariance = prices.length > 1 
    ? Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - avgMarketplacePrice, 2), 0) / prices.length)
    : 0;
  
  return {
    avgMarketplacePrice: Math.round(avgMarketplacePrice),
    avgAuctionPrice: Math.round(avgAuctionPrice),
    recentDealerPrice: Math.round(recentDealerPrice),
    listingCount: prices.length,
    priceVariance: Math.round(priceVariance)
  };
}

/**
 * Calculate all penalties based on follow-up answers and enriched data
 */
function calculatePenalties(
  followUpAnswers: FollowUpAnswers, 
  enrichedData: EnrichedVehicleData, 
  baseValue: number
) {
  const penalties = {
    mileagePenalty: 0,
    conditionPenalty: 0,
    accidentPenalty: 0,
    auctionDamagePenalty: 0,
    ownerPenalty: 0,
    servicePenalty: 0
  };
  
  // Mileage penalty (based on age and mileage)
  if (followUpAnswers.mileage) {
    const excessMileage = Math.max(0, followUpAnswers.mileage - 12000); // Assume average 12k/year
    penalties.mileagePenalty = -(excessMileage * 0.12); // $0.12 per excess mile
  }
  
  // Condition penalty
  switch (followUpAnswers.condition) {
    case 'poor':
      penalties.conditionPenalty = -(baseValue * 0.15); // -15%
      break;
    case 'fair':
      penalties.conditionPenalty = -(baseValue * 0.08); // -8%
      break;
    case 'good':
      penalties.conditionPenalty = 0; // baseline
      break;
    case 'excellent':
      penalties.conditionPenalty = baseValue * 0.05; // +5%
      break;
  }
  
  // Accident penalty
  if (followUpAnswers.accidents?.hadAccident) {
    const severity = followUpAnswers.accidents.severity || 'moderate';
    switch (severity) {
      case 'minor':
        penalties.accidentPenalty = -(baseValue * 0.03); // -3%
        break;
      case 'moderate':
        penalties.accidentPenalty = -(baseValue * 0.08); // -8%
        break;
      case 'major':
        penalties.accidentPenalty = -(baseValue * 0.15); // -15%
        break;
    }
    
    // Additional penalty for frame damage
    if (followUpAnswers.accidents.frameDamage) {
      penalties.accidentPenalty -= baseValue * 0.10; // Additional -10%
    }
  }
  
  // Auction damage penalty (from STAT.vin data)
  if (enrichedData.sources.statVin?.damage) {
    const damage = enrichedData.sources.statVin.damage.toLowerCase();
    if (damage.includes('major') || damage.includes('severe')) {
      penalties.auctionDamagePenalty = -(baseValue * 0.20); // -20%
    } else if (damage.includes('moderate') || damage.includes('collision')) {
      penalties.auctionDamagePenalty = -(baseValue * 0.12); // -12%
    } else if (damage.includes('minor') || damage.includes('hail')) {
      penalties.auctionDamagePenalty = -(baseValue * 0.06); // -6%
    }
  }
  
  // Previous owners penalty
  if (followUpAnswers.previous_owners && followUpAnswers.previous_owners > 1) {
    const excessOwners = followUpAnswers.previous_owners - 1;
    penalties.ownerPenalty = -(excessOwners * 300); // -$300 per additional owner
  }
  
  // Service history adjustment
  switch (followUpAnswers.service_history) {
    case 'dealer':
      penalties.servicePenalty = baseValue * 0.03; // +3%
      break;
    case 'independent':
      penalties.servicePenalty = baseValue * 0.01; // +1%
      break;
    case 'unknown':
      penalties.servicePenalty = -(baseValue * 0.02); // -2%
      break;
    default:
      penalties.servicePenalty = 0;
  }
  
  return penalties;
}

/**
 * Calculate dealer insights
 */
function calculateDealerInsights(adjustedValue: number, marketData: MarketData) {
  const estimatedDealerProfit = adjustedValue * 0.18; // Typical 18% margin
  const avgDealerListPrice = adjustedValue + estimatedDealerProfit;
  const dealerMargin = estimatedDealerProfit / avgDealerListPrice;
  
  return {
    estimatedDealerProfit: Math.round(estimatedDealerProfit),
    avgDealerListPrice: Math.round(avgDealerListPrice),
    dealerMargin: Math.round(dealerMargin * 100) / 100
  };
}

/**
 * Calculate market insights
 */
function calculateMarketInsights(marketData: MarketData, enrichedData: EnrichedVehicleData) {
  return {
    avgMarketplacePrice: marketData.avgMarketplacePrice,
    avgAuctionPrice: marketData.avgAuctionPrice,
    listingCount: marketData.listingCount,
    priceVariance: marketData.priceVariance
  };
}

/**
 * Create detailed adjustment explanations
 */
function createAdjustmentDetails(penalties: any, followUpAnswers: FollowUpAnswers) {
  const adjustments = [];
  
  if (penalties.mileagePenalty !== 0) {
    adjustments.push({
      factor: 'Mileage',
      impact: Math.round(penalties.mileagePenalty),
      description: `Vehicle has ${followUpAnswers.mileage?.toLocaleString()} miles`
    });
  }
  
  if (penalties.conditionPenalty !== 0) {
    adjustments.push({
      factor: 'Condition',
      impact: Math.round(penalties.conditionPenalty),
      description: `Vehicle condition rated as ${followUpAnswers.condition}`
    });
  }
  
  if (penalties.accidentPenalty !== 0) {
    adjustments.push({
      factor: 'Accident History',
      impact: Math.round(penalties.accidentPenalty),
      description: 'Vehicle has reported accident history'
    });
  }
  
  if (penalties.auctionDamagePenalty !== 0) {
    adjustments.push({
      factor: 'Auction Damage',
      impact: Math.round(penalties.auctionDamagePenalty),
      description: 'Vehicle has auction damage history'
    });
  }
  
  if (penalties.ownerPenalty !== 0) {
    adjustments.push({
      factor: 'Ownership History',
      impact: Math.round(penalties.ownerPenalty),
      description: `Vehicle has had ${followUpAnswers.previous_owners} previous owners`
    });
  }
  
  if (penalties.servicePenalty !== 0) {
    adjustments.push({
      factor: 'Service History',
      impact: Math.round(penalties.servicePenalty),
      description: `Service history: ${followUpAnswers.service_history}`
    });
  }
  
  return adjustments;
}
