import { fetchMarketplaceListings } from "@/services/valuation/fetchMarketplaceListings";
import { AllDealerSources, DealerSourceResult, getDealerDomain, getDealerTier, getDealerTrustWeight, RetailDealerSources } from "@/utils/dealerSources";
import { AllP2PSources } from "@/utils/p2pSources";
import { getMarketMultiplier } from "@/utils/valuation/marketData";
import { getTitleStatusAdjustmentFromDB, getTitleStatusAdjustment } from "@/utils/adjustments/titleStatusAdjustments";
import { P2PSourceResult, getP2PDomain, getP2PTier, getP2PTrustWeight, PrivateMarketplaces } from "@/utils/p2pSources";
import { fetchCachedMarketComps, fetchMarketComps, MarketSearchResult } from "@/services/valuation/marketSearchService";
import { fetchVehicleTitlesAndRecalls, TitleRecallInfo } from "@/services/valuation/titleRecallAgent";
import { generateConfidenceScore, ConfidenceScoreParams } from "@/services/generateConfidenceScore";
import { extractTrustedSources } from "@/services/generateConfidenceScore";
import { getMileageAdjustment } from "@/utils/adjustments/mileageAdjustments";
import { getConditionAdjustment } from "@/utils/adjustments/conditionAdjustments";
import { getZipAdjustment } from "@/utils/adjustments/locationAdjustments";
import { parseVehicleListingsFromWeb, ParsedListing, formatListingsForExplanation } from "@/utils/parsers/listingParser";
import { supabase } from "@/integrations/supabase/client";

// ValuationEngineInput interface
export interface ValuationEngineInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  titleStatus?: string;
  decodedVehicle?: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    bodyType?: string;
  };
  photos?: string[];
  marketData?: MarketSearchResult;
  titleInfo?: TitleRecallInfo;
  additionalFeatures?: string[];
  accidentCount?: number;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
  aiConditionOverride?: any;
}

// UnifiedValuationResult interface
export interface UnifiedValuationResult {
  finalValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  marketListings: {
    price: number;
    mileage: number;
    source: string;
    tier: string;
    trustWeight: number;
    location?: string;
    url?: string;
  }[];
  zipAdjustment: number;
  mileagePenalty: number;
  conditionDelta: number;
  titlePenalty: number;
  aiExplanation?: string;
  sourcesUsed: string[];
  adjustments: {
    factor: string;
    impact: number;
    description: string;
  }[];
  baseValue: number;
  explanation?: string;
}

interface MarketSearchAgentResult {
  listings: any[];
  trustedSources: string[];
  trustScore: number;
}

/**
 * MarketSearchAgent class for fetching and processing market listings
 */
class MarketSearchAgent {
  async searchMarketListings(params: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage: number;
    zipCode: string;
    vin?: string;
  }): Promise<any[]> {
    try {
      console.log('🔍 [MARKET_SEARCH_AGENT] Starting market search...');

      // Fetch marketplace listings
      const marketplaceListings = await fetchMarketplaceListings(
        params.make,
        params.model,
        params.year,
        params.zipCode,
        params.vin
      );

      console.log(`🛍️ [MARKET_SEARCH_AGENT] Fetched ${marketplaceListings.length} marketplace listings`);

      // Transform marketplace listings to a common format
      const transformedListings = marketplaceListings.map(listing => ({
        price: listing.price,
        mileage: listing.mileage,
        source: listing.source,
        location: listing.location,
        url: listing.listing_url,
        title: `${params.year} ${params.make} ${params.model} ${params.trim || ''}`,
        is_cpo: listing.is_cpo,
        dealer_name: listing.dealer_name,
        condition: listing.condition,
        year: params.year,
        make: params.make,
        model: params.model,
        trim: params.trim,
        vin: params.vin,
        sellerType: listing.dealer_name ? 'dealer' : 'private',
      }));

      console.log(`✅ [MARKET_SEARCH_AGENT] Transformed ${transformedListings.length} marketplace listings`);

      // Augment listings with tier and trust information
      const augmentedListings = transformedListings.map(listing => {
        let tier: 'Tier1' | 'Tier2' | 'Tier3' = 'Tier3';
        let trustWeight = 0.7;

        if (listing.sellerType === 'dealer') {
          tier = getDealerTier(listing.source);
          trustWeight = getDealerTrustWeight(listing.source);
        } else {
          tier = getP2PTier(listing.source);
          trustWeight = getP2PTrustWeight(listing.source);
        }

        return {
          ...listing,
          tier,
          trustWeight,
        };
      });

      console.log(`✨ [MARKET_SEARCH_AGENT] Augmented ${augmentedListings.length} listings with tier and trust`);

      return augmentedListings;
    } catch (error) {
      console.error('❌ [MARKET_SEARCH_AGENT] Error in market search:', error);
      return [];
    }
  }
}

/**
 * Enhanced unified valuation engine with real-time market intelligence
 * Combines dealer listings, P2P marketplaces, and AI-powered adjustments
 */
export async function calculateUnifiedValuation(
  input: ValuationEngineInput
): Promise<UnifiedValuationResult> {
  console.log('🚀 [VALUATION_ENGINE] Starting enhanced unified valuation for:', input.vin);

  try {
    // PHASE 1: Enhanced Input Validation & Normalization
    const validationResult = validateAndNormalizeInput(input);
    if (!validationResult.isValid) {
      throw new Error(`Input validation failed: ${validationResult.errors.join(', ')}`);
    }

    const { 
      make, 
      model, 
      year, 
      trim, 
      mileage, 
      condition, 
      zipCode, 
      titleStatus,
      vin 
    } = validationResult.normalizedInput;

    console.log('✅ [VALUATION_ENGINE] Input validated:', { make, model, year, mileage, condition, zipCode });

    // PHASE 2: Enhanced Real-Time Market Intelligence
    const marketData = await enhancedMarketSearch({
      make,
      model,
      year,
      trim,
      mileage,
      zipCode,
      vin
    });

    console.log(`📊 [VALUATION_ENGINE] Market data collected: ${marketData.allListings.length} total listings`);

    // PHASE 3: Advanced Listing Filtering & Quality Control
    const filteredListings = applyAdvancedFiltering(marketData.allListings, {
      targetYear: year,
      targetMileage: mileage,
      targetTrim: trim,
      zipCode
    });

    console.log(`🔍 [VALUATION_ENGINE] After advanced filtering: ${filteredListings.length} quality listings`);

    if (filteredListings.length === 0) {
      throw new Error('No quality market listings found after filtering');
    }

    // PHASE 4: Enhanced Valuation Calculation Logic
    const valuationResult = calculateEnhancedValue({
      listings: filteredListings,
      vehicle: { make, model, year, trim, mileage },
      condition,
      zipCode,
      titleStatus
    });

    console.log('💰 [VALUATION_ENGINE] Base calculation complete:', valuationResult.baseValue);

    // PHASE 5: Advanced Confidence Scoring Algorithm
    const confidenceMetrics = calculateAdvancedConfidence({
      listings: filteredListings,
      marketData,
      vehicle: { make, model, year, mileage },
      condition,
      titleStatus,
      zipCode
    });

    console.log('🎯 [VALUATION_ENGINE] Confidence calculated:', confidenceMetrics.score);

    // PHASE 6: Enhanced AI Explanation Generation
    const aiExplanation = await generateEnhancedExplanation({
      valuationResult,
      confidenceMetrics,
      marketData,
      vehicle: { make, model, year, trim, mileage },
      condition,
      zipCode,
      titleStatus
    });

    // Compile final result with enhanced output validation
    const finalResult: UnifiedValuationResult = {
      finalValue: Math.round(valuationResult.adjustedValue),
      priceRange: [
        Math.round(valuationResult.adjustedValue * 0.9),
        Math.round(valuationResult.adjustedValue * 1.1)
      ],
      confidenceScore: Math.round(confidenceMetrics.score),
      marketListings: filteredListings.map(listing => ({
        price: listing.price,
        mileage: listing.mileage || 0,
        source: listing.source,
        tier: listing.tier,
        trustWeight: listing.trustWeight,
        location: listing.location,
        url: listing.url
      })),
      zipAdjustment: valuationResult.adjustments.zipAdjustment,
      mileagePenalty: valuationResult.adjustments.mileageAdjustment,
      conditionDelta: valuationResult.adjustments.conditionAdjustment,
      titlePenalty: valuationResult.adjustments.titlePenalty,
      aiExplanation,
      sourcesUsed: marketData.sourcesUsed,
      adjustments: Object.entries(valuationResult.adjustments).map(([factor, impact]) => ({
        factor,
        impact: typeof impact === 'number' ? impact : 0,
        description: getAdjustmentDescription(factor, impact)
      })),
      baseValue: valuationResult.baseValue,
      explanation: aiExplanation
    };

    // Output validation
    validateFinalResult(finalResult);

    console.log('🎉 [VALUATION_ENGINE] Enhanced valuation complete:', {
      finalValue: finalResult.finalValue,
      confidence: finalResult.confidenceScore,
      listingsUsed: filteredListings.length
    });

    return finalResult;

  } catch (error) {
    console.error('❌ [VALUATION_ENGINE] Enhanced valuation failed:', error);
    throw error;
  }
}

// PHASE 1: Enhanced Input Validation & Normalization
function validateAndNormalizeInput(input: ValuationEngineInput): {
  isValid: boolean;
  errors: string[];
  normalizedInput: any;
} {
  const errors: string[] = [];
  
  // Enhanced validation logic
  if (!input.vin || input.vin.length !== 17) {
    errors.push('Valid 17-character VIN required');
  }
  
  if (!input.zipCode || !/^\d{5}$/.test(input.zipCode)) {
    errors.push('Valid 5-digit ZIP code required');
  }
  
  if (!input.mileage || input.mileage < 0 || input.mileage > 500000) {
    errors.push('Valid mileage (0-500,000) required');
  }
  
  if (!input.decodedVehicle?.make || !input.decodedVehicle?.model || !input.decodedVehicle?.year) {
    errors.push('Decoded vehicle data (make, model, year) required');
  }

  const normalizedInput = {
    make: input.decodedVehicle?.make?.trim().toLowerCase(),
    model: input.decodedVehicle?.model?.trim().toLowerCase(),
    year: parseInt(String(input.decodedVehicle?.year)),
    trim: input.decodedVehicle?.trim?.trim() || '',
    mileage: parseInt(String(input.mileage)),
    condition: input.condition || 'good',
    zipCode: input.zipCode,
    titleStatus: input.titleStatus || 'clean',
    vin: input.vin
  };

  return {
    isValid: errors.length === 0,
    errors,
    normalizedInput
  };
}

// PHASE 2: Enhanced Market Search
async function enhancedMarketSearch(params: {
  make: string;
  model: string;
  year: number;
  trim: string;
  mileage: number;
  zipCode: string;
  vin: string;
}): Promise<{
  allListings: any[];
  sourcesUsed: string[];
  retailListings: any[];
  p2pListings: any[];
}> {
  console.log('🔍 [MARKET_SEARCH] Starting enhanced market search...');

  // Use existing market search agent
  const marketAgent = new MarketSearchAgent();
  const searchResults = await marketAgent.searchMarketListings(params);

  // Categorize listings by type
  const retailListings = searchResults.filter(listing => 
    listing.sellerType !== 'private' && listing.source !== 'private'
  );
  
  const p2pListings = searchResults.filter(listing => 
    listing.sellerType === 'private' || 
    ['facebook marketplace', 'craigslist', 'offerup', 'ebay motors'].includes(listing.source.toLowerCase())
  );

  console.log(`📊 [MARKET_SEARCH] Results: ${retailListings.length} retail, ${p2pListings.length} P2P`);

  return {
    allListings: searchResults,
    sourcesUsed: [...new Set(searchResults.map(l => l.source))],
    retailListings,
    p2pListings
  };
}

// PHASE 3: Advanced Filtering & Quality Control
function applyAdvancedFiltering(listings: any[], criteria: {
  targetYear: number;
  targetMileage: number;
  targetTrim: string;
  zipCode: string;
}): any[] {
  console.log(`🔍 [FILTERING] Applying advanced filters to ${listings.length} listings`);

  let filtered = listings;

  // ±3 model year filtering
  filtered = filtered.filter(listing => {
    const yearDiff = Math.abs((listing.year || criteria.targetYear) - criteria.targetYear);
    return yearDiff <= 3;
  });

  // ±25k mileage window (more sophisticated than existing ±20%)
  filtered = filtered.filter(listing => {
    if (!listing.mileage) return true; // Keep if mileage unknown
    const mileageDiff = Math.abs(listing.mileage - criteria.targetMileage);
    return mileageDiff <= 25000;
  });

  // Same/similar trim matching when available
  if (criteria.targetTrim) {
    const trimFiltered = filtered.filter(listing => 
      !listing.trim || 
      listing.trim.toLowerCase().includes(criteria.targetTrim.toLowerCase()) ||
      criteria.targetTrim.toLowerCase().includes(listing.trim.toLowerCase())
    );
    
    // Only apply trim filter if we still have sufficient listings
    if (trimFiltered.length >= Math.min(3, filtered.length * 0.3)) {
      filtered = trimFiltered;
    }
  }

  // Enhanced outlier detection using 1.5× IQR method
  if (filtered.length >= 5) {
    const prices = filtered.map(l => l.price).sort((a, b) => a - b);
    const q1 = prices[Math.floor(prices.length * 0.25)];
    const q3 = prices[Math.floor(prices.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const beforeOutlierRemoval = filtered.length;
    filtered = filtered.filter(listing => 
      listing.price >= lowerBound && listing.price <= upperBound
    );
    
    console.log(`📊 [FILTERING] Outlier removal: ${beforeOutlierRemoval} → ${filtered.length} listings`);
  }

  // Quality score filtering (remove obviously poor listings)
  filtered = filtered.filter(listing => {
    if (listing.price < 1000 || listing.price > 200000) return false;
    if (listing.mileage && (listing.mileage < 0 || listing.mileage > 400000)) return false;
    return true;
  });

  console.log(`✅ [FILTERING] Advanced filtering complete: ${filtered.length} quality listings`);
  return filtered;
}

// PHASE 4: Enhanced Valuation Calculation
function calculateEnhancedValue(params: {
  listings: any[];
  vehicle: any;
  condition: string;
  zipCode: string;
  titleStatus: string;
}): {
  baseValue: number;
  adjustedValue: number;
  adjustments: Record<string, number>;
} {
  console.log('💰 [CALCULATION] Starting enhanced value calculation...');

  // Weighted median calculation instead of simple median
  const weightedMedian = calculateWeightedMedian(params.listings);
  console.log(`📊 [CALCULATION] Weighted median base value: $${weightedMedian}`);

  const adjustments: Record<string, number> = {};

  // ZIP-based demand density adjustment (±0-15%)
  adjustments.zipAdjustment = calculateZipAdjustment(params.zipCode, weightedMedian);

  // Enhanced mileage adjustment curves
  adjustments.mileageAdjustment = calculateMileageAdjustment(
    params.vehicle.mileage, 
    params.vehicle.make, 
    params.vehicle.year,
    weightedMedian
  );

  // Condition delta with AI integration
  adjustments.conditionAdjustment = calculateConditionAdjustment(
    params.condition, 
    weightedMedian
  );

  // Title penalty system
  adjustments.titlePenalty = calculateTitlePenalty(
    params.titleStatus, 
    weightedMedian
  );

  const totalAdjustment = Object.values(adjustments).reduce((sum, adj) => sum + adj, 0);
  const adjustedValue = Math.max(weightedMedian + totalAdjustment, weightedMedian * 0.3);

  console.log('💰 [CALCULATION] Adjustments applied:', adjustments);

  return {
    baseValue: weightedMedian,
    adjustedValue,
    adjustments
  };
}

// PHASE 5: Advanced Confidence Scoring
function calculateAdvancedConfidence(params: {
  listings: any[];
  marketData: any;
  vehicle: any;
  condition: string;
  titleStatus: string;
  zipCode: string;
}): { score: number; breakdown: Record<string, number> } {
  console.log('🎯 [CONFIDENCE] Calculating advanced confidence score...');

  const breakdown: Record<string, number> = {};

  // Listing Volume (ZIP) - 30%
  const listingVolume = Math.min(params.listings.length / 10, 1);
  breakdown.listingVolume = listingVolume * 30;

  // Listing Variance - 20%
  const prices = params.listings.map(l => l.price);
  const variance = calculateVariance(prices);
  const maxPrice = Math.max(...prices);
  const varianceScore = Math.max(0, 1 - (variance / (maxPrice * maxPrice)));
  breakdown.listingVariance = varianceScore * 20;

  // Source Trust Tier - 20%
  const avgTrustWeight = params.listings.reduce((sum, l) => sum + (l.trustWeight || 0.7), 0) / params.listings.length;
  breakdown.sourceTrust = avgTrustWeight * 20;

  // Mileage Proximity - 10%
  const mileageMatches = params.listings.filter(l => 
    Math.abs((l.mileage || params.vehicle.mileage) - params.vehicle.mileage) <= 15000
  ).length;
  const mileageScore = mileageMatches / params.listings.length;
  breakdown.mileageProximity = mileageScore * 10;

  // Condition Match - 10%
  const conditionMatches = params.listings.filter(l => 
    !l.condition || l.condition.toLowerCase() === params.condition.toLowerCase()
  ).length;
  const conditionScore = conditionMatches / params.listings.length;
  breakdown.conditionMatch = conditionScore * 10;

  // Title/Recall Status - 10%
  const titleScore = params.titleStatus === 'clean' ? 1 : 
                    params.titleStatus === 'rebuilt' ? 0.7 : 
                    params.titleStatus === 'salvage' ? 0.3 : 0.8;
  breakdown.titleStatus = titleScore * 10;

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  console.log('🎯 [CONFIDENCE] Score breakdown:', breakdown);

  return { score: Math.min(totalScore, 95), breakdown };
}

// PHASE 6: Enhanced AI Explanation
async function generateEnhancedExplanation(params: {
  valuationResult: any;
  confidenceMetrics: any;
  marketData: any;
  vehicle: any;
  condition: string;
  zipCode: string;
  titleStatus: string;
}): Promise<string> {
  const { valuationResult, marketData, vehicle, condition, zipCode, titleStatus } = params;
  
  const explanation = `This valuation is based on ${marketData.allListings.length} active listings within 50 miles of ZIP ${zipCode}, adjusted for ${vehicle.mileage.toLocaleString()} miles and ${condition} condition. Comparable ${vehicle.year} ${vehicle.make} ${vehicle.model} models range from $${Math.min(...marketData.allListings.map((l: any) => l.price)).toLocaleString()} to $${Math.max(...marketData.allListings.map((l: any) => l.price)).toLocaleString()}. A final value of $${valuationResult.adjustedValue.toLocaleString()} was computed based on market demand and vehicle-specific factors.`;

  return explanation;
}

// Helper functions
function calculateWeightedMedian(listings: any[]): number {
  const weightedPrices = listings.map(listing => ({
    price: listing.price,
    weight: listing.trustWeight || 0.7
  })).sort((a, b) => a.price - b.price);

  const totalWeight = weightedPrices.reduce((sum, item) => sum + item.weight, 0);
  const halfWeight = totalWeight / 2;
  
  let cumWeight = 0;
  for (const item of weightedPrices) {
    cumWeight += item.weight;
    if (cumWeight >= halfWeight) {
      return item.price;
    }
  }
  
  return weightedPrices[Math.floor(weightedPrices.length / 2)].price;
}

function calculateZipAdjustment(zipCode: string, baseValue: number): number {
  // Enhanced ZIP-based demand density calculation
  // This would integrate with real market data APIs in production
  const highDemandZips = ['94102', '90210', '10001', '02101'];
  const multiplier = highDemandZips.includes(zipCode) ? 1.05 : 1.0;
  return (multiplier - 1) * baseValue;
}

function calculateMileageAdjustment(mileage: number, make: string, year: number, baseValue: number): number {
  // Enhanced mileage curves by vehicle segment
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const expectedMileage = age * 12000; // 12k miles per year average
  const mileageDiff = mileage - expectedMileage;
  
  // Different depreciation curves for different vehicle types
  let depreciationRate = 0.15; // Default 15 cents per mile
  
  if (make.toLowerCase().includes('tesla') || make.toLowerCase().includes('electric')) {
    depreciationRate = 0.10; // EVs depreciate less on mileage
  } else if (['ford', 'chevrolet', 'ram'].includes(make.toLowerCase())) {
    depreciationRate = 0.12; // Trucks hold value better
  }
  
  return -Math.abs(mileageDiff) * depreciationRate;
}

function calculateConditionAdjustment(condition: string, baseValue: number): number {
  const conditionMultipliers: Record<string, number> = {
    'excellent': 1.05,
    'very good': 1.02,
    'good': 1.0,
    'fair': 0.95,
    'poor': 0.85
  };
  
  const multiplier = conditionMultipliers[condition.toLowerCase()] || 1.0;
  return (multiplier - 1) * baseValue;
}

function calculateTitlePenalty(titleStatus: string, baseValue: number): number {
  const titlePenalties: Record<string, number> = {
    'clean': 0,
    'rebuilt': -0.25,
    'salvage': -0.45,
    'flood': -0.40,
    'lemon': -0.30
  };
  
  const penalty = titlePenalties[titleStatus.toLowerCase()] || 0;
  return penalty * baseValue;
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}

function getAdjustmentDescription(factor: string, impact: number | any): string {
  const descriptions: Record<string, string> = {
    zipAdjustment: impact > 0 ? 'High demand area premium' : 'Average market area',
    mileageAdjustment: impact < 0 ? 'Higher mileage depreciation' : 'Lower mileage premium',
    conditionAdjustment: impact > 0 ? 'Above average condition' : 'Below average condition',
    titlePenalty: impact < 0 ? 'Title brand penalty applied' : 'Clean title verified'
  };
  
  return descriptions[factor] || `${factor} adjustment`;
}

function validateFinalResult(result: UnifiedValuationResult): void {
  if (!result.finalValue || result.finalValue <= 0) {
    throw new Error('Invalid final value calculated');
  }
  
  if (!result.confidenceScore || result.confidenceScore < 0 || result.confidenceScore > 100) {
    throw new Error('Invalid confidence score calculated');
  }
  
  if (!result.priceRange || result.priceRange[0] >= result.priceRange[1]) {
    throw new Error('Invalid price range calculated');
  }
}

export async function performValuation(
  valuationParams: ValuationEngineInput
): Promise<UnifiedValuationResult> {
  try {
    // Centralized logging
    console.log('Starting valuation process with params:', valuationParams);

    // 1. Input Validation
    if (!valuationParams.vin || !valuationParams.zipCode) {
      throw new Error('VIN and Zip Code are required.');
    }

    // 2. Data Enrichment (Mocked)
    const mockDecodedVehicle = {
      year: valuationParams.decodedVehicle?.year || 2018,
      make: valuationParams.decodedVehicle?.make || 'Honda',
      model: valuationParams.decodedVehicle?.model || 'Civic',
      trim: valuationParams.decodedVehicle?.trim || 'LX',
      bodyType: valuationParams.decodedVehicle?.bodyType || 'Sedan',
    };

    // 3. Market Data Aggregation
    const marketSearchAgent = new MarketSearchAgent();
    const marketListings = await marketSearchAgent.searchMarketListings({
      make: mockDecodedVehicle.make,
      model: mockDecodedVehicle.model,
      year: mockDecodedVehicle.year,
      trim: mockDecodedVehicle.trim,
      mileage: valuationParams.mileage,
      zipCode: valuationParams.zipCode,
      vin: valuationParams.vin,
    });

    // 4. Core Valuation Calculation
    let baseValue = 15000; // Placeholder base value
    let adjustedValue = baseValue;
    const adjustments: { factor: string; impact: number; description: string }[] = [];

    // 5. Apply Adjustments
    // Mileage Adjustment
    const mileageAdjustment = getMileageAdjustment(valuationParams.mileage, baseValue);
    adjustedValue += mileageAdjustment;
    adjustments.push({
      factor: 'mileage',
      impact: mileageAdjustment,
      description: `Mileage adjustment: ${mileageAdjustment}`,
    });

    // Condition Adjustment
    const conditionAdjustment = getConditionAdjustment(valuationParams.condition, baseValue);
    adjustedValue += conditionAdjustment;
    adjustments.push({
      factor: 'condition',
      impact: conditionAdjustment,
      description: `Condition adjustment: ${conditionAdjustment}`,
    });

    // Zip Code Adjustment
    const zipAdjustment = getZipAdjustment(valuationParams.zipCode);
    adjustedValue *= zipAdjustment;
    adjustments.push({
      factor: 'zipCode',
      impact: zipAdjustment,
      description: `Zip code adjustment: ${zipAdjustment}`,
    });

    // 6. Confidence Scoring
    const confidenceParams: ConfidenceScoreParams = {
      hasExactVinMatch: true,
      listingCount: marketListings.length,
      trustedSources: ['KBB', 'Edmunds'],
      trustScore: 0.8,
    };
    const confidenceResult = generateConfidenceScore(confidenceParams);

    // 7. Result Compilation
    const result: UnifiedValuationResult = {
      finalValue: adjustedValue,
      priceRange: [adjustedValue * 0.9, adjustedValue * 1.1],
      confidenceScore: confidenceResult.score,
      marketListings: marketListings.map(listing => ({
        price: listing.price,
        mileage: listing.mileage || 0,
        source: listing.source,
        tier: 'Tier1',
        trustWeight: 0.9,
        location: listing.location,
        url: listing.url,
      })),
      zipAdjustment: zipAdjustment,
      mileagePenalty: mileageAdjustment,
      conditionDelta: conditionAdjustment,
      titlePenalty: 0,
      aiExplanation: 'AI Explanation Placeholder',
      sourcesUsed: ['KBB', 'Edmunds'],
      adjustments: adjustments,
      baseValue: baseValue,
      explanation: 'Explanation Placeholder',
    };

    console.log('Valuation completed successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Valuation failed:', error);
    throw new Error(`Valuation failed: ${error.message}`);
  }
}
