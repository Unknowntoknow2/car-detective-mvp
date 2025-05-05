
import { ReportData } from './types';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ValuationResult } from '@/utils/valuation/types';
import { generateValuationPdf } from './pdfGenerator';

/**
 * Downloads a PDF report with the provided data
 * @param data The data to include in the PDF
 */
export async function downloadPdf(data: ReportData): Promise<void> {
  try {
    // Generate the PDF
    const pdfBytes = await generateValuationPdf(data);
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.make}-${data.model}-${data.year}-valuation.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

/**
 * Converts vehicle info and valuation data to the report data format
 * @param vehicleInfo Vehicle information
 * @param valuationData Valuation data or a simple number for backward compatibility
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo,
  valuationData: number | {
    estimatedValue: number;
    mileage: string | number;
    condition: string;
    zipCode: string;
    confidenceScore: number | null;
    adjustments?: any[];
    fuelType?: string;
    isPremium?: boolean;
    explanation?: string;
    aiCondition?: {
      condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
      confidenceScore: number;
      issuesDetected?: string[];
      aiSummary?: string;
    } | null;
  }
): ReportData {
  // Handle simple number case (for backward compatibility)
  if (typeof valuationData === 'number') {
    return {
      vin: vehicleInfo.vin,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      mileage: vehicleInfo.mileage || 0,
      condition: vehicleInfo.condition || 'Not Specified',
      zipCode: vehicleInfo.zipCode || '10001',
      estimatedValue: valuationData,
      confidenceScore: 85, // Default confidence score
      fuelType: vehicleInfo.fuelType,
      color: vehicleInfo.color,
      bodyStyle: vehicleInfo.bodyType,
      bodyType: vehicleInfo.bodyType,
      isPremium: false,
      plate: vehicleInfo.plate,
      state: vehicleInfo.state
    };
  }
  
  // Handle object case
  return {
    vin: vehicleInfo.vin,
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: valuationData.mileage,
    condition: valuationData.condition,
    zipCode: valuationData.zipCode,
    estimatedValue: valuationData.estimatedValue,
    confidenceScore: valuationData.confidenceScore,
    fuelType: valuationData.fuelType || vehicleInfo.fuelType,
    color: vehicleInfo.color,
    bodyStyle: vehicleInfo.bodyType,
    bodyType: vehicleInfo.bodyType,
    explanation: valuationData.explanation,
    isPremium: valuationData.isPremium || false,
    aiCondition: valuationData.aiCondition,
    plate: vehicleInfo.plate,
    state: vehicleInfo.state
  };
}
