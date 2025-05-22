
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
        // Use estimated_value or estimatedValue as price & estimatedValue
        estimatedValue: valuationData.estimated_value || valuationData.estimatedValue || 0,
        price: valuationData.estimated_value || valuationData.estimatedValue || 0,
        zipCode: valuationData.zipCode || valuationData.zip_code || valuationData.zip || '',
        vin: valuationData.vin || '',
        fuelType: valuationData.fuelType || valuationData.fuel_type || '',
        transmission: valuationData.transmission || '',
        color: valuationData.color || '',
        bodyType: valuationData.bodyType || valuationData.bodyStyle || '', 
        confidenceScore: valuationData.confidence_score || valuationData.confidenceScore || 75,
        isPremium: isPremium,
        priceRange: valuationData.priceRange && Array.isArray(valuationData.priceRange) && valuationData.priceRange.length >= 2 
          ? [valuationData.priceRange[0], valuationData.priceRange[1]] 
          : [
              Math.floor((valuationData.estimated_value || valuationData.estimatedValue || 0) * 0.95),
              Math.ceil((valuationData.estimated_value || valuationData.estimatedValue || 0) * 1.05)
            ],
        // Convert adjustments to match ReportData format
        adjustments: valuationData.adjustments?.map((adj: any) => ({
          factor: adj.factor || '',
          impact: adj.impact || 0,
          description: adj.description || ''
        })) || [],
        generatedDate: new Date(),
        generatedAt: new Date().toISOString(),
        explanation: valuationData.explanation || valuationData.gptExplanation || '',
      };
      
      // Add AI condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          summary: conditionData.summary || '',
          score: conditionData.confidenceScore || 0,
          issuesDetected: conditionData.issuesDetected || [],
          condition: conditionData.condition || ''
        };
      } else if (valuationData.aiCondition) {
        reportData.aiCondition = {
          summary: valuationData.aiCondition.summary || '',
          score: valuationData.aiCondition.confidenceScore || 0,
          issuesDetected: valuationData.aiCondition.issuesDetected || [],
          condition: valuationData.aiCondition.condition || ''
        };
      }
      
      // Add photo data if available
      if (valuationData.bestPhotoUrl || valuationData.photo_url) {
        reportData.bestPhotoUrl = valuationData.bestPhotoUrl || valuationData.photo_url;
        reportData.photoUrl = valuationData.bestPhotoUrl || valuationData.photo_url;
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
  
  return {
    isGenerating,
    handleDownloadPdf
  };
};

export default useValuationPdf;
