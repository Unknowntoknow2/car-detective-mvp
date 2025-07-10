// Unified Valuation Engine with Real-Time Progress Tracking
import { supabase } from "@/integrations/supabase/client";
import { decodeVin } from "@/services/vehicleDecodeService";
import { getFuelCostAdjustment, getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment } from "@/services/adjustmentHelpers";
import { generateAIExplanation } from "@/services/aiExplanationService";
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { logValuationAudit, logValuationError } from "@/utils/valuationAuditLogger";
import { ValuationProgressTracker } from "@/utils/valuation/progressTracker";
import type { DecodedVehicleInfo } from "@/types/vehicle";

// Unified input interface
export interface ValuationInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  userId?: string;
  isPremium?: boolean;
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
  // Sharing and premium features
  shareLink?: string;
  qrCode?: string;
  isPremium?: boolean;
  vin?: string;
}

/**
 * Main valuation processing function - Phase 1 Implementation
 */
export async function processValuation(
  input: ValuationInput, 
  progressTracker?: ValuationProgressTracker
): Promise<ValuationResult> {
  try {
    console.log('🚀 Starting unified valuation process:', input);
    
    const { vin, zipCode, mileage, condition } = input;
    
    // Initialize progress tracking
    const tracker = progressTracker || new ValuationProgressTracker();
    
    // Step 1: Decode VIN (5% Progress)
    tracker.startStep('vin_decode', { vin });
    const decoded = await decodeVin(vin);
    
    // Extract vehicle data from decoded response
    const vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
    const vehicleYear = vehicleData.year || 2020;
    const vehicleMake = vehicleData.make || 'Unknown';
    const vehicleModel = vehicleData.model || 'Unknown';
    const vehicleTrim = vehicleData.trim || '';
    const vehicleFuelType = vehicleData.fuelType || 'gasoline';
    
    tracker.completeStep('vin_decode', { vehicle: vehicleData });
    console.log('✅ VIN decoded:', { make: vehicleMake, model: vehicleModel, year: vehicleYear });
    
    // Step 2: Establish base value
    const baseValue = 30000; // Use standard base value since MSRP not in decode response
    const adjustments: ValuationResult["adjustments"] = [];
    let finalValue = baseValue;
    const sources = ["estimated_msrp"];
    let marketSearchStatus: "success" | "fallback" | "error" = "fallback";
    
    // Step 2: Apply depreciation adjustment (10% Progress)
    tracker.startStep('depreciation', { year: vehicleYear, baseValue });
    const depreciation = getDepreciationAdjustment(vehicleYear);
    finalValue += depreciation;
    adjustments.push({ 
      label: "Depreciation", 
      amount: depreciation, 
      reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)` 
    });
    tracker.completeStep('depreciation', { adjustment: depreciation });
    
    // Step 3: Apply mileage adjustment (15% Progress)
    tracker.startStep('mileage', { mileage, baseValue });
    const mileageAdj = getMileageAdjustment(mileage);
    finalValue += mileageAdj;
    adjustments.push({ 
      label: "Mileage", 
      amount: mileageAdj, 
      reason: `${mileage.toLocaleString()} miles` 
    });
    tracker.completeStep('mileage', { adjustment: mileageAdj });
    
    // Step 4: Apply condition adjustment (15% Progress)  
    tracker.startStep('condition', { condition });
    const conditionAdj = getConditionAdjustment(condition);
    finalValue += conditionAdj;
    adjustments.push({ 
      label: "Condition", 
      amount: conditionAdj, 
      reason: `${condition} condition` 
    });
    tracker.completeStep('condition', { adjustment: conditionAdj });
    
    // Step 5: Apply fuel cost adjustment (15% Progress)
    tracker.startStep('fuel_cost', { fuelType: vehicleFuelType, zipCode });
    const fuelType = vehicleFuelType;
    const fuelAdj = await getFuelCostAdjustment(fuelType, zipCode);
    finalValue += fuelAdj;
    adjustments.push({ 
      label: "Fuel Type Impact", 
      amount: fuelAdj, 
      reason: `${fuelType} fuel type in ZIP ${zipCode}` 
    });
    sources.push("eia_fuel_costs");
    tracker.completeStep('fuel_cost', { adjustment: fuelAdj });
    
    // Step 6: Market listings integration (15% Progress)
    tracker.startStep('market_search', { year: vehicleYear, make: vehicleMake, model: vehicleModel });
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
          tracker.completeStep('market_search', { listingCount: prices.length, avgPrice: avg });
        } else {
          marketSearchStatus = "fallback";
          tracker.completeStep('market_search', { error: "No valid prices found" });
        }
      } else {
        marketSearchStatus = "fallback";
        tracker.completeStep('market_search', { error: "No listings found" });
      }
    } catch (e) {
      console.error("Market search error:", e);
      marketSearchStatus = "error";
      tracker.errorStep('market_search', e instanceof Error ? e.message : 'Unknown error');
    }
    
    // Step 7: Calculate confidence score (10% Progress)
    tracker.startStep('confidence_calc', { marketStatus: marketSearchStatus });
    let confidenceScore = 55;
    if (vehicleMake !== 'Unknown' && vehicleModel !== 'Unknown' && vehicleYear > 1900) confidenceScore += 10;
    if (marketSearchStatus === "success") confidenceScore += 10;
    if (mileage > 0) confidenceScore += 5;
    if (condition && condition !== 'unknown') confidenceScore += 5;
    
    // Ensure final value is reasonable
    finalValue = Math.max(3000, Math.round(finalValue));
    tracker.completeStep('confidence_calc', { score: confidenceScore });
    
    // Step 8: Generate AI explanation (10% Progress)
    tracker.startStep('ai_explanation', { finalValue, confidenceScore });
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
    tracker.completeStep('ai_explanation', { explanation });
    
    // Step 9: Log audit trail (5% Progress)
    tracker.startStep('audit_log', { finalValue, confidenceScore });
    await logValuationAudit("COMPLETE", { 
      vin, 
      zipCode, 
      finalValue, 
      confidenceScore, 
      marketSearchStatus,
      sources,
      adjustmentCount: adjustments.length
    });
    tracker.completeStep('audit_log', { success: true });
    
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