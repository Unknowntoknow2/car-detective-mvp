
import { useState } from 'react';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { toast } from 'sonner';
import { ReportData, ReportOptions } from '@/utils/pdf/types';
import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadValuationPdf = async (
    valuation: ValuationResult, 
    options: Partial<ReportOptions> = {}
  ) => {
    try {
      setIsDownloading(true);
      
      // Convert ValuationResult to ReportData
      const reportData: ReportData = {
        vin: valuation.vin,
        make: valuation.make,
        model: valuation.model,
        year: valuation.year,
        mileage: valuation.mileage,
        condition: valuation.condition,
        zipCode: valuation.zipCode,
        estimatedValue: valuation.estimatedValue,
        priceRange: valuation.priceRange || [
          Math.round(valuation.estimatedValue * 0.95),
          Math.round(valuation.estimatedValue * 1.05)
        ],
        confidenceScore: valuation.confidenceScore || 80,
        adjustments: valuation.adjustments?.map(adj => ({
          name: adj.factor,
          value: adj.impact,
          description: adj.description || '',
          percentAdjustment: Math.round((adj.impact / valuation.estimatedValue) * 100 * 100) / 100
        })) || [],
        aiCondition: valuation.aiCondition ? {
          condition: valuation.aiCondition.condition as "Excellent" | "Good" | "Fair" | "Poor",
          confidenceScore: valuation.aiCondition.confidenceScore,
          issuesDetected: valuation.aiCondition.issuesDetected || []
        } : undefined,
        bestPhotoUrl: valuation.bestPhotoUrl,
        explanation: valuation.explanation,
        features: valuation.features || [],
        valuationId: valuation.id
      };
      
      const pdf = await generateValuationPdf(reportData, {
        includeBranding: true,
        includeAIScore: !!valuation.aiCondition,
        includeFooter: true,
        includeTimestamp: true,
        includePhotoAssessment: !!valuation.bestPhotoUrl,
        isPremium: valuation.isPremium
      });
      
      // Create a blob from the PDF Uint8Array
      const blob = new Blob([pdf], { type: 'application/pdf' });
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `valuation-${valuation.make}-${valuation.model}-${valuation.year}.pdf`;
      
      // Append link to the body
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadValuationPdf,
    isDownloading
  };
}
