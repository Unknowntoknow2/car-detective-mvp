
import { DecodedVehicleInfo } from '@/types/vehicle';
import { generatePdf } from './pdf/pdfGenerator';
import { ReportData } from './pdf/types';

/**
 * Generates a PDF valuation report for a vehicle
 * @param params Object containing vehicle information, valuation, explanation and comparable listings
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(params: {
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
}): Promise<Uint8Array> {
  // Convert the params to the expected ReportData format
  const reportData: ReportData = {
    vin: params.vehicle.vin || 'Unknown',
    make: params.vehicle.make,
    model: params.vehicle.model,
    year: params.vehicle.year,
    mileage: params.vehicle.mileage?.toString() || '0',
    condition: params.vehicle.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' || 'Good',
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
    photoExplanation: params.photoExplanation
  };
  
  return generatePdf(reportData);
}
