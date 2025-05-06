
import { generatePdf } from './pdfGenerator';
import { ReportData } from './types';

/**
 * Downloads a PDF report
 * @param data The report data
 * @returns Promise that resolves when PDF download is complete
 */
export async function downloadPdf(data: ReportData): Promise<void> {
  try {
    // Generate PDF
    const pdfBytes = await generatePdf(data);
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.year}_${data.make}_${data.model}_report.pdf`;
    
    // Trigger a click on the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

/**
 * Converts vehicle information to report data
 * @param vehicleInfo Vehicle information
 * @param valuationData Valuation data
 * @returns ReportData object
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: {
    vin: string;
    make: string;
    model: string;
    year: number;
    mileage?: number | string;
    transmission?: string;
    condition?: string;
    zipCode?: string;
    bodyType?: string;
    color?: string;
    fuelType?: string;
  },
  valuationData: {
    estimatedValue: number;
    mileage?: string | number;
    condition?: string;
    zipCode?: string;
    confidenceScore?: number;
    adjustments?: Array<{ factor: string, impact: number, description: string }>;
    fuelType?: string;
    explanation?: string;
    isPremium?: boolean;
    aiCondition?: {
      condition: string;
      confidenceScore: number;
      issuesDetected?: string[];
      aiSummary?: string;
    } | null;
    bestPhotoUrl?: string;
  }
): ReportData {
  return {
    vin: vehicleInfo.vin,
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: typeof vehicleInfo.mileage === 'number' 
      ? vehicleInfo.mileage.toString() 
      : vehicleInfo.mileage?.toString() || '0',
    transmission: vehicleInfo.transmission || 'Not Specified',
    condition: valuationData.condition || vehicleInfo.condition || 'Not Specified',
    zipCode: valuationData.zipCode || vehicleInfo.zipCode || '',
    estimatedValue: valuationData.estimatedValue,
    confidenceScore: valuationData.confidenceScore || 80,
    bodyStyle: vehicleInfo.bodyType || 'Not Specified',
    bodyType: vehicleInfo.bodyType || 'Not Specified',
    color: vehicleInfo.color || 'Not Specified',
    fuelType: valuationData.fuelType || vehicleInfo.fuelType || 'Not Specified',
    explanation: valuationData.explanation || '',
    isPremium: valuationData.isPremium || false,
    adjustments: valuationData.adjustments || [],
    aiCondition: valuationData.aiCondition || null,
    bestPhotoUrl: valuationData.bestPhotoUrl
  };
}

export { generatePdf };
export type { ReportData };
