
import { ReportData, ReportOptions } from './types';

/**
 * Generates a PDF for the valuation report by calling the Supabase Edge Function
 * @param reportData The valuation data to include in the PDF
 * @param options Additional options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(
  reportData: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  try {
    // Call the Supabase Edge Function to generate the PDF
    const response = await fetch(
      'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/generate-valuation-pdf',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`
        },
        body: JSON.stringify({
          valuationId: reportData.id,
          userId: reportData.userId || localStorage.getItem('supabase.auth.user.id') || ''
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    const data = await response.json();

    // If the response contains a URL, fetch and return the PDF
    if (data.url) {
      const pdfResponse = await fetch(data.url);
      if (!pdfResponse.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const pdfBlob = await pdfResponse.blob();
      return new Uint8Array(await pdfBlob.arrayBuffer());
    }

    throw new Error('No PDF URL returned from server');
  } catch (error) {
    console.error('Error generating valuation PDF:', error);
    throw error;
  }
}

/**
 * Helper function to download the PDF directly in the browser
 * @param reportData The valuation data
 * @param fileName Optional custom filename
 */
export async function downloadValuationPdf(
  reportData: ReportData,
  fileName?: string
): Promise<void> {
  try {
    const pdfBytes = await generateValuationPdf(reportData);
    
    // Create a blob from the PDF data
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `CarDetective_Valuation_${reportData.make}_${reportData.model}_${Date.now()}.pdf`;
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
