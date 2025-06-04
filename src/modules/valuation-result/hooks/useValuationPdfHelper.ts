<<<<<<< HEAD

import { useState } from 'react';
import { AICondition } from '@/types/photo';
=======
import { useState } from "react";
import { ValuationResult } from "@/types/valuation";
import { AICondition } from "@/types/photo";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface UseValuationPdfHelperProps {
  valuationData: any;
  conditionData: AICondition | null;
  isPremium?: boolean;
}

<<<<<<< HEAD
export const useValuationPdfHelper = ({
  valuationData,
  conditionData,
  isPremium
}: UseValuationPdfHelperProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    if (!valuationData) {
      console.error('No valuation data available');
=======
export function useValuationPdfHelper({
  valuationData,
  conditionData,
}: UseValuationPdfHelperProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async (): Promise<void> => {
    if (!valuationData) {
      console.error("Cannot download PDF: No valuation data");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return;
    }

    setIsDownloading(true);

    try {
<<<<<<< HEAD
      // Simulate PDF generation (would be actual implementation in real code)
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('PDF downloaded with data:', { valuationData, conditionData, isPremium });
      
      // In a real implementation, this would generate and download the PDF
=======
      // Simulating PDF download for now
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("PDF would be downloaded for:", valuationData.id);

      // In a real implementation, this would call an API to generate and download a PDF
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
<<<<<<< HEAD
    isGenerating,
    handleDownloadPdf
=======
    handleDownloadPdf,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};

export default useValuationPdfHelper;
