
import { useState } from 'react';
import { ValuationResult } from '@/types/valuation';
import { AICondition } from '@/types/photo';
import { ReportData } from '@/utils/pdf/types';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/use-toast';

interface UseValuationPdfProps {
  valuationData: ValuationResult | null;
  conditionData: AICondition | null;
  isPremium?: boolean;
}

export const useValuationPdf = ({
  valuationData,
  conditionData,
  isPremium = false
}: UseValuationPdfProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownloadPdf = async () => {
    if (!valuationData) {
      toast({
        description: "No valuation data available.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Format data for PDF generation - handling both naming conventions
      const reportData: ReportData = {
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Unknown',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        estimatedValue: valuationData.estimated_value || valuationData.estimatedValue || 0,
        zipCode: valuationData.zipCode || valuationData.zip_code || valuationData.zip || '',
        vin: valuationData.vin || '',
        fuelType: valuationData.fuelType || valuationData.fuel_type || '',
        transmission: valuationData.transmission || '',
        color: valuationData.color || '',
        bodyStyle: valuationData.bodyType || valuationData.bodyStyle || '', 
        confidenceScore: valuationData.confidence_score || valuationData.confidenceScore || 75,
        // Convert adjustments to match ReportData format
        adjustments: valuationData.adjustments?.map((adj: any) => ({
          factor: adj.factor || '',
          impact: adj.impact || 0,
          description: adj.description || ''
        })) || [],
        generatedDate: new Date(),
        // Add AI condition data
        aiCondition: conditionData || {
          condition: 'Unknown',
          confidenceScore: 0,
          issuesDetected: [],
          summary: 'No condition data available'
        }
      };
      
      // Add best photo URL if available
      if (valuationData.bestPhotoUrl || valuationData.photo_url) {
        reportData.bestPhotoUrl = valuationData.bestPhotoUrl || valuationData.photo_url;
      }
      
      // Generate the PDF
      const pdfBytes = await generateValuationPdf(reportData);
      
      // Create file name
      const fileName = `${reportData.make}_${reportData.model}_Valuation_${Date.now()}.pdf`;
      
      // Create a blob and save/download the file
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(pdfBlob, fileName);
      
      toast({
        description: "Valuation PDF downloaded successfully."
      });
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  // New method to download a sample PDF report
  const downloadSamplePdf = async () => {
    setIsGenerating(true);
    
    try {
      // Create sample report data
      const sampleReportData: ReportData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 35000,
        estimatedValue: 22500,
        zipCode: '90210',
        vin: 'SAMPLE4T1BF1FK7CU123456',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        color: 'Silver',
        bodyStyle: 'Sedan',
        confidenceScore: 92,
        adjustments: [
          { factor: 'Mileage', impact: -500, description: 'Lower than average mileage for this model year' },
          { factor: 'Condition', impact: 1200, description: 'Excellent overall condition' },
          { factor: 'Market Demand', impact: 800, description: 'High demand in your region' },
          { factor: 'Service History', impact: 300, description: 'Complete service records' }
        ],
        generatedDate: new Date(),
        aiCondition: {
          condition: 'Excellent',
          confidenceScore: 95,
          issuesDetected: [],
          summary: 'Vehicle appears to be in excellent condition with no visible damage.'
        },
        bestPhotoUrl: 'https://img.freepik.com/free-photo/white-premium-business-sedan-car-driving-bridge-road_53876-126228.jpg',
        // Add sample flag to indicate this is a sample report
        isSample: true,
        premium: true
      };
      
      // Generate the PDF with sample data
      const pdfBytes = await generateValuationPdf(sampleReportData, {
        watermark: 'SAMPLE REPORT',
        isPremium: true
      });
      
      // Create file name for sample
      const fileName = `Sample_Valuation_Report_${Date.now()}.pdf`;
      
      // Create a blob and save/download the file
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(pdfBlob, fileName);
      
      toast({
        description: "Sample PDF report downloaded successfully."
      });
      return true;
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      toast({
        description: "Failed to generate the sample PDF. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    isGenerating,
    handleDownloadPdf,
    downloadSamplePdf
  };
};

export default useValuationPdf;
