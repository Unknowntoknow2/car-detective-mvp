
// Enhanced Valuation Pipeline with Real Market Data + AI Fallback + Full Audit Trail
import { fetchMarketComps } from "@/agents/marketSearchAgent";
import { generateOpenAIFallbackValuation } from "@/agents/openaiAgent";
import { ValuationInput, EnhancedValuationResult, EnhancedAuditLog } from "@/types/valuation";
import { calculateValuationFromListings } from "@/services/valuationEngine";
import { saveAuditLog } from "@/integrations/supabase/auditLogClient";

export interface CorrectedValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
}

export interface CorrectedValuationResult {
  success: boolean;
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: any[];
    priceRange: [number, number];
    marketAnalysis?: any;
    riskFactors?: any[];
    recommendations?: string[];
  };
  audit_id?: string;
  error?: string;
}

export async function runCorrectedValuationPipeline(
  input: CorrectedValuationInput
): Promise<CorrectedValuationResult> {
  console.log('🚀 Enhanced Valuation Pipeline: Starting with full traceability');
  
  // Initialize comprehensive audit log
  const audit: EnhancedAuditLog = {
    vin: input.vin,
    timestamp: new Date().toISOString(),
    zip: input.zipCode,
    mileage: input.mileage,
    condition: input.condition,
    sources: [],
    quality: 0,
    confidence_score: 0,
    fallbackUsed: false,
    confidenceBreakdown: {
      vin: !!input.vin && input.vin.length === 17,
      zip: !!input.zipCode && input.zipCode.length === 5,
      actualMileage: !!input.mileage,
      msrpEstimated: false,
      marketListings: false
    },
    warnings: [],
    sourcesUsed: [],
    followUpCompleted: false
  };

  try {
    console.log('🔍 Step 1: Attempting to fetch real market listings...');
    
    // Step 1: Try to get real-time listings from market agent
    const listings = await fetchMarketComps({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode,
      trim: input.trim
    });

    if (listings && listings.length > 0) {
      console.log('✅ Got', listings.length, 'real market listings');
      
      // Update audit with market data success
      audit.sources.push("market_listings");
      audit.sourcesUsed!.push(`market_listings_${listings.length}_found`);
      audit.quality += 40;
      audit.confidence_score += 40;
      audit.confidenceBreakdown!.marketListings = true;
      audit.marketListingsCount = listings.length;
      audit.marketListingSources = Array.from(new Set(listings.map(l => l.source)));

      // Calculate valuation from real market data
      const valuation = await calculateValuationFromListings({
        vin: input.vin,
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        condition: input.condition,
        zipCode: input.zipCode
      }, listings);

      // Enhance audit with valuation results
      audit.finalValue = valuation.estimated_value;
      audit.valueBreakdown = {
        baseValue: valuation.value_breakdown.base_value,
        depreciationAdjustment: valuation.value_breakdown.depreciation,
        mileageAdjustment: valuation.value_breakdown.mileage,
        conditionAdjustment: valuation.value_breakdown.condition,
        otherAdjustments: valuation.value_breakdown.ownership + valuation.value_breakdown.usageType + valuation.value_breakdown.marketSignal
      };
      audit.confidence_score = valuation.confidence_score;

      // Save audit log
      const auditId = await saveAuditLog({ ...audit, listings });
      valuation.audit_id = auditId;

      console.log('🎯 Market-based valuation completed:', valuation.estimated_value);
      
      return {
        success: true,
        valuation: {
          estimatedValue: valuation.estimated_value,
          confidenceScore: valuation.confidence_score,
          basePrice: valuation.value_breakdown.base_value,
          adjustments: [
            {
              factor: 'Depreciation',
              impact: valuation.value_breakdown.depreciation,
              percentage: (valuation.value_breakdown.depreciation / valuation.value_breakdown.base_value) * 100,
              description: `Age-based depreciation: ${valuation.depreciation || valuation.value_breakdown.depreciation}`
            },
            {
              factor: 'Mileage',
              impact: valuation.value_breakdown.mileage,
              percentage: (valuation.value_breakdown.mileage / valuation.value_breakdown.base_value) * 100,
              description: `Mileage adjustment: ${valuation.mileage_adjustment || valuation.value_breakdown.mileage}`
            },
            {
              factor: 'Condition',
              impact: valuation.value_breakdown.condition,
              percentage: (valuation.value_breakdown.condition / valuation.value_breakdown.base_value) * 100,
              description: `Condition adjustment for ${input.condition || 'good'} condition`
            },
            {
              factor: 'Other Factors',
              impact: valuation.value_breakdown.ownership + valuation.value_breakdown.usageType + valuation.value_breakdown.marketSignal,
              percentage: ((valuation.value_breakdown.ownership + valuation.value_breakdown.usageType + valuation.value_breakdown.marketSignal) / valuation.value_breakdown.base_value) * 100,
              description: 'Ownership history, usage type, and market volatility adjustments'
            }
          ],
          priceRange: [valuation.price_range_low || valuation.estimated_value * 0.9, valuation.price_range_high || valuation.estimated_value * 1.1],
          marketAnalysis: {
            dataSource: 'real_market_listings',
            listingCount: listings.length,
            sources: audit.marketListingSources,
            confidence: 'high'
          }
        },
        audit_id: auditId
      };
    }

    console.log('⚠️ No market listings found, falling back to AI estimation...');
    audit.warnings!.push('No market listings available');
    
    // Step 2: Fallback to AI search (OpenAI)
    console.log('🤖 Step 2: Using OpenAI AI fallback...');
    const aiFallback = await generateOpenAIFallbackValuation({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode
    });

    // Update audit with AI fallback
    audit.sources.push("openai_fallback");
    audit.sourcesUsed!.push("openai_ai_estimation");
    audit.quality += 15;
    audit.confidence_score = aiFallback.confidence_score;
    audit.fallbackUsed = true;
    audit.finalValue = aiFallback.estimated_value;
    audit.valueBreakdown = {
      baseValue: aiFallback.value_breakdown.base_value,
      depreciationAdjustment: aiFallback.value_breakdown.depreciation,
      mileageAdjustment: aiFallback.value_breakdown.mileage,
      conditionAdjustment: aiFallback.value_breakdown.condition,
      otherAdjustments: aiFallback.value_breakdown.ownership + aiFallback.value_breakdown.usageType + aiFallback.value_breakdown.marketSignal
    };
    audit.warnings!.push('Used AI fallback due to no market data');

    // Save audit log
    const auditId = await saveAuditLog({ ...audit, aiFallback });

    console.log('🎯 AI fallback valuation completed:', aiFallback.estimated_value);

    return {
      success: true,
      valuation: {
        estimatedValue: aiFallback.estimated_value,
        confidenceScore: aiFallback.confidence_score,
        basePrice: aiFallback.value_breakdown.base_value,
        adjustments: [
          {
            factor: 'Depreciation (AI)',
            impact: aiFallback.value_breakdown.depreciation,
            percentage: (aiFallback.value_breakdown.depreciation / aiFallback.value_breakdown.base_value) * 100,
            description: 'AI-estimated depreciation'
          },
          {
            factor: 'Mileage (AI)',
            impact: aiFallback.value_breakdown.mileage,
            percentage: (aiFallback.value_breakdown.mileage / aiFallback.value_breakdown.base_value) * 100,
            description: 'AI-estimated mileage adjustment'
          }
        ],
        priceRange: [aiFallback.estimated_value * 0.85, aiFallback.estimated_value * 1.15],
        marketAnalysis: {
          dataSource: 'ai_estimation',
          listingCount: 0,
          sources: ['openai'],
          confidence: 'low'
        },
        recommendations: ['Consider getting a professional appraisal due to limited market data']
      },
      audit_id: auditId
    };

  } catch (error) {
    console.error('❌ Enhanced Pipeline Error:', error);
    
    // Save error audit
    audit.warnings!.push(`Pipeline error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    audit.confidence_score = 5;
    const auditId = await saveAuditLog(audit);

    return {
      success: false,
      valuation: {
        estimatedValue: 0,
        confidenceScore: 0,
        basePrice: 0,
        adjustments: [],
        priceRange: [0, 0]
      },
      audit_id: auditId,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Legacy helper functions removed - not needed in enhanced pipeline

// Export legacy function for backward compatibility
export const calculateFinalValuation = runCorrectedValuationPipeline;
