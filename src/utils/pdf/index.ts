
import { ReportData } from './types';
import { generateValuationPdf } from './generateValuationPdf';
import { convertNewAdjustmentsToLegacyFormat } from '../formatters/adjustment-formatter';

/**
 * Generates and downloads a PDF report
 */
export async function downloadPdf(
  data: ReportData, 
  options: any = {}
): Promise<void> {
  try {
    // Generate the PDF
    const pdfBytes = await generateValuationPdf(data, options);
    
    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create an object URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `valuation-report-${data.make}-${data.model}-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

/**
 * Converts vehicle info to report data format
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: any,
  additionalData: {
    mileage?: number;
    estimatedValue?: number;
    condition?: string;
    zipCode?: string;
    confidenceScore?: number;
    adjustments?: Array<{
      factor: string;
      impact: number;
      description?: string;
    }>;
    aiCondition?: any;
    isPremium?: boolean;
  } = {}
): ReportData {
  // Create a basic report data object from vehicle info
  const reportData: ReportData = {
    make: vehicleInfo.make || '',
    model: vehicleInfo.model || '',
    year: vehicleInfo.year || 0,
    vin: vehicleInfo.vin || '',
    mileage: additionalData.mileage || 0,
    condition: additionalData.condition || 'Good',
    zipCode: additionalData.zipCode || '',
    estimatedValue: additionalData.estimatedValue || 0,
    confidenceScore: additionalData.confidenceScore || 80,
    adjustments: additionalData.adjustments ? convertNewAdjustmentsToLegacyFormat(additionalData.adjustments) : [],
    aiCondition: additionalData.aiCondition || null,
    isPremium: additionalData.isPremium || false
  };
  
  return reportData;
}
