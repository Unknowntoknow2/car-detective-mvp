
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { useMarketplaceComparison } from '@/hooks/useMarketplaceComparison';

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadValuationPdf = async (valuationData: any) => {
    try {
      setIsDownloading(true);
      
      // Get marketplace listings for this valuation
      const { listings } = useMarketplaceComparison({
        vin: valuationData.vin,
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        zipCode: valuationData.zipCode,
        estimatedValue: valuationData.estimatedValue
      });
      
      // Generate PDF with marketplace listings included
      const pdfBytes = await generateValuationPdf(valuationData, {
        isPremium: true,
        includeExplanation: true,
        marketplaceListings: listings
      });
      
      // Create a sanitized filename
      const sanitizedMake = valuationData.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
      const sanitizedModel = valuationData.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
      const sanitizedZip = valuationData.zipCode?.replace(/[^a-z0-9]/gi, '') || '';
      const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${sanitizedZip}.pdf`;
      
      // Create blob and trigger download
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(pdfBlob, filename);
      
      toast.success("Valuation report with marketplace comparison downloaded successfully");
      return true;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download valuation report");
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadValuationPdf,
    isDownloading
  };
}
