
import { ReportData, AdjustmentItem } from './types';
import { downloadValuationPdf } from './generateValuationPdf';

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
  // Make sure adjustments have a description
  const formattedAdjustments: AdjustmentItem[] = valuationData.adjustments.map(adj => ({
    factor: adj.factor,
    impact: adj.impact,
    description: adj.description || `Adjustment for ${adj.factor}`
  }));
  
  const reportData: ReportData = {
    // Vehicle information
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    vin: vehicleInfo.vin,
    mileage: valuationData.mileage,
    condition: valuationData.condition || 'Good',
    
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
    adjustments: formattedAdjustments,
    isPremium: valuationData.isPremium,
    generatedAt: new Date().toISOString()
  };
  
  return reportData;
}

// Export the PDF functions
export const downloadPdf = downloadValuationPdf;
