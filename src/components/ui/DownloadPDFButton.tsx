import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface PDFDownloadButtonProps {
  valuationResult: any;
  isPremium: boolean;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ valuationResult, isPremium }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const pdfBlob = await generateValuationPdf(valuationResult, isPremium);
      const { make, model, year } = valuationResult;
      const filename = `ValuationReport-${year}-${make}-${model}.pdf`;
      
      // Extract file size from the blob
      const fileSize = pdfBlob.size;
      const size = fileSize || 0;

      console.log(`PDF generated successfully with size: ${size} bytes`);
      saveAs(pdfBlob, filename);
      toast.success('PDF report downloaded successfully!');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" disabled={isLoading} onClick={handleDownload}>
      {isLoading ? (
        <>
          <Download className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Report (PDF)
        </>
      )}
    </Button>
  );
};
