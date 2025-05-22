
import { ReportData } from './types';
import { generateBasicValuationReport } from './generators/basicReportGenerator';
import { generatePremiumReport } from './generators/premiumReportGenerator';

/**
 * Generate a PDF for the valuation report
 * @param data The report data to include in the PDF
 * @returns A buffer containing the PDF data
 */
export const generateValuationPdf = async (data: ReportData): Promise<Buffer> => {
  try {
    // Determine which report generator to use based on isPremium flag
    const doc = data.isPremium 
      ? await generatePremiumReport(data)
      : await generateBasicValuationReport(data);
    
    // Finalize the document and convert to buffer
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      
      doc.on('error', (err: Error) => {
        reject(err);
      });
      
      doc.end();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Return a simple buffer for error cases
    return Buffer.from('Error generating PDF');
  }
};

/**
 * Download a PDF for the valuation report
 * @param data The report data to include in the PDF
 * @param fileName Optional custom filename
 */
export const downloadValuationPdf = async (
  data: ReportData,
  fileName?: string
): Promise<void> => {
  try {
    const pdfBuffer = await generateValuationPdf(data);
    
    // Create a blob from the PDF data
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `CarDetective_Valuation_${data.make}_${data.model}_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revoObjectURL(url);
  } catch (error) {
    console.error('Error downloading valuation PDF:', error);
    throw error;
  }
};
