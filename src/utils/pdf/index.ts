import { ReportData } from './types';
import { generateBasicReport } from './generators/basicReportGenerator';
import { generatePremiumReport } from './generators/premiumReportGenerator';

/**
 * Downloads a PDF report with the given data
 */
export async function downloadPdf(data: ReportData): Promise<void> {
  try {
    const pdfBytes = await generatePdf(data);
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.make}_${data.model}_valuation_report.pdf`;
    
    // Append to the document and trigger a click
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generates a PDF report with the given data
 */
export async function generatePdf(data: ReportData): Promise<Uint8Array> {
  try {
    // Use the premium generator if this is a premium report
    if (data.isPremium) {
      return await generatePremiumReport(data);
    }
    
    // Otherwise use the basic generator
    return await generateBasicReport(data);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Helper function to convert vehicle info to report data format
 */
export function convertVehicleInfoToReportData(vehicleInfo: any, estimatedValue: number): ReportData {
  return {
    make: vehicleInfo.make || '',
    model: vehicleInfo.model || '',
    year: vehicleInfo.year || '',
    mileage: vehicleInfo.mileage || '',
    vin: vehicleInfo.vin || '',
    plate: vehicleInfo.plate || '',
    state: vehicleInfo.state || '',
    color: vehicleInfo.color || '',
    estimatedValue: estimatedValue || 0,
    fuelType: vehicleInfo.fuelType || '',
    condition: vehicleInfo.condition || '',
    location: vehicleInfo.location || '',
    transmission: vehicleInfo.transmission || '',
    zipCode: vehicleInfo.zipCode || '',
    bodyType: vehicleInfo.bodyType || '',
  };
}

// Re-export from pdfGeneratorService for backward compatibility
export { generateBasicReport as generateValuationPdf, generatePremiumReport } from './pdfGeneratorService';
