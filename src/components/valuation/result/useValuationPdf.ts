
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';

interface UseValuationPdfParams {
  valuationData: any;
  conditionData?: any;
}

export function useValuationPdf({ valuationData, conditionData }: UseValuationPdfParams) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!valuationData) {
      toast.error("No valuation data available to generate PDF");
      return;
    }

    try {
      setIsDownloading(true);
      
      // Format the report data
      const reportData = {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        condition: valuationData.condition,
        estimatedValue: valuationData.estimatedValue,
        priceRange: valuationData.priceRange,
        confidenceScore: valuationData.confidenceScore,
        adjustments: valuationData.adjustments || [],
        generatedAt: new Date().toISOString(),
        zipCode: valuationData.zipCode,
        bestPhotoUrl: valuationData.bestPhotoUrl,
        photoScore: valuationData.photoScore,
        isPremium: valuationData.isPremium,
        aiCondition: conditionData,
        explanation: valuationData.explanation,
      };

      // Generate PDF
      const pdfBytes = await generateValuationPdf(reportData);
      
      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Create a sanitized filename
      const sanitizedMake = valuationData.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
      const sanitizedModel = valuationData.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
      const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;
      
      // Trigger the download
      saveAs(pdfBlob, filename);
      
      toast.success("PDF report downloaded successfully");
      
      // Track the download in analytics
      try {
        // Basic analytics event tracking
        console.log("PDF download completed", {
          valuationId: valuationData.id,
          isPremium: valuationData.isPremium
        });
      } catch (analyticsError) {
        console.error("Failed to track PDF download event", analyticsError);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownloadPdf
  };
}
