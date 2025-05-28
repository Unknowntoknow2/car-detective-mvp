
import { CalculateVehicleValueInput, VehicleValuationResult, MarketData } from './types';
import { calculateMarketValue } from '@/enrichment/getEnrichedVehicleData';

export function calculateVehicleValue(input: CalculateVehicleValueInput): VehicleValuationResult {
  const { vin, enrichedData, followUpAnswers, basePrice } = input;

  console.log(`🧠 Calculating value for VIN: ${vin}`);

  // Step 1: Extract market data from enriched sources
  const marketData = extractMarketData(enrichedData);
  
  // Step 2: Determine base value
  const baseValue = determineBaseValue(marketData, basePrice);
  
  // Step 3: Calculate all penalties
  const penalties = calculatePenalties(followUpAnswers, enrichedData, baseValue);
  
  // Step 4: Calculate adjusted value
  const totalPenalties = Object.values(penalties).reduce((sum, penalty) => sum + penalty, 0);
  const adjustedValue = Math.max(baseValue + totalPenalties, baseValue * 0.4); // Never go below 40% of base
  
  // Step 5: Calculate confidence score
  const confidenceScore = calculateConfidenceScore(enrichedData, followUpAnswers, penalties, baseValue);
  
  // Step 6: Calculate price range (±7% of adjusted value)
  const priceRange: [number, number] = [
    Math.round(adjustedValue * 0.93),
    Math.round(adjustedValue * 1.07)
  ];
  
  // Step 7: Calculate dealer insights
  const dealerInsights = calculateDealerInsights(marketData, adjustedValue);
  
  // Step 8: Build adjustments array for display
  const adjustments = buildAdjustmentsArray(penalties, followUpAnswers);

  return {
    baseValue: Math.round(baseValue),
    adjustedValue: Math.round(adjustedValue),
    confidenceScore,
    priceRange,
    penalties,
    dealerInsights,
    marketInsights: {
      avgMarketplacePrice: marketData.avgMarketplacePrice,
      avgAuctionPrice: marketData.avgAuctionPrice,
      listingCount: marketData.listingCount,
      priceVariance: marketData.priceVariance
    },
    adjustments
  };
}

function extractMarketData(enrichedData: EnrichedVehicleData): MarketData {
  const marketValue = calculateMarketValue(enrichedData);
  
  // Collect marketplace prices
  const marketplacePrices: number[] = [];
  
  if (enrichedData.sources.facebook) {
    enrichedData.sources.facebook.forEach(listing => {
      if (listing.price > 0) marketplacePrices.push(listing.price);
    });
  }
  
  if (enrichedData.sources.craigslist) {
    enrichedData.sources.craigslist.forEach(listing => {
      if (listing.price > 0) marketplacePrices.push(listing.price);
    });
  }
  
  if (enrichedData.sources.ebay) {
    enrichedData.sources.ebay.forEach(listing => {
      if (listing.price > 0) marketplacePrices.push(listing.price);
    });
  }

  // Calculate averages
  const avgMarketplacePrice = marketplacePrices.length > 0 
    ? marketplacePrices.reduce((sum, price) => sum + price, 0) / marketplacePrices.length
    : 0;

  // Get auction price from STAT.vin
  let avgAuctionPrice = 0;
  if (enrichedData.sources.statVin?.salePrice) {
    const auctionPrice = parseFloat(enrichedData.sources.statVin.salePrice.replace(/[,$]/g, ''));
    if (!isNaN(auctionPrice)) {
      avgAuctionPrice = auctionPrice;
    }
  }

  // Calculate price variance
  const allPrices = [...marketplacePrices];
  if (avgAuctionPrice > 0) allPrices.push(avgAuctionPrice);
  
  const priceVariance = allPrices.length > 1 
    ? Math.round(Math.max(...allPrices) - Math.min(...allPrices))
    : 0;

  return {
    avgMarketplacePrice: Math.round(avgMarketplacePrice),
    avgAuctionPrice: Math.round(avgAuctionPrice),
    recentDealerPrice: Math.round(avgMarketplacePrice * 1.15), // Estimate 15% markup
    listingCount: marketplacePrices.length,
    priceVariance
  };
}

function determineBaseValue(marketData: MarketData, fallbackPrice?: number): number {
  // Priority: marketplace average > auction price > fallback
  if (marketData.avgMarketplacePrice > 0) {
    return marketData.avgMarketplacePrice;
  }
  
  if (marketData.avgAuctionPrice > 0) {
    return marketData.avgAuctionPrice * 1.2; // Add 20% markup from auction to retail
  }
  
  return fallbackPrice || 15000; // Fallback value
}

function calculatePenalties(followUpAnswers: FollowUpAnswers, enrichedData: EnrichedVehicleData, baseValue: number) {
  const penalties = {
    mileagePenalty: 0,
    conditionPenalty: 0,
    accidentPenalty: 0,
    auctionDamagePenalty: 0,
    ownerPenalty: 0,
    servicePenalty: 0
  };

  // Mileage penalty (assuming 12k miles/year is average)
  if (followUpAnswers.mileage) {
    const expectedMileage = 12000; // Could be made dynamic based on vehicle age
    const excessMileage = Math.max(0, followUpAnswers.mileage - expectedMileage);
    penalties.mileagePenalty = -Math.round(excessMileage * 0.12); // $0.12 per excess mile
  }

  // Condition penalty
  if (followUpAnswers.condition) {
    switch (followUpAnswers.condition) {
      case 'excellent':
        penalties.conditionPenalty = Math.round(baseValue * 0.05); // +5% bonus
        break;
      case 'good':
        penalties.conditionPenalty = 0; // baseline
        break;
      case 'fair':
        penalties.conditionPenalty = -Math.round(baseValue * 0.08); // -8%
        break;
      case 'poor':
        penalties.conditionPenalty = -Math.round(baseValue * 0.15); // -15%
        break;
    }
  }

  // Accident penalty
  if (followUpAnswers.accidents?.hadAccident) {
    const severity = followUpAnswers.accidents.severity || 'moderate';
    switch (severity) {
      case 'minor':
        penalties.accidentPenalty = -Math.round(baseValue * 0.03); // -3%
        break;
      case 'moderate':
        penalties.accidentPenalty = -Math.round(baseValue * 0.06); // -6%
        break;
      case 'major':
        penalties.accidentPenalty = -Math.round(baseValue * 0.12); // -12%
        break;
    }
  }

  // Auction damage penalty (from STAT.vin data)
  if (enrichedData.sources.statVin?.damage || enrichedData.sources.statVin?.primaryDamage) {
    const damageType = enrichedData.sources.statVin.damage || enrichedData.sources.statVin.primaryDamage;
    if (damageType && damageType.toLowerCase() !== 'none' && damageType.toLowerCase() !== 'minor') {
      penalties.auctionDamagePenalty = -Math.round(baseValue * 0.08); // -8% for documented damage
    }
  }

  // Previous owners penalty
  if (followUpAnswers.previous_owners && followUpAnswers.previous_owners > 1) {
    const extraOwners = followUpAnswers.previous_owners - 1;
    penalties.ownerPenalty = -Math.round(extraOwners * 300); // -$300 per extra owner
  }

  // Service history penalty
  if (followUpAnswers.service_history) {
    switch (followUpAnswers.service_history) {
      case 'dealer':
        penalties.servicePenalty = Math.round(baseValue * 0.02); // +2% bonus
        break;
      case 'independent':
        penalties.servicePenalty = 0; // neutral
        break;
      case 'owner':
        penalties.servicePenalty = -Math.round(baseValue * 0.01); // -1%
        break;
      case 'unknown':
        penalties.servicePenalty = -Math.round(baseValue * 0.03); // -3%
        break;
    }
  }

  return penalties;
}

function calculateConfidenceScore(
  enrichedData: EnrichedVehicleData, 
  followUpAnswers: FollowUpAnswers, 
  penalties: any, 
  baseValue: number
): number {
  let confidence = 85; // Start with base confidence

  // Increase confidence with more data sources
  const dataSources = [
    enrichedData.sources.statVin,
    enrichedData.sources.facebook,
    enrichedData.sources.craigslist,
    enrichedData.sources.ebay
  ].filter(source => source && (Array.isArray(source) ? source.length > 0 : true));

  confidence += Math.min(dataSources.length * 3, 12); // Up to +12 for all sources

  // Decrease confidence for large penalties
  const totalPenaltiesPercent = Math.abs(Object.values(penalties).reduce((sum: number, penalty: number) => sum + penalty, 0)) / baseValue;
  confidence -= Math.round(totalPenaltiesPercent * 20); // Reduce confidence for large adjustments

  // Increase confidence for complete follow-up data
  const completedFields = Object.values(followUpAnswers).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;
  confidence += Math.min(completedFields, 8); // Up to +8 for complete data

  return Math.max(Math.min(confidence, 98), 45); // Keep between 45-98%
}

function calculateDealerInsights(marketData: MarketData, adjustedValue: number) {
  const avgDealerListPrice = adjustedValue * 1.18; // Typical 18% markup
  const estimatedDealerProfit = avgDealerListPrice - adjustedValue;
  const dealerMargin = (estimatedDealerProfit / avgDealerListPrice) * 100;

  return {
    estimatedDealerProfit: Math.round(estimatedDealerProfit),
    avgDealerListPrice: Math.round(avgDealerListPrice),
    dealerMargin: Math.round(dealerMargin * 100) / 100 // Round to 2 decimals
  };
}

function buildAdjustmentsArray(penalties: any, followUpAnswers: FollowUpAnswers) {
  const adjustments: Array<{ factor: string; impact: number; description: string }> = [];

  if (penalties.mileagePenalty !== 0) {
    adjustments.push({
      factor: 'Mileage',
      impact: penalties.mileagePenalty,
      description: `${followUpAnswers.mileage?.toLocaleString()} miles vs. average expectation`
    });
  }

  if (penalties.conditionPenalty !== 0) {
    adjustments.push({
      factor: 'Condition',
      impact: penalties.conditionPenalty,
      description: `Vehicle condition rated as ${followUpAnswers.condition}`
    });
  }

  if (penalties.accidentPenalty !== 0) {
    adjustments.push({
      factor: 'Accident History',
      impact: penalties.accidentPenalty,
      description: `Previous accident reported (${followUpAnswers.accidents?.severity || 'unknown'} severity)`
    });
  }

  if (penalties.auctionDamagePenalty !== 0) {
    adjustments.push({
      factor: 'Auction Damage',
      impact: penalties.auctionDamagePenalty,
      description: 'Previous damage documented in auction records'
    });
  }

  if (penalties.ownerPenalty !== 0) {
    adjustments.push({
      factor: 'Previous Owners',
      impact: penalties.ownerPenalty,
      description: `${followUpAnswers.previous_owners} previous owners`
    });
  }

  if (penalties.servicePenalty !== 0) {
    adjustments.push({
      factor: 'Service History',
      impact: penalties.servicePenalty,
      description: `${followUpAnswers.service_history} maintenance history`
    });
  }

  return adjustments;
}
