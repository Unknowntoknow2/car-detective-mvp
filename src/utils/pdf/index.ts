
import { ReportData } from './types';
import { downloadValuationPdf, openValuationPdf } from './generateValuationPdf';

export interface ValuationReportInput {
  mileage: number;
  estimatedValue: number;
  confidenceScore: number;
  condition: string;
  zipCode: string;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  isPremium?: boolean;
}

export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  vin?: string;
  transmission?: string;
  state?: string;
}

/**
 * Convert vehicle info to report data
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo, 
  valuationData: ValuationReportInput
): ReportData {
  const reportData: ReportData = {
    // Vehicle information
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    vin: vehicleInfo.vin,
    mileage: valuationData.mileage,
    
    // Valuation information
    estimatedValue: valuationData.estimatedValue,
    confidenceScore: valuationData.confidenceScore,
    
    // Location information
    zipCode: valuationData.zipCode,
    
    // Condition information
    aiCondition: {
      condition: valuationData.condition,
      confidenceScore: valuationData.confidenceScore,
      issuesDetected: [],
      summary: `Vehicle is in ${valuationData.condition} condition.`
    },
    
    // Additional information
    adjustments: valuationData.adjustments,
    transmission: vehicleInfo.transmission,
    premium: valuationData.isPremium,
    generatedDate: new Date()
  };
  
  return reportData;
}

// Export the PDF functions
export const downloadPdf = downloadValuationPdf;
export const openPdf = openValuationPdf;
