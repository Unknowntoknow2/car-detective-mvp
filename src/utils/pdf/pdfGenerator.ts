
import { ReportData } from './types';
import { generateValuationPdf as generatePdf } from './pdfGeneratorService';

/**
 * Generates a valuation PDF report
 * @param data The report data
 * @returns A promise resolving to the PDF as a Uint8Array
 */
export async function generateValuationPdf(data: ReportData): Promise<Uint8Array> {
  return generatePdf(data);
}
