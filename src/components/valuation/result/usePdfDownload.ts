
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { generateValuationPdf } from '@/utils/generateValuationPdf';
import { AICondition } from '@/types/photo';

interface PdfDownloadParams {
  valuationId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
  explanation?: string;
  confidenceScore?: number;
  conditionData?: AICondition | null;
  adjustments?: { factor: string; impact: number; description: string }[];
  bestPhotoUrl?: string;
}

export function usePdfDownload(params: PdfDownloadParams) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Format data for PDF generation
      const vehicle: DecodedVehicleInfo = {
        make: params.make,
        model: params.model,
        year: params.year,
        mileage: params.mileage,
        condition: params.condition,
        zipCode: params.location,
        vin: '',
      };

      // Generate the PDF
      const pdfBytes = await generateValuationPdf({
        vehicle,
        valuation: params.valuation,
        explanation: params.explanation || 'No detailed explanation available.',
        valuationId: params.valuationId,
        aiCondition: params.conditionData,
        bestPhotoUrl: params.bestPhotoUrl
      });

      // Create a blob from the PDF data
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${params.year}-${params.make}-${params.model}-valuation.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownloadPdf };
}
