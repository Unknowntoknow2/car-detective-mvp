
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
        title: "Error",
        description: "No valuation data available.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Format data for PDF generation
      const reportData: ReportData = {
        id: valuationData.id || crypto.randomUUID(),
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Vehicle',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Unknown',
        estimatedValue: valuationData.estimatedValue || valuationData.valuation || 0,
        zipCode: valuationData.zipCode || valuationData.zip || '',
        vin: valuationData.vin || '',
        trim: valuationData.trim || '',
        fuelType: valuationData.fuelType || '',
        transmission: valuationData.transmission || '',
        color: valuationData.color || '',
        bodyType: valuationData.bodyType || '',
        confidenceScore: valuationData.confidenceScore || 75,
        isPremium: isPremium,
        priceRange: valuationData.priceRange || [
          Math.floor((valuationData.estimatedValue || 0) * 0.95),
          Math.ceil((valuationData.estimatedValue || 0) * 1.05)
        ],
        adjustments: valuationData.adjustments || [],
        generatedAt: new Date().toISOString(),
      };
      
      // Add AI condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition,
          confidenceScore: conditionData.confidenceScore,
          issuesDetected: conditionData.issuesDetected,
          // Make sure we're using the correct property name as defined in the AICondition type
          // If aiSummary doesn't exist, provide a fallback or empty string
          summary: conditionData.aiSummary || conditionData.summary || ''
        };
      } else if (valuationData.aiCondition) {
        reportData.aiCondition = valuationData.aiCondition;
      }
      
      // Add photo data if available
      if (valuationData.photoUrl || valuationData.bestPhotoUrl) {
        reportData.bestPhotoUrl = valuationData.bestPhotoUrl || valuationData.photoUrl;
      }
      
      // Generate the PDF
      const pdfBytes = await generateValuationPdf(reportData);
      
      // Create file name
      const fileName = `${reportData.make}_${reportData.model}_Valuation_${Date.now()}.pdf`;
      
      // Create a blob and save/download the file
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(pdfBlob, fileName);
      
      toast({
        title: "Success!",
        description: "Valuation PDF downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    isGenerating,
    handleDownloadPdf
  };
};

export default useValuationPdf;
