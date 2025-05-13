
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { saveAs } from 'file-saver';

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadValuationPdf = async (valuationData: any) => {
    try {
      setIsDownloading(true);
      
      // Call the edge function to generate the PDF data
      const { data, error } = await supabase.functions.invoke('generate-valuation-pdf', {
        body: {
          valuationId: valuationData.id,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.success) {
        throw new Error('Failed to generate PDF data');
      }
      
      // In a real implementation, the edge function would return PDF bytes
      // For now, we'll simulate PDF generation on the client side
      
      // Create a mock PDF blob
      const mockPdfContent = `Vehicle Valuation Report for ${valuationData.make} ${valuationData.model}`;
      const pdfBlob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      // Create a sanitized filename
      const sanitizedMake = valuationData.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
      const sanitizedModel = valuationData.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
      const sanitizedZip = valuationData.zipCode?.replace(/[^a-z0-9]/gi, '') || '';
      const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${sanitizedZip}.pdf`;
      
      // Trigger the download
      saveAs(pdfBlob, filename);
      
      toast.success("Valuation report downloaded successfully");
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
