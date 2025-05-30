
import { ReportData } from './types';
import { injectMarketplaceListingsToPDF } from './injectMarketplaceListingsToPDF';

// Define the interface for the adjustment type
interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  platform: string;
  location: string;
  url: string;
  mileage?: number;
  created_at: string;
}

/**
 * Generates a PDF for the valuation report
 * @param data The report data
 * @param options Additional options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateValuationPdf(
  data: Partial<ReportData>, 
  options: {
    isPremium?: boolean;
    includeBranding?: boolean;
    includeAIScore?: boolean;
    includeFooter?: boolean;
    includeTimestamp?: boolean;
    includePhotoAssessment?: boolean;
    includeExplanation?: boolean;
    includeAuctionData?: boolean;
    includeCompetitorPricing?: boolean;
    includeAINSummary?: boolean;
    watermark?: string;
    trackingId?: string;
    ainSummary?: string;
    enrichedData?: any;
    marketplaceListings?: MarketplaceListing[];
  } = {}
): Promise<Uint8Array> {
  const defaultOptions = {
    isPremium: false,
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true,
    includeExplanation: false,
    includeAuctionData: false,
    includeCompetitorPricing: false,
    includeAINSummary: false
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // For premium reports, we would include additional data and formatting
  if (mergedOptions.isPremium) {
    console.log('Generating premium PDF with enhanced data for:', data);
    // In a real implementation, we would use pdf-lib or a similar library
    // to create a more detailed and styled PDF for premium users
  } else {
    console.log('Generating basic PDF for:', data);
  }
  
  // Handle adjustments safely with optional chaining
  const adjustments: Adjustment[] = data.adjustments 
    ? data.adjustments.map((adj: Adjustment) => ({
        factor: adj.factor,
        impact: adj.impact,
        description: adj.description || ""
      }))
    : [];
  
  // Create a basic PDF structure (mock implementation)
  let pdfBytes = new Uint8Array([0]); // Placeholder - would be actual PDF generation
  
  // Inject marketplace listings if provided
  if (mergedOptions.marketplaceListings && mergedOptions.marketplaceListings.length > 0) {
    console.log('Injecting marketplace listings into PDF:', mergedOptions.marketplaceListings.length);
    try {
      const injectedPdfBytes = await injectMarketplaceListingsToPDF({
        pdfBytes,
        listings: mergedOptions.marketplaceListings,
        estimatedValue: data.estimatedValue || 0,
        maxListings: 5
      });
      // Ensure we return the correct Uint8Array type
      pdfBytes = new Uint8Array(injectedPdfBytes);
    } catch (error) {
      console.error('Failed to inject marketplace listings into PDF:', error);
      // Continue without marketplace data rather than failing completely
    }
  }
  
  return pdfBytes;
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
