
import { useState } from 'react';
import { downloadPdf } from '@/utils/pdf';
import { toast } from 'sonner';
import { ReportData } from '@/utils/pdf/types';

interface UsePdfDownloadProps {
  reportData: ReportData;
  fileName?: string;
}

/**
 * Hook for downloading PDF reports
 */
export function usePdfDownload({ reportData, fileName = 'vehicle-valuation' }: UsePdfDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      setError(null);
      
      // Validate report data
      if (!reportData || !reportData.vin || !reportData.make) {
        throw new Error('Invalid report data');
      }
      
      // Generate filename
      const finalFileName = `${fileName}-${reportData.make}-${reportData.model}-${new Date().getTime()}.pdf`;
      
      // Download the PDF
      await downloadPdf({
        reportData,
        fileName: finalFileName,
        options: {
          includeBranding: true,
          includeAIScore: true,
          includeFooter: true,
          includeTimestamp: true,
          includePhotoAssessment: Boolean(reportData.aiCondition)
        }
      });
      
      toast.success('PDF report downloaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('PDF download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadReport,
    isDownloading,
    error
  };
}
