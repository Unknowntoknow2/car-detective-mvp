// Unified Valuation Engine with Real-Time Progress Tracking
import { supabase } from "@/integrations/supabase/client";
import { decodeVin } from "@/services/vehicleDecodeService";
import { getFuelCostAdjustment, getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment } from "@/services/adjustmentHelpers";
import { generateAIExplanation } from "@/services/aiExplanationService";
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { logValuationAudit, logValuationError, logValuationStep, logAdjustmentStep } from "@/utils/valuationAuditLogger";
import { ValuationProgressTracker } from "@/utils/valuation/progressTracker";
import { getDynamicMSRP } from "@/services/valuation/msrpLookupService";
import { calculateAdvancedConfidence, getConfidenceBreakdown } from "@/services/valuation/confidenceEngine";
import { saveMarketListings } from "@/services/valuation/marketListingService";
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
  try {
    console.log('🚀 Starting unified valuation process:', input);
    
    const { vin, zipCode, mileage, condition, userId, isPremium } = input;
    
    // Initialize progress tracking
    const tracker = progressTracker || new ValuationProgressTracker();

    // FIX #1: Save valuation request to database immediately
    const { data: valuationRequest, error: requestError } = await supabase
      .from('valuation_requests')
      .insert({
        user_id: userId,
        vin,
        zip_code: zipCode,
        mileage,
        condition,
        is_premium: isPremium || false,
        request_timestamp: new Date().toISOString(),
        status: 'processing'
      })
      .select('id')
      .single();

    if (requestError) {
      console.error('❌ Error saving valuation request:', requestError);
    } else {
      console.log('✅ Valuation request saved with ID:', valuationRequest?.id);
    }
    
    // Step 1: Decode VIN (5% Progress)
    tracker.startStep('vin_decode', { vin });
    const decoded = await decodeVin(vin);
    
    // Step 1: VIN Decoding (10% Progress)
    await logValuationStep('VIN_DECODE_START', vin, valuationRequest?.id || 'fallback', { zipCode, mileage, condition }, userId, zipCode);
    // Extract vehicle data from decoded response
    const vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
    const vehicleYear = vehicleData.year || 2020;
    const vehicleMake = vehicleData.make || 'Unknown';
    const vehicleModel = vehicleData.model || 'Unknown';
    const vehicleTrim = vehicleData.trim || '';
    const vehicleFuelType = vehicleData.fuelType || 'gasoline';
    
    tracker.completeStep('vin_decode', { vehicle: vehicleData });
    await logValuationStep('VIN_DECODE_COMPLETE', vin, valuationRequest?.id || 'fallback', { make: vehicleMake, model: vehicleModel, year: vehicleYear }, userId, zipCode);
    console.log('✅ VIN decoded:', { make: vehicleMake, model: vehicleModel, year: vehicleYear });
    
    // Step 2: FIX #4 - Dynamic MSRP Lookup
    const baseValue = await getDynamicMSRP(vehicleYear, vehicleMake, vehicleModel, vehicleTrim);
    const adjustments: ValuationResult["adjustments"] = [];
    let finalValue = baseValue;
    const sources = baseValue > 30000 ? ["msrp_db_lookup"] : ["estimated_msrp"];
    let marketSearchStatus: "success" | "fallback" | "error" = "fallback";
    
    // Step 2: Apply depreciation adjustment (10% Progress)
    tracker.startStep('depreciation', { year: vehicleYear, baseValue });
    const depreciation = getDepreciationAdjustment(vehicleYear);
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
        
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          
          const marketAdj = avg - finalValue;
          const afterMarket = avg;
          adjustments.push({ 
            label: "Market Anchoring", 
            amount: marketAdj, 
            reason: `Based on ${prices.length} comparable listings` 
          });
          
          // Enhanced audit logging with metadata
          await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', {
            label: "Market Anchoring",
            amount: marketAdj,
            reason: `Based on ${prices.length} comparable listings (avg: $${avg.toLocaleString()})`,
            baseValue: finalValue,
            newValue: afterMarket
          }, userId, zipCode);
          
          finalValue = afterMarket;
          listingRange = { min, max };
          sources.push("openai_market_search");
          marketSearchStatus = "success";
          tracker.completeStep('market_search', { listingCount: prices.length, avgPrice: avg });
          await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, listingCount: prices.length }, userId, zipCode);
        } else {
          marketSearchStatus = "fallback";
          tracker.completeStep('market_search', { error: "No valid prices found" });
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
    
    // Step 7: FIX #5 - Enhanced Confidence Score Calibration v2
    tracker.startStep('confidence_calc', { marketStatus: marketSearchStatus });
    
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
    
    console.log(`📊 Advanced confidence calculation: ${confidenceScore}% (based on market spread, source count, ZIP match)`);
    
    // Log confidence formula for debugging
    const confidenceBreakdown = getConfidenceBreakdown({
      vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode,
      marketSearchStatus, listings, listingRange, finalValue, sources, baseValue
    });
    console.log('🔍 Confidence breakdown:', confidenceBreakdown);
    
    // Ensure final value is reasonable
    finalValue = Math.max(3000, Math.round(finalValue));
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
    await logValuationStep('AI_EXPLANATION_GENERATED', vin, valuationRequest?.id || 'fallback', { explanationLength: explanation.length }, userId, zipCode);
    
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
      await supabase
        .from('valuation_requests')
        .update({
          status: 'completed',
          final_value: finalValue,
          confidence_score: confidenceScore,
          audit_log_id: auditId,
          completed_at: new Date().toISOString()
        })
        .eq('id', valuationRequest.id);
    }
    
    tracker.completeStep('audit_log', { success: true, auditId });
    await logValuationStep('AUDIT_SAVED', vin, valuationRequest?.id || 'fallback', { finalValue, confidenceScore, auditId }, userId, zipCode);
    
    // Step 10: Generate PDF for premium users (5% Progress)
    let pdfUrl: string | undefined;
    if (isPremium) {
      try {
        tracker.startStep('pdf_generation', { isPremium: true });
        
        // Save valuation to database first to get an ID for PDF generation
        const { data: savedValuation, error: saveError } = await supabase
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

        if (!saveError && savedValuation) {
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
        }
        
        tracker.completeStep('pdf_generation', { pdfUrl: !!pdfUrl });
        await logValuationStep('PDF_GENERATED', vin, valuationRequest?.id || 'fallback', { pdfUrl: !!pdfUrl, isPremium }, userId, zipCode);
      } catch (error) {
        console.error('❌ Error during PDF generation:', error);
        tracker.completeStep('pdf_generation', { error: (error as Error).message });
        await logValuationStep('PDF_GENERATION_FAILED', vin, valuationRequest?.id || 'fallback', { error: (error as Error).message }, userId, zipCode);
        // Don't fail the entire valuation if PDF generation fails
      }
    }
    
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
      timestamp: Date.now(),
      shareLink: `https://ain.ai/share/${vin}-${Date.now()}`, // Mock share link
      qrCode: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="8">QR:${vin}</text></svg>`)}`, // Mock QR
      isPremium: isPremium || false,
      vin,
      pdfUrl
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