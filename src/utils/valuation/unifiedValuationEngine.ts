// ⚠️ DEPRECATED: DO NOT USE IN PRODUCTION
// This file is retained for test/development purposes only
// Use src/services/valuationEngine.ts for all production valuation logic
// Unified Valuation Engine with Real-Time Progress Tracking
import { supabase } from "@/integrations/supabase/client";
import { decodeVin } from "@/services/vehicleDecodeService";
import { getFuelCostAdjustment, getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment } from "@/services/adjustmentHelpers";
import { generateAIExplanation } from "@/services/aiExplanationService";
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { logValuationAudit, logValuationError, logValuationStep, logAdjustmentStep } from "@/utils/valuationAuditLogger";
import { createValuationRequest, completeValuationRequest, failValuationRequest } from "@/services/supabase/valuationRequestTracker";
import { ValuationProgressTracker } from "@/utils/valuation/progressTracker";
import { getDynamicMSRP } from "@/services/valuation/msrpLookupService";
import { calculateAdvancedConfidence, getConfidenceBreakdown } from "@/services/valuation/confidenceEngine";
import { saveMarketListings } from "@/services/valuation/marketListingService";
import { saveValuationExplanation } from "@/services/supabase/explanationService";
import { generateQRCode } from "@/utils/qrCodeGenerator";
import { getPackageAdjustments } from "@/utils/adjustments/packageAdjustments";
import { generateEmergencyFallbackValue, trackValuationFallback } from "@/utils/valuation/emergencyFallbackUtils";
import { estimateFallbackValue, type FallbackValuationResult } from "@/utils/valuation/fallbackEstimator";
// import { generateConfidenceExplanation } from "@/utils/valuation/confidenceExplainer";
import type { DecodedVehicleInfo } from "@/types/vehicle";

// Unified input interface
export interface ValuationInput {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  userId?: string;
  isPremium?: boolean;
  forceNew?: boolean;
}

// Unified result interface
export interface ValuationResult {
  id?: string; // Add valuation ID for forecast integration
  vin: string;
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
  pdfUrl?: string;
  isPremium?: boolean;
  progressStep?: number;
}

/**
 * Main valuation processing function - Phase 1 Implementation
 */
export async function processValuation(
  input: ValuationInput, 
  progressTracker?: ValuationProgressTracker
): Promise<ValuationResult> {
  const { vin, zipCode, mileage, condition, userId, isPremium: inputPremium } = input;
  
  // FIX #3: Validate actual user subscription status instead of trusting input
  let isPremium = inputPremium || false;
  if (userId) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('is_premium_dealer, premium_expires_at, role')
        .eq('id', userId)
        .single();
      
      if (userProfile) {
        isPremium = Boolean(
          userProfile.is_premium_dealer ||
          ['admin', 'dealer'].includes(userProfile.role || '') ||
          (userProfile.premium_expires_at && new Date(userProfile.premium_expires_at) > new Date())
        );
      }
    } catch (error) {
      console.error('⚠️ Could not validate premium status, using input:', error);
    }
  }
  
  // Declare valuationRequest outside try block to access in catch
  let valuationRequest: any = null;
  
  try {
    console.log('🚀 Starting unified valuation process:', input);
    
    // Initialize progress tracking
    const tracker = progressTracker || new ValuationProgressTracker();
    
    // Step 1: FIX #2 - Enhanced VIN Decode with Fallbacks
    tracker.startStep('vin_decode', { vin });
    let decoded: any = null;
    let vehicleData: DecodedVehicleInfo = {} as DecodedVehicleInfo;
    
    try {
      decoded = await decodeVin(vin);
      vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
    } catch (vinDecodeError) {
      console.warn('⚠️ VIN decode failed, using cached data fallback:', vinDecodeError);
      
      // FIX #3: Try to get cached vehicle data from database as fallback
      try {
        const { data: cachedVehicle } = await supabase
          .from('decoded_vehicles')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();
        
        if (cachedVehicle) {
          console.log('✅ Using cached vehicle data from database');
          vehicleData = {
            vin: cachedVehicle.vin,
            year: cachedVehicle.year,
            make: cachedVehicle.make,
            model: cachedVehicle.model,
            trim: cachedVehicle.trim,
            fuelType: cachedVehicle.fueltype,
            transmission: cachedVehicle.transmission,
            bodyType: cachedVehicle.bodytype,
            engine: cachedVehicle.engine
          } as DecodedVehicleInfo;
        }
      } catch (cacheError) {
        console.warn('⚠️ Cache lookup also failed:', cacheError);
      }
    }
    
    // FIX #4: Extract with robust fallbacks
    const vehicleYear = vehicleData.year || 2020;
    const vehicleMake = vehicleData.make || 'Unknown';
    const vehicleModel = vehicleData.model || 'Unknown';
    const vehicleTrim = vehicleData.trim || '';
    const vehicleFuelType = vehicleData.fuelType || 'gasoline';
    
    // FIX #1: Create valuation request AFTER decoding VIN with complete vehicle data
    try {
      valuationRequest = await createValuationRequest({
        vin,
        zipCode,
        mileage,
        userId: userId || undefined,
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        additionalData: { condition, isPremium: isPremium || false }
      });

      if (!valuationRequest) {
        throw new Error('Failed to create valuation request - database constraint error');
      }
    } catch (dbError) {
      console.error('❌ Database constraint error creating valuation request:', dbError);
      // FIX #7: Create a fallback ID to continue processing
      valuationRequest = {
        id: `fallback_${Date.now()}`,
        vin,
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      console.log('⚠️ Using fallback valuation request ID for processing:', valuationRequest.id);
    }
    
    // Step 1: VIN Decoding (10% Progress)
    await logValuationStep('VIN_DECODE_START', vin, valuationRequest.id, { zipCode, mileage, condition }, userId, zipCode);
    
    tracker.completeStep('vin_decode', { vehicle: vehicleData });
    await logValuationStep('VIN_DECODE_COMPLETE', vin, valuationRequest.id, { make: vehicleMake, model: vehicleModel, year: vehicleYear }, userId, zipCode);
    console.log('✅ VIN decoded and valuation request created:', { make: vehicleMake, model: vehicleModel, year: vehicleYear, requestId: valuationRequest.id });
    
    // Step 2: FIX #4 - Dynamic MSRP Lookup with PROPER INTEGRATION
    console.log(`🔍 [MSRP DEBUG] Calling getDynamicMSRP for: ${vehicleYear} ${vehicleMake} ${vehicleModel} ${vehicleTrim || 'no trim'}`);
    const baseValue = await getDynamicMSRP(vehicleYear, vehicleMake, vehicleModel, vehicleTrim);
    console.log(`🔍 [MSRP DEBUG] Result from getDynamicMSRP: $${baseValue.toLocaleString()}`);
    
    const adjustments: ValuationResult["adjustments"] = [];
    let finalValue = baseValue; // CRITICAL FIX: Use the actual MSRP result as starting value
    const sources = baseValue > 30000 ? ["msrp_db_lookup"] : ["estimated_msrp"];
    let marketSearchStatus: "success" | "fallback" | "error" = "fallback";
    
    console.log(`🎯 [PIPELINE DEBUG] Starting valuation with baseValue: $${baseValue.toLocaleString()}, source: ${sources[0]}`);
    
    // Track if we're using database MSRP vs estimate for confidence
    const usingDatabaseMSRP = baseValue > 30000;
    
    // Step 2: Apply depreciation adjustment (10% Progress)
    tracker.startStep('depreciation', { year: vehicleYear, baseValue });
    const depreciation = getDepreciationAdjustment(vehicleYear, vehicleMake, vehicleFuelType);
    const afterDepreciation = finalValue + depreciation;
    adjustments.push({ 
      label: "Depreciation", 
      amount: depreciation, 
      reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)` 
    });
    
    // Enhanced audit logging with metadata
    await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
      label: "Depreciation",
      amount: depreciation,
      reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)`,
      baseValue: finalValue,
      newValue: afterDepreciation
    }, userId, zipCode);
    
    finalValue = afterDepreciation;
    tracker.completeStep('depreciation', { adjustment: depreciation });
    await logValuationStep('DEPRECIATION_APPLIED', vin, valuationRequest?.id || 'fallback', { amount: depreciation, vehicleYear, baseValue: finalValue - depreciation, newValue: finalValue }, userId, zipCode);
    
    // Step 3: Apply mileage adjustment (15% Progress)
    tracker.startStep('mileage', { mileage, baseValue: finalValue });
    const mileageAdj = getMileageAdjustment(mileage);
    const afterMileage = finalValue + mileageAdj;
    adjustments.push({ 
      label: "Mileage", 
      amount: mileageAdj, 
      reason: `${mileage.toLocaleString()} miles` 
    });
    
    // Enhanced audit logging with metadata
    await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
      label: "Mileage",
      amount: mileageAdj,
      reason: `${mileage.toLocaleString()} miles`,
      baseValue: finalValue,
      newValue: afterMileage
    }, userId, zipCode);
    
    finalValue = afterMileage;
    tracker.completeStep('mileage', { adjustment: mileageAdj });
    await logValuationStep('MILEAGE_ADJUSTMENT', vin, valuationRequest?.id || 'fallback', { amount: mileageAdj, mileage, baseValue: finalValue - mileageAdj, newValue: finalValue }, userId, zipCode);
    
    // Step 4: Apply condition adjustment (15% Progress)  
    tracker.startStep('condition', { condition });
    const conditionAdj = getConditionAdjustment(condition);
    const afterCondition = finalValue + conditionAdj;
    adjustments.push({ 
      label: "Condition", 
      amount: conditionAdj, 
      reason: `${condition} condition` 
    });
    
    // Enhanced audit logging with metadata
    await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
      label: "Condition",
      amount: conditionAdj,
      reason: `${condition} condition`,
      baseValue: finalValue,
      newValue: afterCondition
    }, userId, zipCode);
    
    finalValue = afterCondition;
    tracker.completeStep('condition', { adjustment: conditionAdj });
    await logValuationStep('CONDITION_APPLIED', vin, valuationRequest?.id || 'fallback', { amount: conditionAdj, condition, baseValue: finalValue - conditionAdj, newValue: finalValue }, userId, zipCode);
    
    // Step 5: Apply fuel cost adjustment (15% Progress)
    tracker.startStep('fuel_cost', { fuelType: vehicleFuelType, zipCode });
    const fuelType = vehicleFuelType;
    const fuelAdj = await getFuelCostAdjustment(fuelType, zipCode);
    const afterFuel = finalValue + fuelAdj;
    adjustments.push({ 
      label: "Fuel Type Impact", 
      amount: fuelAdj, 
      reason: `${fuelType} fuel type in ZIP ${zipCode}` 
    });
    
    // Enhanced audit logging with metadata
    await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
      label: "Fuel Type Impact",
      amount: fuelAdj,
      reason: `${fuelType} fuel type in ZIP ${zipCode}`,
      baseValue: finalValue,
      newValue: afterFuel
    }, userId, zipCode);
    
    finalValue = afterFuel;
    sources.push("eia_fuel_costs");
    tracker.completeStep('fuel_cost', { adjustment: fuelAdj });
    await logValuationStep('FUEL_PRICING_FETCHED', vin, valuationRequest?.id || 'fallback', { amount: fuelAdj, fuelType: vehicleFuelType, baseValue: finalValue - fuelAdj, newValue: finalValue }, userId, zipCode);
    
    // Step 5.5: Apply package/feature adjustments
    tracker.startStep('package_adjustments', { make: vehicleMake, model: vehicleModel, trim: vehicleTrim });
    const packageAdjustments = getPackageAdjustments(vehicleMake, vehicleModel, vehicleTrim);
    let totalPackageValue = 0;
    
    for (const pkg of packageAdjustments) {
      totalPackageValue += pkg.value;
      adjustments.push({
        label: `Package: ${pkg.name}`,
        amount: pkg.value,
        reason: pkg.description
      });
      
      await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
        label: `Package: ${pkg.name}`,
        amount: pkg.value,
        reason: pkg.description,
        baseValue: finalValue,
        newValue: finalValue + pkg.value
      }, userId, zipCode);
    }
    
    finalValue += totalPackageValue;
    if (totalPackageValue > 0) {
      sources.push("package_detection");
    }
    tracker.completeStep('package_adjustments', { totalValue: totalPackageValue, packageCount: packageAdjustments.length });
    await logValuationStep('PACKAGE_ADJUSTMENTS', vin, valuationRequest?.id || 'fallback', { totalValue: totalPackageValue, packages: packageAdjustments.length }, userId, zipCode);
    
    // Step 6: Market listings integration (15% Progress) - CRITICAL FIX
    tracker.startStep('market_search', { year: vehicleYear, make: vehicleMake, model: vehicleModel });
    let listings: any[] = [];
    let listingRange: { min: number; max: number } | undefined;
    
    console.log(`🔍 [MARKET DEBUG] Starting market search with parameters:`, {
      year: vehicleYear,
      make: vehicleMake,
      model: vehicleModel,
      trim: vehicleTrim,
      zipCode,
      mileage,
      vin
    });
    
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
      
      console.log(`🔍 [MARKET DEBUG] Market search completed:`, {
        listingsCount: marketResult.listings?.length || 0,
        trust: marketResult.trust,
        source: marketResult.source,
        notes: marketResult.notes
      });
      
      if (marketResult.listings && marketResult.listings.length > 0) {
        listings = marketResult.listings;
        
        // FIX #2: Persist market listings to database for analytics and reuse
        const persistResult = await saveMarketListings(listings, {
          vin,
          userId,
          valuationId: valuationRequest?.id,
          valuationRequestId: valuationRequest?.id,
          zipCode
        });
        
        if (persistResult.success) {
          console.log(`✅ Persisted ${persistResult.savedCount} market listings to database`);
          sources.push("market_listings_database");
        } else {
          console.error('❌ Failed to save market listings:', persistResult.errors);
          // Continue with valuation - don't fail if database save fails
        }
        
        const prices = listings.map(l => l.price).filter(p => p > 0);
        
        // PHASE 1 FIX: Only process real market data
        const realListings = listings.filter(l => l.source_type !== 'estimated' && l.source !== 'Market Estimate');
        const realPrices = realListings.map(l => l.price).filter(p => p > 0);
        
        console.log('📊 Market Data Analysis:', {
          totalListings: listings.length,
          realListings: realListings.length,
          syntheticListings: listings.length - realListings.length,
          realPrices: realPrices.length
        });
        
        if (realPrices.length > 0) {
          const min = Math.min(...realPrices);
          const max = Math.max(...realPrices);
          const avg = realPrices.reduce((a, b) => a + b, 0) / realPrices.length;
          
          console.log(`🔍 [MARKET DEBUG] Real market data analysis:`, {
            realListings: realPrices.length,
            priceRange: `$${min.toLocaleString()} - $${max.toLocaleString()}`,
            avgPrice: `$${avg.toLocaleString()}`,
            currentFinalValue: `$${finalValue.toLocaleString()}`
          });
          
          // Check if we found the exact VIN match (highest confidence) - ONLY IN REAL DATA
          const exactVinMatch = realListings.find(l => l.vin === vin);
          
          if (exactVinMatch) {
            console.log(`🎯 [MARKET DEBUG] EXACT VIN MATCH FOUND: $${exactVinMatch.price} from ${exactVinMatch.source}`);
            
            // For exact VIN matches, anchor strongly to the listing price
            const exactPrice = exactVinMatch.price;
            const strongAnchorAdj = (exactPrice - finalValue) * 0.8; // 80% weight to exact match
            
            adjustments.push({ 
              label: "Exact VIN Match", 
              amount: strongAnchorAdj, 
              reason: `Found exact VIN listing at $${exactPrice.toLocaleString()} on ${exactVinMatch.source}` 
            });
            
            finalValue = finalValue + strongAnchorAdj;
            marketSearchStatus = "success";
            
            console.log(`✅ [MARKET DEBUG] Applied exact VIN match adjustment: ${strongAnchorAdj >= 0 ? '+' : ''}$${strongAnchorAdj.toLocaleString()}`);
            
            // Also add confidence boost for exact match (handled in confidence engine)
            sources.push("exact_vin_match");
            
            await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
              label: "Exact VIN Match Anchor",
              amount: strongAnchorAdj,
              reason: `Exact VIN found on ${exactVinMatch.source} at $${exactPrice.toLocaleString()}`,
              baseValue: finalValue - strongAnchorAdj,
              newValue: finalValue
            }, userId, zipCode);
            
          } else if (realPrices.length >= 3) {
            // Only apply market anchoring if we have 3+ REAL listings
            const marketWeight = Math.min(0.4, marketResult.trust); // Cap at 40% influence for non-exact matches
            const marketAdj = (avg - finalValue) * marketWeight;
            const afterMarket = finalValue + marketAdj;
            
            adjustments.push({ 
              label: "Market Anchor", 
              amount: marketAdj, 
              reason: `Adjusted toward ${realPrices.length} comparable listings (avg: $${avg.toLocaleString()}, trust: ${Math.round(marketResult.trust * 100)}%)` 
            });
            
            finalValue = afterMarket;
            marketSearchStatus = "success";
            
            console.log(`✅ [MARKET DEBUG] Applied market anchor based on ${realPrices.length} real listings: ${marketAdj >= 0 ? '+' : ''}$${marketAdj.toLocaleString()}`);
            
            // Enhanced audit logging with metadata
            await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
              label: "Market Anchoring",
              amount: marketAdj,
              reason: `Based on ${realPrices.length} comparable listings (avg: $${avg.toLocaleString()})`,
              baseValue: finalValue - marketAdj,
              newValue: finalValue
            }, userId, zipCode);
          } else {
            console.log(`⚠️ Only ${realPrices.length} real listing(s) found - insufficient for market anchoring`);
          }
          
          listingRange = { min, max };
          sources.push("openai_market_search");
          marketSearchStatus = "success";
          tracker.completeStep('market_search', { listingCount: realPrices.length, avgPrice: avg });
          await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, listingCount: realPrices.length }, userId, zipCode);
        } else {
          console.log('❌ NO REAL MARKET LISTINGS FOUND - using MSRP-only calculation');
          marketSearchStatus = "fallback";
          tracker.completeStep('market_search', { error: "No real market data available" });
          await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, listingCount: 0 }, userId, zipCode);
        }
      } else {
        marketSearchStatus = "fallback";
        tracker.completeStep('market_search', { error: "No listings found" });
        await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, listingCount: 0 }, userId, zipCode);
      }
    } catch (e) {
      console.error("Market search error:", e);
      marketSearchStatus = "error";
      tracker.errorStep('market_search', e instanceof Error ? e.message : 'Unknown error');
      await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, error: e instanceof Error ? e.message : 'Unknown error' }, userId, zipCode);
    }
    
    // Step 7: FIX #5 - Enhanced Confidence Score Calibration v2 - WITH PROPER INPUTS
    tracker.startStep('confidence_calc', { marketStatus: marketSearchStatus });
    
    console.log(`🔍 [CONFIDENCE DEBUG] Calculating confidence with inputs:`, {
      marketSearchStatus,
      listingsCount: listings.length,
      realListingsCount: listings.filter(l => l.source_type !== 'estimated').length,
      usingDatabaseMSRP,
      sources
    });
    
    let confidenceScore = calculateAdvancedConfidence({
      vehicleMake,
      vehicleModel,  
      vehicleYear,
      mileage,
      condition,
      zipCode,
      marketSearchStatus,
      listings,
      listingRange,
      finalValue,
      sources,
      baseValue
    });
    
    console.log(`🔍 [CONFIDENCE DEBUG] Final confidence score: ${confidenceScore}%`);
    
    console.log(`📊 Advanced confidence calculation: ${confidenceScore}% (based on market spread, source count, ZIP match)`);
    
    // Log confidence formula for debugging
    const confidenceBreakdown = getConfidenceBreakdown({
      vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode,
      marketSearchStatus, listings, listingRange, finalValue, sources, baseValue
    });
    console.log('🔍 Confidence breakdown:', confidenceBreakdown);
    
    // CRITICAL FIX: Ensure final value is never $0 and apply emergency fallback if needed
    if (finalValue <= 0 || isNaN(finalValue)) {
      console.error('🚨 CRITICAL: Valuation resulted in $0 or invalid value, applying emergency fallback');
      finalValue = generateEmergencyFallbackValue(vehicleData, mileage, condition);
      confidenceScore = Math.min(confidenceScore, 60); // Lower confidence for emergency fallback
      sources.push('emergency_fallback');
      
      // Track this critical issue
      await logValuationStep('EMERGENCY_FALLBACK_APPLIED', vin, valuationRequest?.id || 'fallback', { 
        originalValue: 0, 
        emergencyValue: finalValue,
        reason: 'zero_or_invalid_valuation' 
      }, userId, zipCode);
    }
    
    // Ensure minimum reasonable value
    finalValue = Math.max(8000, Math.round(finalValue));
    tracker.completeStep('confidence_calc', { score: confidenceScore, spreadAnalysis: listingRange ? (listingRange.max - listingRange.min) / finalValue : null });
    await logValuationStep('CONFIDENCE_COMPUTED', vin, valuationRequest?.id || 'fallback', { confidenceScore, finalValue, listingCount: listings.length, marketSpread: listingRange }, userId, zipCode);
    
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
    await logValuationStep('AI_EXPLANATION_GENERATED', vin, valuationRequest?.id || 'fallback', { explanationLength: explanation.length, finalValue }, userId, zipCode);
    
    // Save AI explanation to database
    if (valuationRequest?.id) {
      try {
        await saveValuationExplanation({
          valuationRequestId: valuationRequest.id,
          explanationMarkdown: explanation,
          adjustmentFactors: {
            depreciation: adjustments.find(a => a.label === 'Depreciation')?.amount || 0,
            mileage: adjustments.find(a => a.label === 'Mileage')?.amount || 0,
            condition: adjustments.find(a => a.label === 'Condition')?.amount || 0,
            fuel: adjustments.find(a => a.label === 'Fuel Type Impact')?.amount || 0,
            market: adjustments.find(a => a.label === 'Market Anchoring')?.amount || 0
          },
          confidenceBreakdown: {
            vinData: baseValue > 30000 ? 25 : 15,
            marketData: marketSearchStatus === 'success' ? 25 : 5,
            fuelData: adjustments.find(a => a.label === 'Fuel Type Impact')?.amount !== 0 ? 15 : 10,
            overall: confidenceScore
          },
          sourceWeights: sources.reduce((acc, source) => {
            acc[source] = 1;
            return acc;
          }, {} as { [key: string]: number }),
          influentialComps: listings.slice(0, 5),
          priceRangeExplanation: listingRange ? 
            `Market range: $${listingRange.min.toLocaleString()} - $${listingRange.max.toLocaleString()}` : 
            undefined
        });
        console.log('✅ AI explanation saved to database');
      } catch (error) {
        console.error('❌ Failed to save explanation to database:', error);
      }
    }
    
    // Step 9: FIX #1 - Enhanced Audit Trail Logging with Complete Metadata
    tracker.startStep('audit_log', { finalValue, confidenceScore });
    
    // Log comprehensive audit with all adjustment details and metadata
    const auditId = await logValuationAudit('VALUATION_COMPLETE', {
      vin,
      zipCode, 
      finalValue,
      confidenceScore,
      baseValue,
      userId,
      adjustments: adjustments.map(a => ({
        label: a.label,
        amount: a.amount,
        reason: a.reason,
        timestamp: new Date().toISOString()
      })),
      sources: sources,
      listingCount: listings.length,
      marketSearchStatus,
      listingRange,
      timestamp: Date.now(),
      // Complete valuation request metadata
      vehicleData: {
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        trim: vehicleTrim,
        fuelType: vehicleFuelType
      },
      processingSteps: {
        vinDecoded: true,
        depreciationApplied: adjustments.find(a => a.label === "Depreciation") !== undefined,
        mileageAdjusted: adjustments.find(a => a.label === "Mileage") !== undefined,
        conditionFactored: adjustments.find(a => a.label === "Condition") !== undefined,
        fuelCostApplied: adjustments.find(a => a.label === "Fuel Type Impact") !== undefined,
        marketDataUsed: marketSearchStatus === "success"
      }
    });
    console.log('✅ Complete audit logged with ID:', auditId);
    
    // Update valuation request status
    if (valuationRequest?.id) {
      await completeValuationRequest(valuationRequest.id, finalValue, confidenceScore, auditId);
    }
    
    tracker.completeStep('audit_log', { success: true, auditId });
    await logValuationStep('AUDIT_SAVED', vin, valuationRequest?.id || 'fallback', { finalValue, confidenceScore, auditId }, userId, zipCode);
    
    // Step 10: Save valuation to database and generate PDF for premium users (5% Progress)
    let pdfUrl: string | undefined;
    let savedValuation: any = null; // Declare savedValuation outside the premium block
    
    // Always save the valuation to database for forecast integration
    try {
      const { data: saveData, error: saveError } = await supabase
        .from('valuations')
        .insert({
          user_id: userId,
          vin,
          make: vehicleMake,
          model: vehicleModel,
          year: vehicleYear,
          mileage,
          condition,
          state: zipCode,
          estimated_value: finalValue,
          confidence_score: confidenceScore,
          base_value: baseValue,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (!saveError && saveData) {
        savedValuation = saveData;
        console.log('✅ Valuation saved to database with ID:', savedValuation.id);
      } else {
        console.error('❌ Failed to save valuation to database:', saveError);
      }
    } catch (error) {
      console.error('❌ Error saving valuation to database:', error);
    }
    
    // Generate PDF only for premium users
    if (isPremium && savedValuation?.id) {
      try {
        tracker.startStep('pdf_generation', { isPremium: true });
        
        // Call the PDF generation edge function
        const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-valuation-pdf', {
          body: { valuationId: savedValuation.id }
        });

        if (!pdfError && pdfData?.url) {
          pdfUrl = pdfData.url;
          
          // Update the valuation record with PDF URL for traceability
          await supabase
            .from('valuations')
            .update({ 
              pdf_url: pdfUrl,
              pdf_generated_at: new Date().toISOString()
            })
            .eq('id', savedValuation.id);
            
          console.log('✅ PDF generated successfully:', pdfUrl);
        } else {
          console.error('❌ PDF generation failed:', pdfError);
        }
        
        tracker.completeStep('pdf_generation', { pdfUrl: !!pdfUrl });
        await logValuationStep('PDF_GENERATED', vin, valuationRequest?.id || 'fallback', { pdfUrl: !!pdfUrl, isPremium: true, finalValue }, userId, zipCode);
      } catch (error) {
        console.error('❌ Error during PDF generation:', error);
        tracker.completeStep('pdf_generation', { error: (error as Error).message });
        await logValuationStep('PDF_GENERATION_FAILED', vin, valuationRequest?.id || 'fallback', { error: (error as Error).message, finalValue }, userId, zipCode);
        // Don't fail the entire valuation if PDF generation fails
      }
    }
    
    const result: ValuationResult = {
      id: savedValuation?.id, // Include the saved valuation ID for forecast integration
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
      timestamp: Date.now(),
      // FIX #4: Generate real share links and QR codes
      shareLink: `${window.location.origin}/shared-valuation/${vin}?t=${Date.now()}`,
      qrCode: await generateQRCode(`${window.location.origin}/shared-valuation/${vin}?t=${Date.now()}`),
      isPremium: isPremium || false,
      vin,
      pdfUrl
    };
    
    // Final step: Log completion
    await logValuationStep('COMPLETE', vin, valuationRequest.id, { 
      finalValue, 
      confidenceScore, 
      adjustmentCount: adjustments.length,
      sources,
      listingCount: listings.length,
      marketSearchStatus
    }, userId, zipCode);
    
    console.log('✅ Valuation complete:', { finalValue, confidenceScore, adjustmentCount: adjustments.length });
    return result;
    
  } catch (error) {
    console.error('❌ Valuation processing failed:', error);
    
    // Mark the valuation request as failed if we created one
    if (valuationRequest?.id) {
      await failValuationRequest(
        valuationRequest.id, 
        error instanceof Error ? error.message : 'Unknown valuation error'
      );
    }
    
    // Log valuation error with details
    await logValuationError(error instanceof Error ? error : new Error('Unknown valuation error'), {
      vin,
      step: 'valuation_processing',
      userId,
      zipCode,
      mileage,
      condition
    });
    
    // Create a more descriptive error message for database issues
    const errorMessage = error instanceof Error ? error.message : 'Unknown valuation error';
    if (errorMessage.includes('null value') || errorMessage.includes('constraint')) {
      throw new Error('Failed to save valuation data - missing required vehicle information. Please try again.');
    }
    
    // Re-throw the error for the caller to handle
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

// Input interface for calculateValuationFromListings
export interface ListingValuationInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  fuelType?: string;
  bodyType?: string;
  baseMsrp?: number;
  marketListings: any[];
  zipCode?: string;
}

// Output interface for calculateValuationFromListings
export interface ListingValuationResult {
  estimated_value: number;
  confidence_score: number;
  explanation: string;
  source: string;
  value_breakdown?: {
    base_value: number;
    market_adjustment: number;
    depreciation: number;
    mileage: number;
    condition: number;
    other_adjustments: number;
  };
  market_analysis?: {
    listing_count: number;
    price_range: [number, number];
    median_price: number;
    average_price: number;
  };
}

/**
 * Calculate valuation from market listings with robust fallback
 * Always returns a positive, reasonable value even when no market listings are available
 */
export async function calculateValuationFromListings(
  input: ListingValuationInput
): Promise<ListingValuationResult> {
  console.log('🔍 Starting calculateValuationFromListings with input:', {
    vin: input.vin,
    year: input.year,
    make: input.make,
    model: input.model,
    listingsCount: input.marketListings?.length || 0
  });

  try {
    // Check if we have sufficient market listings for market-based valuation
    const validListings = (input.marketListings || []).filter(listing => 
      listing && 
      listing.price && 
      typeof listing.price === 'number' && 
      listing.price > 1000 && 
      listing.price < 500000
    );

    console.log(`📊 Valid market listings found: ${validListings.length} out of ${input.marketListings?.length || 0}`);

    // If we have sufficient valid listings (3 or more), use market-based calculation
    if (validListings.length >= 3) {
      console.log('✅ Using market-based valuation with', validListings.length, 'listings');
      return calculateMarketBasedValuation(input, validListings);
    }

    // If insufficient listings, use robust fallback algorithm
    console.log('⚠️ Insufficient market listings, using fallback algorithm');
    return calculateFallbackValuation(input);

  } catch (error) {
    console.error('❌ Error in calculateValuationFromListings:', error);
    
    // Even if there's an error, we must return a value - use emergency fallback
    console.log('🚨 Using emergency fallback due to calculation error');
    return calculateEmergencyFallback(input, error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Calculate valuation based on market listings
 */
function calculateMarketBasedValuation(
  input: ListingValuationInput,
  validListings: any[]
): ListingValuationResult {
  const prices = validListings.map(listing => listing.price).sort((a, b) => a - b);
  const medianPrice = prices[Math.floor(prices.length / 2)];
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Use median as base value (more robust than average)
  let baseValue = medianPrice;

  // Apply adjustments for mileage and condition differences
  const mileageAdjustment = calculateMarketMileageAdjustment(input.mileage, validListings);
  const conditionAdjustment = calculateMarketConditionAdjustment(input.condition, validListings);
  
  const estimatedValue = Math.max(
    Math.round(baseValue + mileageAdjustment + conditionAdjustment),
    5000 // Minimum reasonable value
  );

  // Calculate confidence based on market data quality
  const confidenceScore = calculateMarketConfidence(validListings, prices);

  const explanation = generateMarketExplanation(input, {
    listingCount: validListings.length,
    medianPrice,
    averagePrice,
    priceRange: [minPrice, maxPrice],
    mileageAdjustment,
    conditionAdjustment,
    estimatedValue,
    confidenceScore
  });

  return {
    estimated_value: estimatedValue,
    confidence_score: confidenceScore,
    explanation,
    source: 'market_listings',
    value_breakdown: {
      base_value: baseValue,
      market_adjustment: 0,
      depreciation: 0,
      mileage: mileageAdjustment,
      condition: conditionAdjustment,
      other_adjustments: 0
    },
    market_analysis: {
      listing_count: validListings.length,
      price_range: [minPrice, maxPrice],
      median_price: medianPrice,
      average_price: averagePrice
    }
  };
}

/**
 * Calculate valuation using fallback algorithm when listings are insufficient
 */
function calculateFallbackValuation(input: ListingValuationInput): ListingValuationResult {
  console.log('🔄 Using fallback algorithm for valuation');

  // Use the sophisticated fallback estimator
  const fallbackResult: FallbackValuationResult = estimateFallbackValue({
    year: input.year,
    make: input.make,
    model: input.model,
    trim: input.trim,
    mileage: input.mileage,
    condition: input.condition,
    fuelType: input.fuelType,
    bodyType: input.bodyType,
    baseMsrp: input.baseMsrp
  });

  return {
    estimated_value: fallbackResult.estimated_value,
    confidence_score: fallbackResult.confidence_score,
    explanation: fallbackResult.explanation,
    source: fallbackResult.source,
    value_breakdown: {
      base_value: fallbackResult.value_breakdown.base_value,
      market_adjustment: 0,
      depreciation: fallbackResult.value_breakdown.depreciation,
      mileage: fallbackResult.value_breakdown.mileage,
      condition: fallbackResult.value_breakdown.condition,
      other_adjustments: fallbackResult.value_breakdown.fuel_type + fallbackResult.value_breakdown.regional
    }
  };
}

/**
 * Emergency fallback when all else fails - ensures we always return a value
 */
function calculateEmergencyFallback(input: ListingValuationInput, errorMessage: string): ListingValuationResult {
  console.log('🚨 Using emergency fallback calculation');

  // Use the existing emergency fallback utility
  const emergencyValue = generateEmergencyFallbackValue(
    {
      make: input.make,
      model: input.model,
      year: input.year,
      trim: input.trim,
      fuelType: input.fuelType
    },
    input.mileage,
    input.condition
  );

  // Track the emergency fallback usage
  trackValuationFallback(input.vin, 0, emergencyValue, `Emergency fallback: ${errorMessage}`);

  return {
    estimated_value: emergencyValue,
    confidence_score: 25, // Low confidence for emergency fallback
    explanation: `Emergency valuation estimate of $${emergencyValue.toLocaleString()} for your ${input.year} ${input.make} ${input.model}. ` +
                `This estimate was calculated using basic depreciation models due to insufficient data availability. ` +
                `We recommend seeking additional market data or a professional appraisal for a more accurate valuation.`,
    source: 'emergency_fallback',
    value_breakdown: {
      base_value: emergencyValue,
      market_adjustment: 0,
      depreciation: 0,
      mileage: 0,
      condition: 0,
      other_adjustments: 0
    }
  };
}

/**
 * Calculate mileage adjustment based on market listings
 */
function calculateMarketMileageAdjustment(targetMileage: number, listings: any[]): number {
  const listingsWithMileage = listings.filter(l => l.mileage && typeof l.mileage === 'number');
  
  if (listingsWithMileage.length === 0) {
    return 0;
  }

  const averageMileage = listingsWithMileage.reduce((sum, l) => sum + l.mileage, 0) / listingsWithMileage.length;
  const mileageDifference = targetMileage - averageMileage;
  
  // Rough estimate: $0.15 per mile difference
  return Math.round(mileageDifference * -0.15);
}

/**
 * Calculate condition adjustment based on market listings
 */
function calculateMarketConditionAdjustment(targetCondition: string, listings: any[]): number {
  const conditionValues: Record<string, number> = {
    'excellent': 1.0,
    'very good': 0.9,
    'good': 0.8,
    'fair': 0.6,
    'poor': 0.4
  };

  const targetConditionValue = conditionValues[targetCondition.toLowerCase()] || 0.8;
  
  // If we can't determine market condition distribution, use conservative adjustment
  const baseAdjustmentRate = 0.05; // 5% per condition level difference
  const averageConditionValue = 0.8; // Assume "good" as average
  
  const conditionDifference = targetConditionValue - averageConditionValue;
  
  // Get average price from listings to calculate percentage adjustment
  const averagePrice = listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
  
  return Math.round(averagePrice * conditionDifference * baseAdjustmentRate);
}

/**
 * Calculate confidence score for market-based valuation
 */
function calculateMarketConfidence(listings: any[], prices: number[]): number {
  let confidence = 70; // Start with good confidence for market-based valuation

  // Adjust based on number of listings
  if (listings.length >= 10) {
    confidence += 15;
  } else if (listings.length >= 5) {
    confidence += 10;
  } else if (listings.length >= 3) {
    confidence += 5;
  }

  // Adjust based on price consistency
  const priceRange = Math.max(...prices) - Math.min(...prices);
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const priceVariability = priceRange / averagePrice;

  if (priceVariability < 0.2) {
    confidence += 10; // Prices are very consistent
  } else if (priceVariability > 0.5) {
    confidence -= 10; // Prices are highly variable
  }

  // Ensure confidence is within reasonable bounds
  return Math.max(25, Math.min(95, Math.round(confidence)));
}

/**
 * Generate explanation for market-based valuation
 */
function generateMarketExplanation(
  input: ListingValuationInput,
  analysis: {
    listingCount: number;
    medianPrice: number;
    averagePrice: number;
    priceRange: [number, number];
    mileageAdjustment: number;
    conditionAdjustment: number;
    estimatedValue: number;
    confidenceScore: number;
  }
): string {
  let explanation = `This valuation for your ${input.year} ${input.make} ${input.model} `;
  explanation += `is based on ${analysis.listingCount} current market listings. `;
  
  explanation += `\n\nMarket Analysis:`;
  explanation += `\n• Price Range: $${analysis.priceRange[0].toLocaleString()} - $${analysis.priceRange[1].toLocaleString()}`;
  explanation += `\n• Median Price: $${analysis.medianPrice.toLocaleString()}`;
  explanation += `\n• Average Price: $${analysis.averagePrice.toLocaleString()}`;
  
  if (analysis.mileageAdjustment !== 0) {
    explanation += `\n\nMileage Adjustment: ${analysis.mileageAdjustment >= 0 ? '+' : ''}$${analysis.mileageAdjustment.toLocaleString()} `;
    explanation += `(based on ${input.mileage.toLocaleString()} miles compared to market average)`;
  }
  
  if (analysis.conditionAdjustment !== 0) {
    explanation += `\n\nCondition Adjustment: ${analysis.conditionAdjustment >= 0 ? '+' : ''}$${analysis.conditionAdjustment.toLocaleString()} `;
    explanation += `(${input.condition} condition relative to market)`;
  }
  
  explanation += `\n\nFinal Estimated Value: $${analysis.estimatedValue.toLocaleString()}`;
  explanation += `\nConfidence: ${analysis.confidenceScore}% (Market-based estimate)`;
  
  return explanation;
}