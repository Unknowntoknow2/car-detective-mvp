
import { ReportData, ReportOptions } from './types';
import { generatePremiumReport } from './generators/premiumReportGenerator';

/**
 * Generate a PDF for the valuation report
 * @param data The report data
 * @param options Additional options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(
  data: ReportData, 
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Always use the premium generator, but customize based on options
  return await generatePremiumReport(data, options);
}

/**
 * Download a valuation PDF report
 * @param data Report data
 * @param options PDF generation options
 */
export async function downloadValuationPdf(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<void> {
  try {
    // Generate the PDF
    const pdfBytes = await generateValuationPdf(data, options);
    
    // Create a blob from the PDF data
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    
    // Create a sanitized filename
    const sanitizedMake = data.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
    const sanitizedModel = data.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
    const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading valuation PDF:', error);
    throw error;
  }
}

/**
 * Convert vehicle info to report data
 * @param vehicleInfo Vehicle information
 * @param valuationData Valuation data
 * @returns Report data object
 */
export function convertVehicleInfoToReportData(
  vehicleInfo: any, 
  valuationData: any
): ReportData {
  return {
    make: vehicleInfo.make || '',
    model: vehicleInfo.model || '',
    year: vehicleInfo.year || 0,
    vin: vehicleInfo.vin || '',
    mileage: valuationData.mileage || 0,
    condition: valuationData.condition || 'Good',
    estimatedValue: valuationData.estimatedValue || 0,
    confidenceScore: valuationData.confidenceScore || 75,
    zipCode: valuationData.zipCode || '',
    adjustments: valuationData.adjustments || [],
    generatedAt: new Date().toISOString(),
    transmission: vehicleInfo.transmission || '',
    trim: vehicleInfo.trim || '',
    color: vehicleInfo.color || '',
    fuelType: vehicleInfo.fuelType || '',
    bodyStyle: vehicleInfo.bodyStyle || '',
    photoUrl: valuationData.photoUrl || '',
    aiCondition: valuationData.aiCondition || null,
  };
}

// Export a function to download PDFs directly
export function downloadPdf(data: ReportData, options: Partial<ReportOptions> = {}): Promise<void> {
  return downloadValuationPdf(data, options);
}
