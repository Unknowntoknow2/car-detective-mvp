
import { DecodedVehicleInfo } from '@/types/vehicle';
import { generatePdf } from './pdf/pdfGenerator';
import { ReportData } from './pdf/types';
import { generateValuationNarrative } from './pdf/sections/valuationSummary';

interface PdfDownloadParams {
  vehicle: DecodedVehicleInfo;
  valuation: number;
  explanation: string;
  explanationText?: string;
  comparables?: { source: string; price: number; date: string }[];
  valuationId?: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  photoExplanation?: string;
  adjustments?: Array<{ factor: string; impact: number; description?: string }>;
}

/**
 * Generates a PDF valuation report for a vehicle
 * @param params Object containing vehicle information, valuation, explanation and comparable listings
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(params: PdfDownloadParams): Promise<Uint8Array> {
  // Convert the params to the expected ReportData format
  const reportData: ReportData = {
    vin: params.vehicle.vin || 'Unknown',
    make: params.vehicle.make,
    model: params.vehicle.model,
    year: params.vehicle.year,
    mileage: params.vehicle.mileage?.toString() || '0',
    condition: (params.vehicle.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor') || 'Good',
    zipCode: params.vehicle.zipCode || '',
    estimatedValue: params.valuation,
    confidenceScore: 85, // Default value
    color: params.vehicle.color || 'Not Specified',
    bodyStyle: params.vehicle.bodyType || 'Not Specified',
    bodyType: params.vehicle.bodyType || 'Not Specified',
    fuelType: params.vehicle.fuelType || 'Not Specified',
    explanation: params.explanation,
    isPremium: false,
    valuationId: params.valuationId,
    aiCondition: params.aiCondition ? {
      condition: params.aiCondition.condition || 'Good',
      confidenceScore: params.aiCondition.confidenceScore,
      issuesDetected: params.aiCondition.issuesDetected || [],
      aiSummary: params.aiCondition.aiSummary || ''
    } : null,
    bestPhotoUrl: params.bestPhotoUrl,
    photoExplanation: params.photoExplanation,
    adjustments: params.adjustments || []
  };
  
  // Generate the valuation narrative if not provided
  if (!reportData.narrative) {
    try {
      // Calculate base price
      const basePrice = params.adjustments && params.adjustments.length > 0 
        ? params.valuation - params.adjustments.reduce((sum, adj) => sum + adj.impact, 0)
        : params.valuation;
        
      const narrative = await generateValuationNarrative({
        make: params.vehicle.make,
        model: params.vehicle.model,
        year: params.vehicle.year,
        mileage: params.vehicle.mileage || 0,
        zipCode: params.vehicle.zipCode || '',
        condition: params.vehicle.condition || 'Good',
        basePrice: basePrice,
        adjustedPrice: params.valuation,
        confidenceScore: params.aiCondition?.confidenceScore || 85,
        photoExplanation: params.photoExplanation,
        fuelType: params.vehicle.fuelType,
        transmission: params.vehicle.transmission
      });
      
      reportData.narrative = narrative;
    } catch (error) {
      console.error("Error generating narrative:", error);
      // Continue without narrative if generation fails
    }
  }
  
  return generatePdf(reportData);
}
