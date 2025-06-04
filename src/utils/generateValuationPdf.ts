<<<<<<< HEAD

import { ReportData } from './pdf/types';

// Define the interface for the adjustment type
interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}
=======
import { FormData } from "@/types/premium-valuation";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Generates a PDF for the valuation report
 * @param data The report data
 * @param options Additional options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(
<<<<<<< HEAD
  data: Partial<ReportData>, 
=======
  data: FormData,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  options: {
    isPremium?: boolean;
    includeBranding?: boolean;
    includeAIScore?: boolean;
    includeFooter?: boolean;
    includeTimestamp?: boolean;
    includePhotoAssessment?: boolean;
<<<<<<< HEAD
    includeExplanation?: boolean;
    includeAuctionData?: boolean;
    includeCompetitorPricing?: boolean;
    includeAINSummary?: boolean;
  } = {}
=======
  } = {},
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
): Promise<Uint8Array> {
  const defaultOptions = {
    isPremium: false,
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true,
<<<<<<< HEAD
    includeExplanation: false,
    includeAuctionData: false,
    includeCompetitorPricing: false,
    includeAINSummary: false
=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // For premium reports, we would include additional data and formatting
  if (mergedOptions.isPremium) {
    console.log("Generating premium PDF with enhanced data for:", data);
    // In a real implementation, we would use pdf-lib or a similar library
    // to create a more detailed and styled PDF for premium users
<<<<<<< HEAD
=======

    // This is where we would add premium-only sections like:
    // - CARFAX report data
    // - Detailed market analysis
    // - AI condition assessment with photos
    // - Dealer comparison pricing
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  } else {
    console.log("Generating basic PDF for:", data);
  }
<<<<<<< HEAD
  
  // Handle adjustments safely with optional chaining
  const adjustments: Adjustment[] = data.adjustments 
    ? data.adjustments.map((adj: Adjustment) => ({
        factor: adj.factor,
        impact: adj.impact,
        description: adj.description || ""
      }))
    : [];
  
=======

  // Add adjustments with default empty description if needed
  const adjustments = data.adjustments?.map((adj) => ({
    factor: adj.factor,
    impact: adj.impact,
    description: adj.description || "",
  })) || [];

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  // Return dummy data for now
  return new Uint8Array([0]); // Placeholder
}

/**
 * Download a PDF for the valuation report
 * @param data The report data to include in the PDF
 * @param fileName Optional custom filename
 */
export const downloadValuationPdf = async (
  data: Partial<ReportData>,
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
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading valuation PDF:', error);
    throw error;
  }
};
