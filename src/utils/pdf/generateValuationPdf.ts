
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { ReportData, ReportOptions } from './types';
import { generateBasicReport } from './generators/basicReportGenerator';
import { generatePremiumReport } from './generators/premiumReportGenerator';

/**
 * Default options for PDF generation
 */
export const defaultReportOptions: ReportOptions = {
  includeBranding: true,
  includeExplanation: true,
  includePhotoAssessment: true,
  watermark: false,
  fontSize: 12,
  pdfQuality: 'standard',
};

/**
 * Generate a valuation PDF with the given data and options
 */
export async function generateValuationPdf(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Merge provided options with defaults
  const mergedOptions: ReportOptions = {
    ...defaultReportOptions,
    ...options,
  };
  
  // Set watermark if this is a sample report
  if (data.isSample) {
    mergedOptions.watermark = mergedOptions.watermark || 'SAMPLE REPORT';
  }
  
  // Choose the appropriate generator based on premium flag
  const pdfBytes = data.premium || options.isPremium
    ? await generatePremiumReport({ data, options: mergedOptions, document: PDFDocument })
    : await generateBasicReport(data, mergedOptions);
  
  return pdfBytes;
}

/**
 * Generate and download a valuation PDF
 */
export async function downloadValuationPdf(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<void> {
  try {
    const pdfBytes = await generateValuationPdf(data, options);
    
    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Generate a filename based on the vehicle info
    const filename = `${data.year}_${data.make}_${data.model}_Valuation.pdf`;
    
    // Download the PDF
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generate and open a valuation PDF in a new tab
 */
export async function openValuationPdf(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<void> {
  try {
    const pdfBytes = await generateValuationPdf(data, options);
    
    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Open the URL in a new tab
    window.open(url, '_blank');
    
    // Clean up the URL after a delay to ensure it's loaded
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 30000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
