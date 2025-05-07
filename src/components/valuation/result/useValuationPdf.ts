import { useState } from 'react';
import { toast } from 'sonner';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { AICondition } from '@/types/photo';

interface UseValuationPdfParams {
  valuationData: {
    id: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    zipCode: string;
    estimatedValue: number;
    confidenceScore: number;
    adjustments?: { factor: string; impact: number; description: string }[];
    transmission?: string;
    fuelType?: string;
    explanation?: string;
  } | null;
  conditionData: AICondition | null;
}

export const useValuationPdf = ({ valuationData, conditionData }: UseValuationPdfParams) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!valuationData) return;
    
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: valuationData.id || 'VALUATION-ID',
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        transmission: 'transmission' in valuationData ? valuationData.transmission || 'Not Specified' : 'Not Specified',
        condition: valuationData.condition,
        zipCode: valuationData.zipCode
      };

      // Prepare valuation data for PDF generation
      const valuationReportData = {
        estimatedValue: valuationData.estimatedValue,
        mileage: valuationData.mileage, // Changed from string to number to match expected type
        condition: valuationData.condition,
        zipCode: valuationData.zipCode,
        confidenceScore: valuationData.confidenceScore || 75,
        adjustments: valuationData.adjustments || [],
        fuelType: 'fuelType' in valuationData ? valuationData.fuelType || 'Not Specified' : 'Not Specified',
        explanation: 'explanation' in valuationData ? valuationData.explanation || 'Detailed valuation report for your vehicle' : 'Detailed valuation report for your vehicle',
        aiCondition: conditionData
      };

      // Convert to report data format
      const reportData = convertVehicleInfoToReportData(vehicleInfo, valuationReportData);
      
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
