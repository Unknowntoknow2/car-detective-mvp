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
		let valuationRequest: any = null;
		try {
			const tracker = progressTracker || new ValuationProgressTracker();
			tracker.startStep('vin_decode', { vin });
			let decoded: any = null;
			let vehicleData: DecodedVehicleInfo = {} as DecodedVehicleInfo;
			try {
				decoded = await decodeVin(vin);
				vehicleData = decoded.decoded as DecodedVehicleInfo || {} as DecodedVehicleInfo;
			} catch (vinDecodeError) {
				try {
					const { data: cachedVehicle } = await supabase
						.from('decoded_vehicles')
						.select('*')
						.eq('vin', vin)
						.maybeSingle();
					if (cachedVehicle) {
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
				} catch {}
			}
			const vehicleYear = vehicleData.year || 2020;
			const vehicleMake = vehicleData.make || 'Unknown';
			const vehicleModel = vehicleData.model || 'Unknown';
			const vehicleTrim = vehicleData.trim || '';
			const vehicleFuelType = vehicleData.fuelType || 'gasoline';
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
				valuationRequest = {
					id: `fallback_${Date.now()}`,
					vin,
					make: vehicleMake,
					model: vehicleModel,
					year: vehicleYear,
					user_id: userId,
					created_at: new Date().toISOString()
				};
			}
			await logValuationStep('VIN_DECODE_START', vin, valuationRequest.id, { zipCode, mileage, condition }, userId, zipCode);
			tracker.completeStep('vin_decode', { vehicle: vehicleData });
			await logValuationStep('VIN_DECODE_COMPLETE', vin, valuationRequest.id, { make: vehicleMake, model: vehicleModel, year: vehicleYear }, userId, zipCode);
			const baseValue = await getDynamicMSRP(vehicleYear, vehicleMake, vehicleModel, vehicleTrim);
			const adjustments: ValuationResult["adjustments"] = [];
			let finalValue = baseValue;
			const sources = baseValue > 30000 ? ["msrp_db_lookup"] : ["estimated_msrp"];
			let marketSearchStatus: "success" | "fallback" | "error" = "fallback";
			const usingDatabaseMSRP = baseValue > 30000;
			tracker.startStep('depreciation', { year: vehicleYear, baseValue });
			const depreciation = getDepreciationAdjustment(vehicleYear, vehicleMake, vehicleFuelType);
			const afterDepreciation = finalValue + depreciation;
			adjustments.push({ label: "Depreciation", amount: depreciation, reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)` });
			await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Depreciation", amount: depreciation, reason: `${vehicleYear} model year (${new Date().getFullYear() - vehicleYear} years old)`, baseValue: finalValue, newValue: afterDepreciation }, userId, zipCode);
			finalValue = afterDepreciation;
			tracker.completeStep('depreciation', { adjustment: depreciation });
			await logValuationStep('DEPRECIATION_APPLIED', vin, valuationRequest?.id || 'fallback', { amount: depreciation, vehicleYear, baseValue: finalValue - depreciation, newValue: finalValue }, userId, zipCode);
			tracker.startStep('mileage', { mileage, baseValue: finalValue });
			const mileageAdj = getMileageAdjustment(mileage);
			const afterMileage = finalValue + mileageAdj;
			adjustments.push({ label: "Mileage", amount: mileageAdj, reason: `${mileage.toLocaleString()} miles` });
			await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Mileage", amount: mileageAdj, reason: `${mileage.toLocaleString()} miles`, baseValue: finalValue, newValue: afterMileage }, userId, zipCode);
			finalValue = afterMileage;
			tracker.completeStep('mileage', { adjustment: mileageAdj });
			await logValuationStep('MILEAGE_ADJUSTMENT', vin, valuationRequest?.id || 'fallback', { amount: mileageAdj, mileage, baseValue: finalValue - mileageAdj, newValue: finalValue }, userId, zipCode);
			tracker.startStep('condition', { condition });
			const conditionAdj = getConditionAdjustment(condition);
			const afterCondition = finalValue + conditionAdj;
			adjustments.push({ label: "Condition", amount: conditionAdj, reason: `${condition} condition` });
			await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Condition", amount: conditionAdj, reason: `${condition} condition`, baseValue: finalValue, newValue: afterCondition }, userId, zipCode);
			finalValue = afterCondition;
			tracker.completeStep('condition', { adjustment: conditionAdj });
			await logValuationStep('CONDITION_APPLIED', vin, valuationRequest?.id || 'fallback', { amount: conditionAdj, condition, baseValue: finalValue - conditionAdj, newValue: finalValue }, userId, zipCode);
			tracker.startStep('fuel_cost', { fuelType: vehicleFuelType, zipCode });
			const fuelType = vehicleFuelType;
			const fuelAdj = await getFuelCostAdjustment(fuelType, zipCode);
			const afterFuel = finalValue + fuelAdj;
			adjustments.push({ label: "Fuel Type Impact", amount: fuelAdj, reason: `${fuelType} fuel type in ZIP ${zipCode}` });
			await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Fuel Type Impact", amount: fuelAdj, reason: `${fuelType} fuel type in ZIP ${zipCode}`, baseValue: finalValue, newValue: afterFuel }, userId, zipCode);
			finalValue = afterFuel;
			sources.push("eia_fuel_costs");
			tracker.completeStep('fuel_cost', { adjustment: fuelAdj });
			await logValuationStep('FUEL_PRICING_FETCHED', vin, valuationRequest?.id || 'fallback', { amount: fuelAdj, fuelType: vehicleFuelType, baseValue: finalValue - fuelAdj, newValue: finalValue }, userId, zipCode);
			tracker.startStep('package_adjustments', { make: vehicleMake, model: vehicleModel, trim: vehicleTrim });
			const packageAdjustments = getPackageAdjustments(vehicleMake, vehicleModel, vehicleTrim);
			let totalPackageValue = 0;
			for (const pkg of packageAdjustments) {
				totalPackageValue += pkg.value;
				adjustments.push({ label: `Package: ${pkg.name}`, amount: pkg.value, reason: pkg.description });
				await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: `Package: ${pkg.name}`, amount: pkg.value, reason: pkg.description, baseValue: finalValue, newValue: finalValue + pkg.value }, userId, zipCode);
			}
			finalValue += totalPackageValue;
			if (totalPackageValue > 0) {
				sources.push("package_detection");
			}
			tracker.completeStep('package_adjustments', { totalValue: totalPackageValue, packageCount: packageAdjustments.length });
			await logValuationStep('PACKAGE_ADJUSTMENTS', vin, valuationRequest?.id || 'fallback', { totalValue: totalPackageValue, packages: packageAdjustments.length }, userId, zipCode);
			tracker.startStep('market_search', { year: vehicleYear, make: vehicleMake, model: vehicleModel });
			let listings: any[] = [];
			let listingRange: { min: number; max: number } | undefined;
			try {
				const marketResult = await fetchMarketComps({ year: vehicleYear, make: vehicleMake, model: vehicleModel, trim: vehicleTrim, zipCode, mileage, vin });
				if (marketResult.listings && marketResult.listings.length > 0) {
					listings = marketResult.listings;
					const persistResult = await saveMarketListings(listings, { vin, userId, valuationId: valuationRequest?.id, valuationRequestId: valuationRequest?.id, zipCode });
					if (persistResult.success) {
						sources.push("market_listings_database");
					}
					const prices = listings.map(l => l.price).filter(p => p > 0);
					const realListings = listings.filter(l => l.source_type !== 'estimated' && l.source !== 'Market Estimate');
					const realPrices = realListings.map(l => l.price).filter(p => p > 0);
					if (realPrices.length > 0) {
						const min = Math.min(...realPrices);
						const max = Math.max(...realPrices);
						const avg = realPrices.reduce((a, b) => a + b, 0) / realPrices.length;
						const exactVinMatch = realListings.find(l => l.vin === vin);
						if (exactVinMatch) {
							const exactPrice = exactVinMatch.price;
							const strongAnchorAdj = (exactPrice - finalValue) * 0.8;
							adjustments.push({ label: "Exact VIN Match", amount: strongAnchorAdj, reason: `Found exact VIN listing at $${exactPrice.toLocaleString()} on ${exactVinMatch.source}` });
							finalValue = finalValue + strongAnchorAdj;
							marketSearchStatus = "success";
							sources.push("exact_vin_match");
							await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Exact VIN Match Anchor", amount: strongAnchorAdj, reason: `Exact VIN found on ${exactVinMatch.source} at $${exactPrice.toLocaleString()}`, baseValue: finalValue - strongAnchorAdj, newValue: finalValue }, userId, zipCode);
						} else if (realPrices.length >= 3) {
							const marketWeight = Math.min(0.4, marketResult.trust);
							const marketAdj = (avg - finalValue) * marketWeight;
							const afterMarket = finalValue + marketAdj;
							adjustments.push({ label: "Market Anchor", amount: marketAdj, reason: `Adjusted toward ${realPrices.length} comparable listings (avg: $${avg.toLocaleString()}, trust: ${Math.round(marketResult.trust * 100)}%)` });
							finalValue = afterMarket;
							marketSearchStatus = "success";
							await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Market Anchoring", amount: marketAdj, reason: `Based on ${realPrices.length} comparable listings (avg: $${avg.toLocaleString()})`, baseValue: finalValue - marketAdj, newValue: finalValue }, userId, zipCode);
						}
						listingRange = { min, max };
						sources.push("openai_market_search");
						marketSearchStatus = "success";
						tracker.completeStep('market_search', { listingCount: realPrices.length, avgPrice: avg });
						await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, listingCount: realPrices.length }, userId, zipCode);
					} else {
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
				marketSearchStatus = "error";
				tracker.errorStep('market_search', e instanceof Error ? e.message : 'Unknown error');
				await logValuationStep('MARKET_SEARCH_COMPLETE', vin, valuationRequest?.id || 'fallback', { status: marketSearchStatus, error: e instanceof Error ? e.message : 'Unknown error' }, userId, zipCode);
			}
			tracker.startStep('confidence_calc', { marketStatus: marketSearchStatus });
			let confidenceScore = calculateAdvancedConfidence({ vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode, marketSearchStatus, listings, listingRange, finalValue, sources, baseValue });
			const confidenceBreakdown = getConfidenceBreakdown({ vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode, marketSearchStatus, listings, listingRange, finalValue, sources, baseValue });
			finalValue = Math.max(3000, Math.round(finalValue));
			tracker.completeStep('confidence_calc', { score: confidenceScore, spreadAnalysis: listingRange ? (listingRange.max - listingRange.min) / finalValue : null });
			await logValuationStep('CONFIDENCE_COMPUTED', vin, valuationRequest?.id || 'fallback', { confidenceScore, finalValue, listingCount: listings.length, marketSpread: listingRange }, userId, zipCode);
			tracker.startStep('ai_explanation', { finalValue, confidenceScore });
			const explanation = await generateAIExplanation({ baseValue, adjustments, finalValue, vehicle: { year: vehicleYear, make: vehicleMake, model: vehicleModel, trim: vehicleTrim, fuelType: vehicleFuelType }, zip: zipCode, mileage, listings, confidenceScore });
			tracker.completeStep('ai_explanation', { explanation });
			await logValuationStep('AI_EXPLANATION_GENERATED', vin, valuationRequest?.id || 'fallback', { explanationLength: explanation.length, finalValue }, userId, zipCode);
			if (valuationRequest?.id) {
				try {
					await saveValuationExplanation({ valuationRequestId: valuationRequest.id, explanationMarkdown: explanation, adjustmentFactors: { depreciation: adjustments.find(a => a.label === 'Depreciation')?.amount || 0, mileage: adjustments.find(a => a.label === 'Mileage')?.amount || 0, condition: adjustments.find(a => a.label === 'Condition')?.amount || 0, fuel: adjustments.find(a => a.label === 'Fuel Type Impact')?.amount || 0, market: adjustments.find(a => a.label === 'Market Anchoring')?.amount || 0 }, confidenceBreakdown: { vinData: baseValue > 30000 ? 25 : 15, marketData: marketSearchStatus === 'success' ? 25 : 5, fuelData: adjustments.find(a => a.label === 'Fuel Type Impact')?.amount !== 0 ? 15 : 10, overall: confidenceScore }, sourceWeights: sources.reduce((acc, source) => { acc[source] = 1; return acc; }, {} as { [key: string]: number }), influentialComps: listings.slice(0, 5), priceRangeExplanation: listingRange ? `Market range: $${listingRange.min.toLocaleString()} - $${listingRange.max.toLocaleString()}` : undefined });
				} catch {}
			}
			tracker.startStep('audit_log', { finalValue, confidenceScore });
			const auditId = await logValuationAudit('VALUATION_COMPLETE', { vin, zipCode, finalValue, confidenceScore, baseValue, userId, adjustments: adjustments.map(a => ({ label: a.label, amount: a.amount, reason: a.reason, timestamp: new Date().toISOString() })), sources: sources, listingCount: listings.length, marketSearchStatus, listingRange, timestamp: Date.now(), vehicleData: { make: vehicleMake, model: vehicleModel, year: vehicleYear, trim: vehicleTrim, fuelType: vehicleFuelType }, processingSteps: { vinDecoded: true, depreciationApplied: adjustments.find(a => a.label === "Depreciation") !== undefined, mileageAdjusted: adjustments.find(a => a.label === "Mileage") !== undefined, conditionFactored: adjustments.find(a => a.label === "Condition") !== undefined, fuelCostApplied: adjustments.find(a => a.label === "Fuel Type Impact") !== undefined, marketDataUsed: marketSearchStatus === "success" } });
			if (valuationRequest?.id) {
				await completeValuationRequest(valuationRequest.id, finalValue, confidenceScore, auditId);
			}
			tracker.completeStep('audit_log', { success: true, auditId });
			await logValuationStep('AUDIT_SAVED', vin, valuationRequest?.id || 'fallback', { finalValue, confidenceScore, auditId }, userId, zipCode);
			let pdfUrl: string | undefined;
			let savedValuation: any = null;
			try {
				const { data: saveData, error: saveError } = await supabase
					.from('valuations')
					.insert({ user_id: userId, vin, make: vehicleMake, model: vehicleModel, year: vehicleYear, mileage, condition, state: zipCode, estimated_value: finalValue, confidence_score: confidenceScore, base_value: baseValue, created_at: new Date().toISOString() })
					.select('id')
					.single();
				if (!saveError && saveData) {
					savedValuation = saveData;
				}
			} catch {}
			if (isPremium && savedValuation?.id) {
				try {
					tracker.startStep('pdf_generation', { isPremium: true });
					const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-valuation-pdf', { body: { valuationId: savedValuation.id } });
					if (!pdfError && pdfData?.url) {
						pdfUrl = pdfData.url;
						await supabase.from('valuations').update({ pdf_url: pdfUrl, pdf_generated_at: new Date().toISOString() }).eq('id', savedValuation.id);
					}
					tracker.completeStep('pdf_generation', { pdfUrl: !!pdfUrl });
					await logValuationStep('PDF_GENERATED', vin, valuationRequest?.id || 'fallback', { pdfUrl: !!pdfUrl, isPremium: true, finalValue }, userId, zipCode);
				} catch (error) {
					tracker.completeStep('pdf_generation', { error: (error as Error).message });
					await logValuationStep('PDF_GENERATION_FAILED', vin, valuationRequest?.id || 'fallback', { error: (error as Error).message, finalValue }, userId, zipCode);
				}
			}
			const result: ValuationResult = {
				id: savedValuation?.id,
				vehicle: { year: vehicleYear, make: vehicleMake, model: vehicleModel, trim: vehicleTrim, fuelType: vehicleFuelType },
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
				shareLink: '', // Placeholder, implement as needed
				qrCode: '',    // Placeholder, implement as needed
				isPremium: isPremium || false,
				vin,
				pdfUrl
			};
			await logValuationStep('COMPLETE', vin, valuationRequest.id, { finalValue, confidenceScore, adjustmentCount: adjustments.length, sources, listingCount: listings.length, marketSearchStatus }, userId, zipCode);
			return result;
		} catch (error) {
			if (valuationRequest?.id) {
				await failValuationRequest(valuationRequest.id, error instanceof Error ? error.message : 'Unknown valuation error');
			}
			await logValuationError(error instanceof Error ? error : new Error('Unknown valuation error'), { vin, step: 'valuation_processing', userId, zipCode, mileage, condition });
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
