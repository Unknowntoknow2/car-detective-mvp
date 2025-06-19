
import { ReportData } from "@/types/valuation";
import { generateValuationPdf as generatePdf } from "./pdf/generateValuationPdf";

export async function generateValuationPdf(
  data: any,
  options: {
    isPremium?: boolean;
    includeBranding?: boolean;
    includeAIScore?: boolean;
    includeFooter?: boolean;
    includeTimestamp?: boolean;
    includePhotoAssessment?: boolean;
  } = {},
): Promise<Uint8Array> {
  const reportData: ReportData = {
    id: data.id || 'unknown',
    make: data.make || 'Unknown',
    model: data.model || 'Unknown',
    year: data.year || new Date().getFullYear(),
    mileage: data.mileage || 0,
    condition: data.condition || 'Good',
    estimatedValue: data.estimatedValue || 0,
    price: data.price || data.estimatedValue || 0,
    confidenceScore: data.confidenceScore || 0,
    zipCode: data.zipCode || '',
    adjustments: data.adjustments || [],
    generatedAt: new Date().toISOString(),
    priceRange: data.priceRange || [0, 0],
    vin: data.vin
  };

  return await generatePdf(reportData, options);
}

export const downloadValuationPdf = async (
  data: Partial<ReportData>,
  fileName?: string
): Promise<void> => {
  try {
    const pdfBuffer = await generateValuationPdf(data);
    
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `Valuation_${data.make}_${data.model}_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading valuation PDF:', error);
    throw error;
  }
};
