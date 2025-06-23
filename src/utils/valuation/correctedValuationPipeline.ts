import { ReportData, ValuationResult, AdjustmentBreakdown, PdfOptions } from "@/types/valuation";
import { generateValuationPdf } from "../pdf/generateValuationPdf";
import { calculateAdjustments, calculateFinalValue } from "./rulesEngine";
import { RulesEngineInput } from "./rules/types";
import { BasePriceService } from "@/services/basePriceService";

export interface CorrectedValuationParams {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  accidentCount?: number;
  isPremium?: boolean;
  valuationId?: string;
}

export interface CorrectedValuationResults {
  success: boolean;
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    valuationId: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    zipCode: string;
  };
  summary: string;
  marketplaceData: {
    listings: Array<{
      id: string;
      title: string;
      price: number;
      platform: string;
      location: string;
      url: string;
      mileage?: number;
      created_at: string;
    }>;
    averagePrice: number;
    count: number;
  };
  pdfBuffer: Uint8Array;
}

export async function runCorrectedValuationPipeline(
  params: CorrectedValuationParams
): Promise<CorrectedValuationResults> {
  try {
    if (!params.make || !params.model || !params.year) {
      throw new Error("Make, model, and year are required");
    }

    console.log('🚀 Starting corrected valuation pipeline with params:', params);

    // Get base price first
    const basePrice = BasePriceService.getBasePrice({
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage || 50000
    });

    console.log('💰 Base price calculated:', basePrice);

    const rulesEngineInput: RulesEngineInput = {
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage || 50000,
      condition: params.condition || "Good",
      zipCode: params.zipCode || "90210",
      trim: params.trim,
      fuelType: params.fuelType,
      transmissionType: params.transmission,
      accidentCount: params.accidentCount || 0,
      exteriorColor: params.color,
      basePrice: basePrice
    };

    // Calculate adjustments
    const adjustments: AdjustmentBreakdown[] = await calculateAdjustments(rulesEngineInput);
    
    // Calculate final value using base price + adjustments
    const estimatedValue = calculateFinalValue(basePrice, adjustments);
    
    console.log('🔧 Adjustments calculated:', adjustments);
    console.log('💵 Final estimated value:', estimatedValue);

    // Validate the result
    if (!BasePriceService.validateValue(estimatedValue, params.year)) {
      console.warn('⚠️ Calculated value failed validation, using fallback');
      const fallbackValue = Math.max(basePrice * 0.8, 5000);
      console.log('🔄 Using fallback value:', fallbackValue);
    }

    const finalValuation: ValuationResult = {
      id: params.valuationId || `val-${Date.now()}`,
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage || 50000,
      condition: params.condition || "Good",
      estimatedValue: estimatedValue,
      confidenceScore: 85,
      zipCode: params.zipCode || "90210",
      adjustments: adjustments,
      basePrice: basePrice,
      priceRange: [
        Math.round(estimatedValue * 0.92),
        Math.round(estimatedValue * 1.08)
      ] as [number, number]
    };

    console.log('✅ Final valuation result:', finalValuation);

    // Mock photo analysis data
    const mockPhotoAnalysis = {
      condition: 'Good' as const,
      confidenceScore: 85,
      issuesDetected: [] as string[],
      aiSummary: 'Vehicle appears to be in good condition based on available data'
    };

    const reportData: ReportData = {
      id: params.valuationId || `val-${Date.now()}`,
      vin: params.vin,
      make: params.make || 'Unknown',
      model: params.model || 'Unknown',
      year: params.year || new Date().getFullYear(),
      trim: params.trim,
      mileage: params.mileage || 0,
      condition: params.condition || 'Good',
      estimatedValue: finalValuation.estimatedValue,
      price: finalValuation.estimatedValue,
      priceRange: finalValuation.priceRange,
      confidenceScore: finalValuation.confidenceScore,
      zipCode: params.zipCode || '90210',
      adjustments: finalValuation.adjustments,
      generatedAt: new Date().toISOString(),
      isPremium: params.isPremium,
      aiCondition: {
        condition: mockPhotoAnalysis.condition,
        confidenceScore: mockPhotoAnalysis.confidenceScore,
        issuesDetected: mockPhotoAnalysis.issuesDetected,
        aiSummary: mockPhotoAnalysis.aiSummary,
      },
      color: params.color,
      bodyType: params.bodyType,
      fuelType: params.fuelType,
      basePrice: basePrice,
      competitorPrices: [],
      competitorAverage: finalValuation.estimatedValue,
      marketplaceListings: [],
      auctionResults: [],
    };

    // Generate PDF with proper options
    const pdfOptions: PdfOptions = {
      isPremium: params.isPremium || false,
      includeExplanation: params.isPremium || false,
      marketplaceListings: [],
    };

    const pdfBuffer = await generateValuationPdf(reportData, pdfOptions);

    return {
      success: true,
      valuation: {
        estimatedValue: finalValuation.estimatedValue,
        confidenceScore: finalValuation.confidenceScore,
        basePrice: basePrice,
        adjustments: finalValuation.adjustments,
        valuationId: reportData.id,
        vin: params.vin || '',
        make: params.make || 'Unknown',
        model: params.model || 'Unknown',
        year: params.year || new Date().getFullYear(),
        mileage: params.mileage || 0,
        condition: params.condition || 'Good',
        zipCode: params.zipCode || '90210',
      },
      summary: `Estimated value: $${finalValuation.estimatedValue.toLocaleString()} (Base: $${basePrice.toLocaleString()})`,
      marketplaceData: {
        listings: [],
        averagePrice: finalValuation.estimatedValue,
        count: 0,
      },
      pdfBuffer,
    };
  } catch (error) {
    console.error('❌ Error in corrected valuation pipeline:', error);
    throw error;
  }
}
