
import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { ValuationParams } from '@/utils/valuation/types';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf } from '@/utils/pdf';
import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { AICondition, ConditionRating, PhotoScore } from '@/types/photo';
import { uploadAndAnalyzePhotos } from '@/services/photoService';

interface ReportData {
  id?: string;
  make: string;
  makeId?: string;
  model: string;
  modelId?: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  priceRange: [number, number];
  adjustments: AdjustmentBreakdown[];
  photoUrl?: string;
  explanation?: string;
  generatedAt: string;
  confidenceScore?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  pdfUrl?: string;
  features?: string[];
  aiCondition?: any;
}

interface BuildValuationReportInput {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  makeId?: string;
  model?: string;
  modelId?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  bodyType?: string;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  accidentCount?: number;
  photos?: File[];
  features?: string[];
  mpg?: number | null;
  userId?: string;
  valuationId?: string;
  isPremium?: boolean;
  isTestMode?: boolean;
  notifyDealers?: boolean;
}

interface EnhancedValuationParams extends ValuationParams {
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number;
}

export async function buildValuationReport(input: BuildValuationReportInput): Promise<ReportData> {
  let baseInfo = { make: input.make, model: input.model, year: input.year, makeId: input.makeId, modelId: input.modelId };
  let decodedData;

  if (input.identifierType === 'vin' && input.vin) {
    decodedData = await decodeVin(input.vin);
    baseInfo = {
      make: decodedData.make,
      model: decodedData.model,
      year: decodedData.year,
      makeId: decodedData.makeId,
      modelId: decodedData.modelId
    };
  } else if (input.identifierType === 'plate' && input.plate && input.state) {
    decodedData = await lookupPlate(input.plate, input.state);
    baseInfo = {
      make: decodedData.make,
      model: decodedData.model,
      year: decodedData.year,
      makeId: decodedData.makeId,
      modelId: decodedData.modelId
    };
  }

  let aiCondition: AICondition | undefined;
  let photoResult;
  
  if (input.photos && input.photos.length > 0) {
    try {
      photoResult = await uploadAndAnalyzePhotos(input.photos, input.valuationId || 'temp-id');
      
      if (!photoResult.error) {
        aiCondition = {
          condition: photoResult.condition,
          confidenceScore: photoResult.confidenceScore,
          issuesDetected: photoResult.individualScores?.map((s: PhotoScore) => `Issue with photo ${s.url}`), // Simplified for now
          aiSummary: `Photo analysis completed with score ${photoResult.score}`
        };
      }
    } catch (error) {
      console.error('Error processing photos:', error);
      // Continue without photo analysis
    }
  }

  const valuationParams: EnhancedValuationParams = {
    ...baseInfo,
    mileage: input.mileage || 0,
    condition: input.condition || (aiCondition?.condition as string) || 'Good',
    trim: input.trim,
    bodyType: input.bodyType,
    fuelType: input.fuelType,
    transmission: input.transmission,
    zip: input.zipCode,
    features: input.features,
    photoScore: photoResult?.score,
    aiConditionData: aiCondition ? {
      condition: aiCondition.condition,
      confidenceScore: aiCondition.confidenceScore,
      issuesDetected: aiCondition.issuesDetected,
      aiSummary: aiCondition.aiSummary
    } : undefined,
    accidentCount: input.accidentCount,
    premiumFeatures: input.features,
    mpg: input.mpg || undefined
  };

  // Call calculateFinalValuation with the options parameter
  const result = await calculateFinalValuation(valuationParams, {});

  // Convert the adjustments to AdjustmentBreakdown format
  const adjustmentsFormatted: AdjustmentBreakdown[] = (result.adjustments || []).map(adjustment => ({
    name: adjustment.factor || adjustment.name || '',
    value: adjustment.impact || adjustment.value || 0,
    description: adjustment.description || '',
    percentAdjustment: adjustment.percentAdjustment || 0,
    factor: adjustment.factor,
    impact: adjustment.impact,
    adjustment: adjustment.value,
    impactPercentage: adjustment.percentAdjustment
  }));

  const report: ReportData = {
    ...baseInfo,
    mileage: valuationParams.mileage,
    condition: valuationParams.condition,
    estimatedValue: result.estimatedValue,
    priceRange: result.priceRange || [0, 0],
    adjustments: adjustmentsFormatted,
    photoUrl: photoResult?.photoUrl,
    bestPhotoUrl: photoResult?.photoUrl,
    explanation: result.explanation,
    generatedAt: new Date().toISOString(),
    confidenceScore: result.confidenceScore,
    photoScore: photoResult?.score,
    isPremium: input.isPremium,
    features: input.features,
    aiCondition: aiCondition
  };

  return report;
}
