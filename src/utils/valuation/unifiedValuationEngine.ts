// Unified Valuation Engine with Real-Time Progress Tracking
import { supabase } from "@/integrations/supabase/client";
import { decodeVin } from "@/services/vehicleDecodeService";
import { getFuelCostAdjustment, getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment } from "@/services/adjustmentHelpers";
import { generateAIExplanation } from "@/services/aiExplanationService";
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { logValuationAudit, logValuationError, logValuationStep } from "@/utils/valuationAuditLogger";
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
  pdfUrl?: string;
  isPremium?: boolean;
  vin?: string;
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
    
    // Step 1: Decode VIN (5% Progress)
    tracker.startStep('vin_decode', { vin });
    const decoded = await decodeVin(vin);
    
    // Step 1: VIN Decoding (10% Progress)
    await logValuationStep('VIN_DECODE_START', vin, { zipCode, mileage, condition }, userId);
    // Extract vehicle data from decoded response
    const vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
    const vehicleYear = vehicleData.year || 2020;
    const vehicleMake = vehicleData.make || 'Unknown';
    const vehicleModel = vehicleData.model || 'Unknown';
    const vehicleTrim = vehicleData.trim || '';
    const vehicleFuelType = vehicleData.fuelType || 'gasoline';
    
    tracker.completeStep('vin_decode', { vehicle: vehicleData });
    await logValuationStep('VIN_DECODE_COMPLETE', vin, { make: vehicleMake, model: vehicleModel, year: vehicleYear }, userId);
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
    await logValuationStep('DEPRECIATION_APPLIED', vin, { amount: depreciation, vehicleYear }, userId);
    
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
    await logValuationStep('MILEAGE_ADJUSTMENT', vin, { amount: mileageAdj, mileage }, userId);
    
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
    await logValuationStep('CONDITION_APPLIED', vin, { amount: conditionAdj, condition }, userId);
    
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
    await logValuationStep('FUEL_PRICING_FETCHED', vin, { amount: fuelAdj, fuelType: vehicleFuelType }, userId);
    
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
          await logValuationStep('MARKET_SEARCH_COMPLETE', vin, { status: marketSearchStatus, listingCount: prices.length }, userId);
        } else {
          marketSearchStatus = "fallback";
          tracker.completeStep('market_search', { error: "No valid prices found" });
          await logValuationStep('MARKET_SEARCH_COMPLETE', vin, { status: marketSearchStatus, listingCount: 0 }, userId);
        }
      } else {
        marketSearchStatus = "fallback";
        tracker.completeStep('market_search', { error: "No listings found" });
        await logValuationStep('MARKET_SEARCH_COMPLETE', vin, { status: marketSearchStatus, listingCount: 0 }, userId);
      }
    } catch (e) {
      console.error("Market search error:", e);
      marketSearchStatus = "error";
      tracker.errorStep('market_search', e instanceof Error ? e.message : 'Unknown error');
      await logValuationStep('MARKET_SEARCH_COMPLETE', vin, { status: marketSearchStatus, error: e instanceof Error ? e.message : 'Unknown error' }, userId);
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
    await logValuationStep('CONFIDENCE_COMPUTED', vin, { confidenceScore, finalValue }, userId);
    
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
    await logValuationStep('AI_EXPLANATION_GENERATED', vin, { explanationLength: explanation.length }, userId);
    
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
    await logValuationStep('AUDIT_SAVED', vin, { finalValue, confidenceScore }, userId);
    
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
        await logValuationStep('PDF_GENERATED', vin, { pdfUrl: !!pdfUrl, isPremium }, userId);
      } catch (error) {
        console.error('❌ Error during PDF generation:', error);
        tracker.completeStep('pdf_generation', { error: (error as Error).message });
        await logValuationStep('PDF_GENERATION_FAILED', vin, { error: (error as Error).message }, userId);
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