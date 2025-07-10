// Unified Valuation Engine - Phase 1 Implementation
import { supabase } from "@/integrations/supabase/client";
import { decodeVin } from "@/services/vehicleDecodeService";
import { getFuelCostAdjustment, getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment } from "@/services/adjustmentHelpers";
import { generateAIExplanation } from "@/services/aiExplanationService";
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { logValuationAudit, logValuationError } from "@/utils/valuationAuditLogger";
import type { DecodedVehicleInfo } from "@/types/vehicle";

// Unified input interface
export interface ValuationInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
}

// Unified result interface
export interface ValuationResult {
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    fuelType?: string;
    msrp?: number;
  };
  zip: string;
  mileage: number;
  baseValue: number;
  adjustments: Array<{
    label: string;
    amount: number;
    reason: string;
  }>;
  finalValue: number;
  confidenceScore: number;
  aiExplanation: string;
  sources: string[];
  listingRange?: { min: number; max: number };
  listingCount: number;
  listings: any[];
  marketSearchStatus: "success" | "fallback" | "error";
  timestamp: number;
}

/**
 * Main valuation processing function - Phase 1 Implementation
 */
export async function processValuation(input: ValuationInput): Promise<ValuationResult> {
  try {
    console.log('🚀 Starting unified valuation process:', input);
    
    const { vin, zipCode, mileage, condition } = input;
    
    // Step 1: Decode VIN
    const decoded = await decodeVin(vin);
    
    // Extract vehicle data from decoded response
    const vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
    const vehicleYear = vehicleData.year || 2020;
    const vehicleMake = vehicleData.make || 'Unknown';
    const vehicleModel = vehicleData.model || 'Unknown';
    const vehicleTrim = vehicleData.trim || '';
    const vehicleFuelType = vehicleData.fuelType || 'gasoline';
    
    console.log('✅ VIN decoded:', { make: vehicleMake, model: vehicleModel, year: vehicleYear });
    
    // Step 2: Establish base value
    const baseValue = 30000; // Use standard base value since MSRP not in decode response
    const adjustments: ValuationResult["adjustments"] = [];
    let finalValue = baseValue;
    const sources = ["estimated_msrp"];
    let marketSearchStatus: "success" | "fallback" | "error" = "fallback";
    
    // Step 3: Apply depreciation adjustment
    const depreciation = getDepreciationAdjustment(vehicleYear);
    finalValue += depreciation;
    adjustments.push({ 
      label: "Depreciation", 
      amount: depreciation, 
      reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)` 
    });
    
    // Step 4: Apply mileage adjustment
    const mileageAdj = getMileageAdjustment(mileage);
    finalValue += mileageAdj;
    adjustments.push({ 
      label: "Mileage", 
      amount: mileageAdj, 
      reason: `${mileage.toLocaleString()} miles` 
    });
    
    // Step 5: Apply condition adjustment
    const conditionAdj = getConditionAdjustment(condition);
    finalValue += conditionAdj;
    adjustments.push({ 
      label: "Condition", 
      amount: conditionAdj, 
      reason: `${condition} condition` 
    });
    
    // Step 6: Apply fuel cost adjustment (regional)
    const fuelType = vehicleFuelType;
    const fuelAdj = await getFuelCostAdjustment(fuelType, zipCode);
    finalValue += fuelAdj;
    adjustments.push({ 
      label: "Fuel Type Impact", 
      amount: fuelAdj, 
      reason: `${fuelType} fuel type in ZIP ${zipCode}` 
    });
    sources.push("eia_fuel_costs");
    
    // Step 7: Market listings integration with fallback
    let listings: any[] = [];
    let listingRange: { min: number; max: number } | undefined;
    
    try {
      const marketResult = await fetchMarketComps({
        year: vehicleYear,
        make: vehicleMake,
        model: vehicleModel,
        trim: vehicleTrim,
        zipCode,
        mileage,
        vin
      });
      
      if (marketResult.listings && marketResult.listings.length > 0) {
        listings = marketResult.listings;
        const prices = listings.map(l => l.price).filter(p => p > 0);
        
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          
          const marketAdj = avg - finalValue;
          finalValue = avg;
          adjustments.push({ 
            label: "Market Anchoring", 
            amount: marketAdj, 
            reason: `Based on ${prices.length} comparable listings` 
          });
          listingRange = { min, max };
          sources.push("openai_market_search");
          marketSearchStatus = "success";
        } else {
          marketSearchStatus = "fallback";
        }
      } else {
        marketSearchStatus = "fallback";
      }
    } catch (e) {
      console.error("Market search error:", e);
      marketSearchStatus = "error";
    }
    
    // Step 8: Calculate confidence score
    let confidenceScore = 55;
    if (vehicleMake !== 'Unknown' && vehicleModel !== 'Unknown' && vehicleYear > 1900) confidenceScore += 10;
    if (marketSearchStatus === "success") confidenceScore += 10;
    if (mileage > 0) confidenceScore += 5;
    if (condition && condition !== 'unknown') confidenceScore += 5;
    
    // Ensure final value is reasonable
    finalValue = Math.max(3000, Math.round(finalValue));
    
    // Step 9: Generate AI explanation
    const explanation = await generateAIExplanation({
      baseValue,
      adjustments,
      finalValue,
      vehicle: {
        year: vehicleYear,
        make: vehicleMake,
        model: vehicleModel,
        trim: vehicleTrim,
        fuelType: vehicleFuelType
      },
      zip: zipCode,
      mileage,
      listings,
      confidenceScore
    });
    
    // Step 10: Log audit trail
    await logValuationAudit("COMPLETE", { 
      vin, 
      zipCode, 
      finalValue, 
      confidenceScore, 
      marketSearchStatus,
      sources,
      adjustmentCount: adjustments.length
    });
    
    const result: ValuationResult = {
      vehicle: {
        year: vehicleYear,
        make: vehicleMake,
        model: vehicleModel,
        trim: vehicleTrim,
        fuelType: vehicleFuelType
      },
      zip: zipCode,
      mileage,
      baseValue,
      adjustments,
      finalValue,
      confidenceScore,
      aiExplanation: explanation,
      sources,
      listingRange,
      listingCount: listings.length,
      listings,
      marketSearchStatus,
      timestamp: Date.now()
    };
    
    console.log('✅ Valuation complete:', { finalValue, confidenceScore, adjustmentCount: adjustments.length });
    return result;
    
  } catch (error) {
    console.error('❌ Valuation engine error:', error);
    await logValuationError(error as Error, input);
    throw error;
  }
}

/**
 * Legacy compatibility function
 */
export async function calculateFinalValuation(input: any): Promise<any> {
  // Convert legacy input to unified format
  const unifiedInput: ValuationInput = {
    vin: input.vin || '',
    zipCode: input.zipCode || '90210',
    mileage: input.mileage || 50000,
    condition: input.condition || 'good'
  };
  
  return await processValuation(unifiedInput);
}