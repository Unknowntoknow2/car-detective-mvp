
import { supabase } from '@/integrations/supabase/client';
import { fetchStatVinData } from './sources/fetchStatVinData';
import { fetchMarketplaceListings, MarketplaceData } from './sources/fetchMarketplaceListings';
import { StatVinData } from './types';

export interface EnrichedVehicleData {
  vin: string;
  vehicleDetails: {
    make?: string;
    model?: string;
    year?: string;
    trim?: string;
    bodyType?: string;
    engine?: string;
    transmission?: string;
    fuelType?: string;
    drivetrain?: string;
    exteriorColor?: string;
    interiorColor?: string;
    mileage?: string;
  };
  auctionHistory: {
    totalSales: number;
    averagePrice?: number;
    priceRange?: [number, number];
    mostRecentSale?: {
      date: string;
      price: string;
      location: string;
      condition?: string;
      damage?: string;
    };
    salesByYear: Array<{
      year: string;
      count: number;
      averagePrice: number;
    }>;
  };
  marketData: MarketplaceData;
  statVinData: StatVinData | null;
  conditionAnalysis: {
    detectedDamage: string[];
    titleStatus?: string;
    accidentHistory: boolean;
    conditionScore: number; // 1-10 scale
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  marketPosition: {
    isUndervalued: boolean;
    marketPriceRange: [number, number];
    competitorCount: number;
    averageMarketPrice: number;
    pricePercentile: number; // Where this vehicle sits in market pricing
  };
  dealerOpportunity: {
    estimatedAcquisitionCost: number;
    estimatedRetailValue: number;
    potentialMargin: number;
    flipOpportunityScore: number; // 1-100
    timeToSell: string; // "fast", "medium", "slow"
  };
  photos: string[];
  auctionSalesHistory: Array<{
    date: string;
    price: string;
    location: string;
    seller: string;
    condition?: string;
    damage?: string;
    mileage?: string;
  }>;
  ownershipHistory: {
    estimatedOwners: number;
    titleTransfers: number;
    lastTransferDate?: string;
  };
  riskFactors: string[];
  confidenceScore: number;
  generatedAt: string;
}

export async function getEnrichedVehicleData(
  vin: string, 
  userHasPremium: boolean = false
): Promise<EnrichedVehicleData> {
  try {
    console.log(`🔍 Enriching data for VIN: ${vin} (Premium: ${userHasPremium})`);
    
    // Check cache first
    const { data: cached } = await supabase
      .from('auction_enrichment_by_vin')
      .select('*')
      .eq('vin', vin.toUpperCase())
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24h cache
      .maybeSingle();

    if (cached && cached.data) {
      console.log('✅ Using cached enrichment data');
      return cached.data as EnrichedVehicleData;
    }

    // Premium users get full enrichment, free users get limited data
    if (!userHasPremium) {
      console.log('ℹ️ Limited enrichment for free user');
      return createLimitedEnrichmentData(vin);
    }

    console.log('🚀 Fetching fresh enrichment data for premium user');

    // Fetch data from all sources in parallel
    const [statVinData, marketplaceData] = await Promise.allSettled([
      fetchStatVinData(vin),
      fetchMarketplaceListings({
        vin,
        make: '', // Will be populated from VIN decode
        model: '',
        year: 0,
        zipCode: '90210' // Default for now
      })
    ]);

    const statVin = statVinData.status === 'fulfilled' ? statVinData.value : null;
    const marketplace = marketplaceData.status === 'fulfilled' ? marketplaceData.value : {
      allListings: [],
      bySource: { facebook: [], craigslist: [], carscom: [] },
      priceAnalysis: { averagePrice: 0, medianPrice: 0, priceRange: [0, 0], listingCount: 0 },
      errors: []
    };

    // Build enriched data
    const enrichedData = buildEnrichedData(vin, statVin, marketplace);

    // Cache the results
    await supabase
      .from('auction_enrichment_by_vin')
      .upsert([{
        vin: vin.toUpperCase(),
        source: 'unified_enrichment',
        data: enrichedData,
        updated_at: new Date().toISOString()
      }]);

    console.log('✅ Enrichment completed and cached');
    return enrichedData;

  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    // Return basic structure on error
    return createLimitedEnrichmentData(vin);
  }
}

function createLimitedEnrichmentData(vin: string): EnrichedVehicleData {
  return {
    vin,
    vehicleDetails: {},
    auctionHistory: {
      totalSales: 0,
      salesByYear: []
    },
    marketData: {
      allListings: [],
      bySource: { facebook: [], craigslist: [], carscom: [] },
      priceAnalysis: { averagePrice: 0, medianPrice: 0, priceRange: [0, 0], listingCount: 0 },
      errors: ['Premium access required for full market data']
    },
    statVinData: null,
    conditionAnalysis: {
      detectedDamage: [],
      accidentHistory: false,
      conditionScore: 5,
      confidenceLevel: 'low'
    },
    marketPosition: {
      isUndervalued: false,
      marketPriceRange: [0, 0],
      competitorCount: 0,
      averageMarketPrice: 0,
      pricePercentile: 50
    },
    dealerOpportunity: {
      estimatedAcquisitionCost: 0,
      estimatedRetailValue: 0,
      potentialMargin: 0,
      flipOpportunityScore: 0,
      timeToSell: 'unknown'
    },
    photos: [],
    auctionSalesHistory: [],
    ownershipHistory: {
      estimatedOwners: 1,
      titleTransfers: 1
    },
    riskFactors: ['Limited data available'],
    confidenceScore: 0.3,
    generatedAt: new Date().toISOString()
  };
}

function buildEnrichedData(
  vin: string, 
  statVin: StatVinData | null, 
  marketplace: MarketplaceData
): EnrichedVehicleData {
  // Analyze auction history from STAT.vin
  const auctionHistory = analyzeAuctionHistory(statVin);
  
  // Build vehicle details from available data
  const vehicleDetails = {
    make: statVin?.make,
    model: statVin?.model,
    year: statVin?.year,
    bodyType: statVin?.bodyType,
    engine: statVin?.engine,
    transmission: statVin?.transmission,
    fuelType: statVin?.fuelType,
    drivetrain: statVin?.drivetrain,
    exteriorColor: statVin?.exteriorColor,
    interiorColor: statVin?.interiorColor,
    mileage: statVin?.mileage
  };

  // Analyze condition from STAT.vin damage data
  const conditionAnalysis = analyzeCondition(statVin);
  
  // Calculate market position
  const marketPosition = calculateMarketPosition(marketplace, statVin);
  
  // Calculate dealer opportunity
  const dealerOpportunity = calculateDealerOpportunity(statVin, marketplace);

  return {
    vin,
    vehicleDetails,
    auctionHistory,
    marketData: marketplace,
    statVinData: statVin,
    conditionAnalysis,
    marketPosition,
    dealerOpportunity,
    photos: statVin?.images || [],
    auctionSalesHistory: statVin ? [{
      date: statVin.auctionDate || '',
      price: statVin.salePrice || '0',
      location: statVin.location || '',
      seller: statVin.seller || '',
      condition: statVin.condition,
      damage: statVin.primaryDamage || statVin.damage,
      mileage: statVin.mileage
    }] : [],
    ownershipHistory: {
      estimatedOwners: 2, // Default estimate
      titleTransfers: 1
    },
    riskFactors: calculateRiskFactors(statVin),
    confidenceScore: calculateConfidenceScore(statVin, marketplace),
    generatedAt: new Date().toISOString()
  };
}

function analyzeAuctionHistory(statVin: StatVinData | null) {
  if (!statVin || !statVin.salePrice) {
    return {
      totalSales: 0,
      salesByYear: []
    };
  }

  const price = parseFloat(statVin.salePrice.replace(/[^0-9.]/g, '')) || 0;
  const year = statVin.auctionDate ? new Date(statVin.auctionDate).getFullYear().toString() : new Date().getFullYear().toString();

  return {
    totalSales: 1,
    averagePrice: price,
    priceRange: [price, price] as [number, number],
    mostRecentSale: {
      date: statVin.auctionDate || '',
      price: statVin.salePrice,
      location: statVin.location || '',
      condition: statVin.condition,
      damage: statVin.primaryDamage || statVin.damage
    },
    salesByYear: [{
      year,
      count: 1,
      averagePrice: price
    }]
  };
}

function analyzeCondition(statVin: StatVinData | null) {
  const detectedDamage: string[] = [];
  let conditionScore = 8; // Start with good condition
  let accidentHistory = false;

  if (statVin) {
    if (statVin.primaryDamage || statVin.damage) {
      detectedDamage.push(statVin.primaryDamage || statVin.damage || '');
      conditionScore -= 3;
      accidentHistory = true;
    }
    
    if (statVin.secondaryDamage) {
      detectedDamage.push(statVin.secondaryDamage);
      conditionScore -= 1;
    }

    if (statVin.titleType?.toLowerCase().includes('salvage') || 
        statVin.status?.toLowerCase().includes('salvage')) {
      conditionScore -= 4;
      accidentHistory = true;
    }

    if (!statVin.runAndDrive) {
      conditionScore -= 2;
    }
  }

  return {
    detectedDamage,
    titleStatus: statVin?.titleType || statVin?.status,
    accidentHistory,
    conditionScore: Math.max(1, Math.min(10, conditionScore)),
    confidenceLevel: statVin ? 'high' : 'low' as 'high' | 'medium' | 'low'
  };
}

function calculateMarketPosition(marketplace: MarketplaceData, statVin: StatVinData | null) {
  const { priceAnalysis } = marketplace;
  const auctionPrice = statVin?.salePrice ? parseFloat(statVin.salePrice.replace(/[^0-9.]/g, '')) : 0;

  return {
    isUndervalued: auctionPrice > 0 && auctionPrice < priceAnalysis.averagePrice * 0.8,
    marketPriceRange: priceAnalysis.priceRange,
    competitorCount: priceAnalysis.listingCount,
    averageMarketPrice: priceAnalysis.averagePrice,
    pricePercentile: auctionPrice > 0 ? calculatePercentile(auctionPrice, priceAnalysis) : 50
  };
}

function calculatePercentile(price: number, analysis: { averagePrice: number; medianPrice: number; priceRange: [number, number] }): number {
  if (analysis.priceRange[1] === analysis.priceRange[0]) return 50;
  
  const position = (price - analysis.priceRange[0]) / (analysis.priceRange[1] - analysis.priceRange[0]);
  return Math.round(position * 100);
}

function calculateDealerOpportunity(statVin: StatVinData | null, marketplace: MarketplaceData) {
  const auctionPrice = statVin?.salePrice ? parseFloat(statVin.salePrice.replace(/[^0-9.]/g, '')) : 0;
  const marketAverage = marketplace.priceAnalysis.averagePrice;
  
  const acquisitionCost = auctionPrice + (auctionPrice * 0.1); // Add 10% for fees
  const retailValue = marketAverage;
  const margin = retailValue - acquisitionCost;
  
  return {
    estimatedAcquisitionCost: acquisitionCost,
    estimatedRetailValue: retailValue,
    potentialMargin: margin,
    flipOpportunityScore: margin > 0 ? Math.min(100, Math.round((margin / acquisitionCost) * 100)) : 0,
    timeToSell: margin > acquisitionCost * 0.3 ? 'fast' : margin > acquisitionCost * 0.15 ? 'medium' : 'slow'
  };
}

function calculateRiskFactors(statVin: StatVinData | null): string[] {
  const risks: string[] = [];
  
  if (!statVin) {
    risks.push('Limited auction history data');
    return risks;
  }

  if (statVin.primaryDamage || statVin.damage) {
    risks.push(`Previous damage: ${statVin.primaryDamage || statVin.damage}`);
  }

  if (statVin.titleType?.toLowerCase().includes('salvage')) {
    risks.push('Salvage title history');
  }

  if (!statVin.runAndDrive) {
    risks.push('Vehicle may not be operational');
  }

  if (statVin.estimatedRepairCost) {
    const repairCost = parseFloat(statVin.estimatedRepairCost.replace(/[^0-9.]/g, ''));
    if (repairCost > 5000) {
      risks.push('High estimated repair costs');
    }
  }

  return risks;
}

function calculateConfidenceScore(statVin: StatVinData | null, marketplace: MarketplaceData): number {
  let score = 0.5; // Base score

  // STAT.vin data adds confidence
  if (statVin) {
    score += 0.3;
    if (statVin.salePrice) score += 0.1;
    if (statVin.auctionDate) score += 0.05;
    if (statVin.images && statVin.images.length > 0) score += 0.05;
  }

  // Marketplace data adds confidence
  if (marketplace.priceAnalysis.listingCount > 0) {
    score += 0.1;
    if (marketplace.priceAnalysis.listingCount >= 5) score += 0.1;
    if (marketplace.priceAnalysis.listingCount >= 10) score += 0.1;
  }

  return Math.min(1.0, score);
}
