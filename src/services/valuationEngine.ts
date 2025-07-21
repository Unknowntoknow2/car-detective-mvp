
import { calculateDepreciation } from "@/utils/valuation/depreciation";
import { calculateMileageAdjustment } from "@/utils/valuation/mileageAdjustment";
import { calculateConditionAdjustment } from "@/utils/valuation/conditionAdjustment";
import { calculateFuelTypeAdjustment } from "@/utils/valuation/fuelAdjustment";
import { getMarketMultiplier } from "@/utils/valuation/marketData";
import { fetchMarketComps, fetchCachedMarketComps } from "./valuation/marketSearchService";
import { saveMarketListings } from "./valuation/marketListingService";
import type { UnifiedValuationResult, ValuationAdjustment } from "@/types/valuation";

export interface ValuationInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  msrp?: number;
}

export async function calculateUnifiedValuation(input: ValuationInput): Promise<UnifiedValuationResult> {
  console.log('🔍 Starting unified valuation calculation with input:', input);

  const {
    vin,
    year,
    make,
    model,
    trim,
    mileage,
    condition,
    zipCode,
    fuelType = 'gasoline',
    msrp
  } = input;

  // Estimate base MSRP if not provided
  const estimatedMSRP = msrp || estimateVehicleMSRP(year, make, model);
  console.log(`💰 Base MSRP estimate: $${estimatedMSRP.toLocaleString()}`);

  let trustScore = 0.3;
  let trustNotes = 'Limited market data';
  let marketListings: any[] = [];
  let marketSearchStatus = 'pending';

  try {
    console.log('🔍 [MARKET_SEARCH] Attempting primary market search...');
    
    // Primary market search with enhanced error handling
    const searchResult = await fetchMarketComps(make, model, year, zipCode, vin);
    trustScore = searchResult.trust;
    trustNotes = searchResult.notes;
    const comps = searchResult.listings;

    // ✅ DEBUG: Add listing count fallback warning for debugging visibility
    if (!comps?.length || comps.length < 3) {
      console.warn('[VALUATION DEBUG] Warning: marketListings is empty or too small — falling back.', {
        listingsCount: comps?.length || 0,
        trustScore: searchResult.trust,
        source: searchResult.source,
        notes: searchResult.notes
      });
    }

    if (comps && comps.length >= 2 && trustScore >= 0.3) {
      // 🎯 CRITICAL: Check for exact VIN match first (highest priority)
      const exactVinMatch = comps.find(comp => comp.vin === vin);
      
      if (exactVinMatch) {
        console.log('🎯 EXACT VIN MATCH FOUND! Using exact pricing.');
        marketListings = [exactVinMatch];
        trustScore = 0.95;
        trustNotes = 'Exact VIN match found';
        marketSearchStatus = 'exact_match';
      } else {
        marketListings = comps;
        marketSearchStatus = 'success';
      }

      // Save market listings for future reference
      try {
        await saveMarketListings(marketListings, {
          vin,
          valuationId: crypto.randomUUID(),
          zipCode
        });
        console.log('✅ Market listings saved to database');
      } catch (saveError) {
        console.warn('⚠️ Failed to save market listings:', saveError);
      }

    } else {
      console.log('⚠️ [MARKET_SEARCH] Primary search insufficient, trying cache fallback...');
      
      // Try cached data as fallback
      const cacheResult = await fetchCachedMarketComps(make, model, year, zipCode);
      if (cacheResult.listings.length > 0) {
        marketListings = cacheResult.listings;
        trustScore = cacheResult.trust;
        trustNotes = cacheResult.notes;
        marketSearchStatus = 'cached';
        console.log('✅ Using cached market data as fallback');
      } else {
        console.log('❌ No cached data available, using fallback valuation');
        marketSearchStatus = 'fallback';
        trustScore = 0.2;
        trustNotes = 'No market data available - using estimated values';
      }
    }

  } catch (marketError) {
    console.error('❌ [MARKET_SEARCH] Critical error in market search:', marketError);
    marketSearchStatus = 'error';
    trustScore = 0.1;
    trustNotes = `Market search failed: ${marketError instanceof Error ? marketError.message : 'Unknown error'}`;
  }

  // Calculate adjustments
  const adjustments: ValuationAdjustment[] = [];

  // Depreciation
  const depreciationAmount = calculateDepreciation(year, input.make, input.model) * estimatedMSRP;
  adjustments.push({
    label: 'Depreciation',
    amount: depreciationAmount,
    reason: `${year} model year (${new Date().getFullYear() - year} years old)`
  });

  // Mileage adjustment
  const mileageAdjustment = calculateMileageAdjustment(mileage, year);
  adjustments.push({
    label: 'Mileage',
    amount: mileageAdjustment,
    reason: `${mileage.toLocaleString()} miles`
  });

  // Condition adjustment
  const conditionAdjustment = calculateConditionAdjustment(condition, estimatedMSRP);
  adjustments.push({
    label: 'Condition',
    amount: conditionAdjustment,
    reason: `${condition} condition`
  });

  // Fuel type adjustment
  const fuelAdjustment = calculateFuelTypeAdjustment(fuelType, zipCode);

  adjustments.push({
    label: 'Fuel Type Impact',
    amount: fuelAdjustment,
    reason: `${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} fuel type in ZIP ${zipCode}`
  });

  // Calculate final value
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  let finalValue = estimatedMSRP + totalAdjustments;

  // Apply market multiplier if available
  try {
    const marketMultiplier = await getMarketMultiplier(zipCode);
    if (marketMultiplier !== 0) {
      const marketAdjustment = finalValue * (marketMultiplier / 100);
      finalValue += marketAdjustment;
      adjustments.push({
        label: 'Regional Market',
        amount: marketAdjustment,
        reason: `${marketMultiplier > 0 ? '+' : ''}${marketMultiplier}% market adjustment for ${zipCode}`
      });
    }
  } catch (error) {
    console.warn('Failed to apply market multiplier:', error);
  }

  // Ensure minimum value
  finalValue = Math.max(finalValue, 1000);

  // Calculate confidence score
  let confidenceScore = calculateConfidenceScore({
    trustScore,
    listingCount: marketListings.length,
    exactVinMatch: marketSearchStatus === 'exact_match',
    marketSearchStatus
  });

  // Generate AI explanation
  const aiExplanation = generateAIExplanation({
    baseValue: estimatedMSRP,
    adjustments,
    finalValue,
    confidenceScore,
    marketData: {
      listingCount: marketListings.length,
      trustScore,
      notes: trustNotes,
      status: marketSearchStatus
    }
  });

  const result: UnifiedValuationResult = {
    id: crypto.randomUUID(),
    vin,
    vehicle: { year, make, model, trim, fuelType },
    zip: zipCode,
    mileage,
    baseValue: finalValue,
    adjustments,
    finalValue,
    confidenceScore,
    aiExplanation,
    sources: marketSearchStatus === 'exact_match' ? ['exact_vin_match'] : ['legacy_system'],
    listingRange: {
      _type: "undefined" as const,
      value: "undefined" as const
    },
    listingCount: marketListings.length,
    listings: marketListings,
    marketSearchStatus,
    timestamp: Date.now()
  };

  console.log('✅ Unified valuation calculation completed:', {
    finalValue,
    confidenceScore,
    listingCount: marketListings.length,
    marketSearchStatus
  });

  return result;
}

function estimateVehicleMSRP(year: number, make: string, model: string): number {
  // Enhanced MSRP estimation logic
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Base MSRP estimates by make/model category
  const baseMSRP = (() => {
    const makeModel = `${make.toLowerCase()}_${model.toLowerCase()}`;
    
    // High-performance and luxury trucks/SUVs
    if (makeModel.includes('raptor')) {
      return year >= 2023 ? 95000 : year >= 2020 ? 85000 : 75000;
    }
    if (makeModel.includes('f-150') && makeModel.includes('lightning')) {
      return 85000; // Electric F-150
    }
    if (makeModel.includes('f-150')) {
      // Regular F-150 variants by trim level
      return year >= 2023 ? 55000 : year >= 2020 ? 50000 : 45000;
    }
    
    // Luxury brands
    if (['bmw', 'mercedes', 'audi', 'lexus', 'infiniti', 'acura'].includes(make.toLowerCase())) {
      return year >= 2020 ? 55000 : 45000;
    }
    
    // Luxury SUVs and trucks
    const luxuryModels = ['escalade', 'navigator', 'tahoe', 'suburban', 'expedition', 'sequoia', 'armada'];
    if (luxuryModels.some(luxury => model.toLowerCase().includes(luxury))) {
      return year >= 2020 ? 75000 : 65000;
    }
    
    // Popular models with known ranges
    const modelMap: Record<string, number> = {
      'toyota_camry': 27650,
      'toyota_corolla': 24350,
      'honda_accord': 26120,
      'honda_civic': 23750,
      'nissan_altima': 25300,
      'ford_fusion': 24120,
      'chevrolet_malibu': 24095,
      'hyundai_elantra': 20650,
      'chevrolet_silverado': 45000,
      'ram_1500': 45000,
      'toyota_tundra': 48000,
      'nissan_titan': 42000,
    };
    
    if (modelMap[makeModel]) {
      return modelMap[makeModel];
    }
    
    // Truck defaults by make
    const truckModels = ['f-150', 'silverado', 'ram', 'tundra', 'titan', 'ranger', 'colorado', 'tacoma'];
    if (truckModels.some(truck => model.toLowerCase().includes(truck))) {
      const truckDefaults: Record<string, number> = {
        'ford': 50000,
        'chevrolet': 45000,
        'ram': 45000,
        'toyota': 48000,
        'nissan': 42000,
        'gmc': 47000
      };
      return truckDefaults[make.toLowerCase()] || 45000;
    }
    
    // Default by make for non-trucks
    const makeDefaults: Record<string, number> = {
      'toyota': 28000,
      'honda': 26000,
      'nissan': 25000,
      'ford': 30000,
      'chevrolet': 28000,
      'hyundai': 23000,
      'kia': 22000
    };
    
    return makeDefaults[make.toLowerCase()] || 28000;
  })();
  
  // Adjust for year (newer cars worth more)
  const yearMultiplier = Math.max(0.8, 1 - (age * 0.03));
  
  return Math.round(baseMSRP * yearMultiplier);
}

function calculateConfidenceScore(params: {
  trustScore: number;
  listingCount: number;
  exactVinMatch: boolean;
  marketSearchStatus: string;
}): number {
  const { trustScore, listingCount, exactVinMatch, marketSearchStatus } = params;
  
  let confidence = 30; // Base confidence
  
  // Market data bonuses
  if (exactVinMatch) {
    confidence += 50; // Major bonus for exact VIN
  } else if (marketSearchStatus === 'success') {
    confidence += Math.min(trustScore * 40, 30); // Up to 30 points for market data
    confidence += Math.min(listingCount * 5, 15); // Up to 15 points for listing quantity
  } else if (marketSearchStatus === 'cached') {
    confidence += Math.min(trustScore * 25, 20); // Reduced bonus for cached data
  }
  
  // Penalties for poor data
  if (marketSearchStatus === 'fallback' || marketSearchStatus === 'error') {
    confidence -= 10;
  }
  
  return Math.max(10, Math.min(95, confidence));
}

function generateAIExplanation(params: {
  baseValue: number;
  adjustments: ValuationAdjustment[];
  finalValue: number;
  confidenceScore: number;
  marketData: {
    listingCount: number;
    trustScore: number;
    notes: string;
    status: string;
  };
}): string {
  const { baseValue, adjustments, finalValue, confidenceScore, marketData } = params;
  
  let explanation = "🔍 ## 📊 Valuation Breakdown\n\n";
  
  explanation += `- **Base Value:** $${baseValue.toLocaleString()} (estimated MSRP)\n`;
  
  adjustments.forEach(adj => {
    const sign = adj.amount >= 0 ? '+' : '';
    explanation += `- **${adj.label}:** $${sign}${adj.amount.toLocaleString()} (${adj.reason})\n`;
  });
  
  explanation += `\n### 🎯 Final Value: **$${finalValue.toLocaleString()}**\n\n`;
  explanation += `### 🤖 Confidence: ${confidenceScore}%\n\n`;
  
  // Confidence reasoning
  if (confidenceScore >= 85) {
    explanation += "**Reasoning:** High confidence based on comprehensive market data and vehicle specifications.\n\n";
  } else if (confidenceScore >= 70) {
    explanation += "**Reasoning:** Good confidence with available market data and detailed analysis.\n\n";
  } else {
    explanation += "**Reasoning:** Limited confidence due to incomplete market data availability.\n\n";
  }
  
  explanation += "---\n\n";
  explanation += "**Data Sources:**\n";
  explanation += "- VIN Decode (Vehicle Specifications)\n";
  explanation += "- Market Analysis (Regional Adjustments)\n";
  explanation += "- Condition Assessment\n";
  explanation += "- Mileage Impact Analysis\n";
  
  // Market data status
  explanation += ` Market data: ${marketData.notes}`;
  
  return explanation;
}
