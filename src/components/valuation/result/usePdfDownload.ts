
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';

interface UsePdfDownloadProps {
  valuationId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
  explanation: string;
  confidenceScore?: number;
  conditionData?: any;
  adjustments?: any[];
}

export const usePdfDownload = ({
  valuationId,
  make,
  model,
  year,
  mileage,
  condition,
  location,
  valuation,
  explanation,
  confidenceScore = 80,
  conditionData,
  adjustments = []
}: UsePdfDownloadProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: valuationId || 'MANUAL-ENTRY',
        make,
        model,
        year,
        mileage,
        transmission: 'Unknown', // Default value
        condition,
        zipCode: location
      };

      // Prepare valuation data for PDF generation
      const valuationData = {
        estimatedValue: valuation,
        mileage: mileage.toString(),
        condition,
        zipCode: location,
        confidenceScore,
        adjustments,
        fuelType: 'Not Specified',
        explanation,
        aiCondition: conditionData
      };

      // Convert to report data format
      const reportData = convertVehicleInfoToReportData(vehicleInfo, valuationData);
      
      // Generate and download the PDF
      await downloadPdf(reportData);
      toast.success("PDF report downloaded successfully");
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
};
