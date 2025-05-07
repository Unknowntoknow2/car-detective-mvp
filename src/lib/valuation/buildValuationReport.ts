import { calculateValuation } from '@/utils/valuation/valuationEngine';
import { ValuationParams } from '@/utils/valuation/types';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf } from '@/utils/pdf';
import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { AICondition } from '@/types/photo';
import { ReportData } from '@/utils/pdf/types';

interface BuildValuationReportInput {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  model?: string;
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

/**
 * Orchestrates the valuation process based on the input identifier type.
 * @param input - The valuation input containing vehicle details and options.
 */
export async function buildValuationReport(input: BuildValuationReportInput): Promise<ValuationResult> {
  try {
    let vehicleDetails: any = {};
    let valuationParams: ValuationParams;
    let isPremiumUser = false;
    let photoScore: number | undefined;
    let bestPhotoUrl: string | null = null;
    let aiCondition: AICondition | undefined;
    let explanation: string | undefined;

    // 1. Identify Vehicle
    switch (input.identifierType) {
      case 'vin':
        if (!input.vin) throw new Error('VIN is required');
        vehicleDetails = await decodeVin(input.vin);
        if (!vehicleDetails) throw new Error('Failed to decode vehicle information');
        valuationParams = {
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          year: vehicleDetails.year,
          mileage: input.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          trim: vehicleDetails.trim,
          transmission: vehicleDetails.transmission,
          fuelType: vehicleDetails.fuelType
        };
        break;

      case 'plate':
        if (!input.plate || !input.state) throw new Error('Plate and state are required');
        const plateLookup = await lookupPlate(input.plate, input.state);
        if (!plateLookup) throw new Error('Failed to lookup vehicle by plate');
        vehicleDetails = plateLookup;
        valuationParams = {
          make: plateLookup.make,
          model: plateLookup.model,
          year: plateLookup.year,
          mileage: input.mileage || plateLookup.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          transmission: plateLookup.transmission || undefined,
          fuelType: plateLookup.fuelType || undefined
        };
        break;

      case 'manual':
        if (!input.make || !input.model || !input.year) throw new Error('Make, model, and year are required for manual entry');
        vehicleDetails = {
          make: input.make,
          model: input.model,
          year: input.year
        };
        valuationParams = {
          make: input.make,
          model: input.model,
          year: input.year,
          mileage: input.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          trim: input.trim,
          transmission: input.transmission,
          fuelType: input.fuelType
        };
        break;

      case 'photo':
        // TODO: Implement photo-based valuation
        throw new Error('Photo-based valuation is not yet implemented');

      default:
        throw new Error('Invalid identifier type');
    }

    // 2. Premium Access Check
    try {
      if (input.userId && input.valuationId) {
        const { data: premiumData, error: premiumError } = await supabase.functions.invoke('verify-payment', {
          body: { userId: input.userId, valuationId: input.valuationId }
        });

        if (premiumError) {
          console.error('Error verifying premium status:', premiumError);
        } else if (premiumData && premiumData.hasPremiumAccess) {
          isPremiumUser = true;
        } else {
          console.warn('User does not have premium access:', premiumData?.reason);
        }
      }
    } catch (premiumCheckError: any) {
      console.error('Error during premium access check:', premiumCheckError);
    }

    // 3. Photo Analysis (if available and premium)
    if (input.photos && input.photos.length > 0 && isPremiumUser) {
      try {
        const { data: photoAnalysis, error: photoError } = await supabase.functions.invoke('score-image', {
          body: {
            photoUrls: input.photos.map(photo => URL.createObjectURL(photo)),
            valuationId: input.valuationId
          }
        });

        if (photoError) {
          console.error('Photo analysis failed:', photoError);
        } else if (photoAnalysis && photoAnalysis.scores && photoAnalysis.scores.length > 0) {
          photoScore = photoAnalysis.scores.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / photoAnalysis.scores.length;
          bestPhotoUrl = photoAnalysis.scores.find((score: any) => score.isPrimary)?.url || photoAnalysis.scores[0].url;
          aiCondition = photoAnalysis.aiCondition;
        }
      } catch (photoAnalysisError: any) {
        console.error('Error during photo analysis:', photoAnalysisError);
      }
    }

    // 4. Calculate Valuation
    const valuationResult = await calculateValuation(valuationParams);

    if (!valuationResult) {
      throw new Error('Failed to calculate valuation');
    }

    // 5. Generate Explanation (if premium)
    if (isPremiumUser) {
      try {
        const { data: explanationData, error: explanationError } = await supabase.functions.invoke('generate-explanation', {
          body: {
            valuationId: input.valuationId,
            valuationResult,
            vehicleDetails
          }
        });

        if (explanationError) {
          console.error('Explanation generation failed:', explanationError);
        } else if (explanationData && explanationData.explanation) {
          explanation = explanationData.explanation;
        }
      } catch (explanationError: any) {
        console.error('Error generating explanation:', explanationError);
      }
    }

    // 6. Construct Result
    const result: ValuationResult = {
      id: input.valuationId || 'VALUATION-ID',
      make: vehicleDetails.make,
      model: vehicleDetails.model,
      year: vehicleDetails.year,
      mileage: input.mileage || 0,
      condition: input.condition || 'Good',
      zipCode: input.zipCode || '90210',
      estimatedValue: valuationResult.estimatedValue,
      confidenceScore: valuationResult.confidenceScore,
      adjustments: valuationResult.adjustments.map((adj: AdjustmentBreakdown) => ({
        factor: adj.factor || adj.name,
        impact: adj.impact || adj.value,
        description: adj.description || ""
      })),
      priceRange: valuationResult.priceRange,
      isPremium: isPremiumUser,
      photoScore,
      bestPhotoUrl: bestPhotoUrl || null,
      aiCondition: aiCondition ? {
        condition: (aiCondition.condition as "Excellent" | "Good" | "Fair" | "Poor"),
        confidenceScore: aiCondition.confidenceScore,
        issuesDetected: aiCondition.issuesDetected || []
      } : undefined,
      explanation,
      vin: input.vin,
      features: input.features
    };

    // 7. Generate and Download PDF (if premium)
    if (isPremiumUser) {
      try {
        // Convert to ReportData format
        const reportData: ReportData = {
          make: result.make,
          model: result.model,
          year: result.year,
          mileage: result.mileage,
          condition: result.condition,
          zipCode: result.zipCode,
          estimatedValue: result.estimatedValue,
          confidenceScore: result.confidenceScore || 80,
          features: result.features || [],
          valuationId: result.id,
          adjustments: result.adjustments?.map(adj => ({
            name: adj.name || adj.factor || "",
            value: adj.value,
            percentAdjustment: adj.percentAdjustment,
            description: adj.description || ""
          })) || [],
          aiCondition: result.aiCondition,
          bestPhotoUrl: result.bestPhotoUrl || undefined,
          explanation: result.explanation,
          vin: result.vin
        };
        
        await downloadPdf(reportData);
      } catch (pdfError: any) {
        console.error('PDF generation failed:', pdfError);
      }
    }

    return result;

  } catch (error: any) {
    console.error('Valuation failed:', error);
    throw new Error(`Valuation failed: ${error.message}`);
  }
}
