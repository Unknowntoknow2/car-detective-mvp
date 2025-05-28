
import { EnrichedVehicleData } from './getEnrichedVehicleData';

export interface ValuationFactors {
  baseValue: number;
  mileageAdjustment: number;
  conditionAdjustment: number;
  auctionDiscount: number;
  marketDemandMultiplier: number;
  locationAdjustment: number;
  damageAdjustment: number;
  titleStatusAdjustment: number;
}

export interface ValuationResult {
  baseValue: number;
  valueRange: [number, number];
  conditionPenalty: number;
  dealerFlipMargin: number;
  marketComparison: {
    belowMarket: boolean;
    competingOffers: number[];
    marketPosition: string;
    pricePercentile: number;
  };
  factors: ValuationFactors;
  confidenceScore: number;
  recommendedActions: string[];
}

export async function calculateVehicleValue(
  enrichedData: EnrichedVehicleData,
  followUpAnswers?: any
): Promise<ValuationResult> {
  console.log('🔢 Calculating vehicle value with enriched data');

  // Extract base data
  const { statVinData, marketData, conditionAnalysis, dealerOpportunity } = enrichedData;
  
  // Start with market average as base value
  let baseValue = marketData.priceAnalysis.averagePrice || 15000; // Default fallback
  
  // If we have auction data, use it to inform base value
  if (statVinData?.salePrice) {
    const auctionPrice = parseFloat(statVinData.salePrice.replace(/[^0-9.]/g, ''));
    if (auctionPrice > 0) {
      // Auction prices are typically 60-70% of retail
      baseValue = Math.max(baseValue, auctionPrice * 1.6);
    }
  }

  // Calculate individual factors
  const factors: ValuationFactors = {
    baseValue,
    mileageAdjustment: calculateMileageAdjustment(enrichedData),
    conditionAdjustment: calculateConditionAdjustment(enrichedData),
    auctionDiscount: calculateAuctionDiscount(enrichedData),
    marketDemandMultiplier: calculateMarketDemand(enrichedData),
    locationAdjustment: 1.0, // TODO: Implement ZIP-based adjustments
    damageAdjustment: calculateDamageAdjustment(enrichedData),
    titleStatusAdjustment: calculateTitleStatusAdjustment(enrichedData)
  };

  // Apply all factors to base value
  const adjustedValue = baseValue * 
    factors.mileageAdjustment * 
    factors.conditionAdjustment * 
    factors.marketDemandMultiplier * 
    factors.locationAdjustment * 
    factors.damageAdjustment * 
    factors.titleStatusAdjustment;

  // Calculate value range (±15%)
  const valueRange: [number, number] = [
    Math.round(adjustedValue * 0.85),
    Math.round(adjustedValue * 1.15)
  ];

  // Calculate condition penalty
  const conditionPenalty = baseValue - (baseValue * factors.conditionAdjustment);

  // Market comparison
  const marketComparison = {
    belowMarket: adjustedValue < marketData.priceAnalysis.averagePrice * 0.9,
    competingOffers: marketData.allListings.map(listing => listing.price),
    marketPosition: determineMarketPosition(adjustedValue, marketData.priceAnalysis.averagePrice),
    pricePercentile: enrichedData.marketPosition.pricePercentile
  };

  // Generate recommendations
  const recommendedActions = generateRecommendations(enrichedData, factors, adjustedValue);

  return {
    baseValue: Math.round(adjustedValue),
    valueRange,
    conditionPenalty: Math.round(conditionPenalty),
    dealerFlipMargin: Math.round(dealerOpportunity.potentialMargin),
    marketComparison,
    factors,
    confidenceScore: enrichedData.confidenceScore,
    recommendedActions
  };
}

function calculateMileageAdjustment(enrichedData: EnrichedVehicleData): number {
  const mileage = parseInt(enrichedData.vehicleDetails.mileage || '100000');
  
  // Mileage adjustments based on common brackets
  if (mileage < 30000) return 1.15; // Low mileage premium
  if (mileage < 60000) return 1.05; // Slightly above average
  if (mileage < 100000) return 1.0;  // Average
  if (mileage < 150000) return 0.9;  // High mileage discount
  return 0.8; // Very high mileage
}

function calculateConditionAdjustment(enrichedData: EnrichedVehicleData): number {
  const conditionScore = enrichedData.conditionAnalysis.conditionScore;
  
  // Convert 1-10 scale to multiplier
  return 0.5 + (conditionScore / 10) * 0.6; // Range: 0.56 to 1.16
}

function calculateAuctionDiscount(enrichedData: EnrichedVehicleData): number {
  // If vehicle has auction history, apply auction discount
  if (enrichedData.auctionHistory.totalSales > 0) {
    return 0.85; // 15% discount for auction vehicles
  }
  return 1.0;
}

function calculateMarketDemand(enrichedData: EnrichedVehicleData): number {
  const competitorCount = enrichedData.marketPosition.competitorCount;
  
  // More competitors = lower prices
  if (competitorCount > 20) return 0.95;
  if (competitorCount > 10) return 0.98;
  if (competitorCount < 3) return 1.05; // Low supply premium
  return 1.0;
}

function calculateDamageAdjustment(enrichedData: EnrichedVehicleData): number {
  const { detectedDamage, accidentHistory } = enrichedData.conditionAnalysis;
  const { statVinData } = enrichedData;
  
  let adjustment = 1.0;
  
  // Check for damage from STAT.vin data
  if (statVinData?.primaryDamage || statVinData?.damage) {
    const damageType = (statVinData.primaryDamage || statVinData.damage || '').toLowerCase();
    
    if (damageType.includes('front')) adjustment *= 0.85;
    if (damageType.includes('rear')) adjustment *= 0.9;
    if (damageType.includes('side')) adjustment *= 0.88;
    if (damageType.includes('roof') || damageType.includes('hail')) adjustment *= 0.92;
    if (damageType.includes('flood') || damageType.includes('water')) adjustment *= 0.7;
    if (damageType.includes('fire')) adjustment *= 0.6;
  }
  
  // Additional penalty for multiple damage types
  if (detectedDamage.length > 1) {
    adjustment *= 0.95;
  }
  
  return adjustment;
}

function calculateTitleStatusAdjustment(enrichedData: EnrichedVehicleData): number {
  const titleStatus = enrichedData.conditionAnalysis.titleStatus?.toLowerCase() || '';
  
  if (titleStatus.includes('salvage')) return 0.6;
  if (titleStatus.includes('rebuilt')) return 0.75;
  if (titleStatus.includes('flood')) return 0.65;
  if (titleStatus.includes('lemon')) return 0.7;
  if (titleStatus.includes('clean')) return 1.0;
  
  return 0.95; // Unknown status gets small penalty
}

function determineMarketPosition(vehicleValue: number, marketAverage: number): string {
  const ratio = vehicleValue / marketAverage;
  
  if (ratio < 0.8) return 'Well Below Market';
  if (ratio < 0.9) return 'Below Market';
  if (ratio < 1.1) return 'At Market';
  if (ratio < 1.2) return 'Above Market';
  return 'Premium';
}

function generateRecommendations(
  enrichedData: EnrichedVehicleData, 
  factors: ValuationFactors, 
  finalValue: number
): string[] {
  const recommendations: string[] = [];
  const { dealerOpportunity, conditionAnalysis, marketPosition } = enrichedData;
  
  // Flip opportunity recommendations
  if (dealerOpportunity.flipOpportunityScore > 70) {
    recommendations.push('🚀 High flip potential - strong profit margins expected');
  } else if (dealerOpportunity.flipOpportunityScore > 40) {
    recommendations.push('💰 Moderate flip potential - decent margins available');
  } else if (dealerOpportunity.flipOpportunityScore < 20) {
    recommendations.push('⚠️ Low flip potential - tight margins, proceed with caution');
  }
  
  // Condition-based recommendations
  if (conditionAnalysis.detectedDamage.length > 0) {
    recommendations.push(`🔧 Address damage issues: ${conditionAnalysis.detectedDamage.join(', ')}`);
  }
  
  // Market position recommendations
  if (marketPosition.isUndervalued) {
    recommendations.push('📈 Vehicle appears undervalued relative to market');
  }
  
  // Timing recommendations
  if (dealerOpportunity.timeToSell === 'fast') {
    recommendations.push('⚡ Quick sale expected - high market demand');
  } else if (dealerOpportunity.timeToSell === 'slow') {
    recommendations.push('🐌 Longer sales cycle expected - price competitively');
  }
  
  // Risk factor recommendations
  if (enrichedData.riskFactors.length > 2) {
    recommendations.push('⚠️ Multiple risk factors identified - thorough inspection recommended');
  }
  
  return recommendations;
}
