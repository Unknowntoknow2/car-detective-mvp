
import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { ValuationParams } from '@/utils/valuation/types';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf } from '@/utils/pdf';
import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { AICondition, ConditionRating } from '@/types/photo';
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

interface EnhancedValuationParams extends Omit<ValuationParams, 'aiConditionData'> {
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number;
  aiConditionData?: {
    condition: ConditionRating;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  };
}

interface PhotoScoringResult {
  score: number;
  photoUrl: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    makeId?: string;
    modelId?: string;
  };
  individualScores?: number[];
  error?: string;
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
          issuesDetected: photoResult.individualScores?.map(s => `Issue with photo ${s}`), // Simplified for now
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

  const result: ValuationResult = calculateFinalValuation(valuationParams);

  const report: ReportData = {
    ...baseInfo,
    mileage: valuationParams.mileage,
    condition: valuationParams.condition,
    estimatedValue: result.estimatedValue,
    priceRange: result.priceRange,
    adjustments: result.adjustments,
    photoUrl: input.photos && input.photos.length > 0 ? 'photo_url_placeholder' : undefined,
    explanation: result.explanation,
    generatedAt: new Date().toISOString()
  };

  return report;
}
