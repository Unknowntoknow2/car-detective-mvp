
import { ReportData } from './types';
import { generateValuationPdf as generatePdf } from './pdfGeneratorService';

/**
 * Generates a valuation PDF report
 * @param data The report data
 * @returns A promise resolving to the PDF as a Uint8Array
 */
export async function generateValuationPdf(data: ReportData): Promise<Uint8Array> {
  // Ensure year is a number before passing to pdfGeneratorService
  const processedData: ReportData = {
    ...data,
    // Convert year to number if it's a string
    year: typeof data.year === 'string' ? parseInt(data.year, 10) : data.year
  };
  
  return generatePdf(processedData);
}
