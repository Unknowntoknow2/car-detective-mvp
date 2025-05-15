
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
      // Format data for PDF generation - fixing type issues
      const reportData: ReportData = {
        id: valuationData.id || crypto.randomUUID(),
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Unknown',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Unknown',
        // Use estimatedValue as price
        price: valuationData.estimatedValue || 0,
        estimatedValue: valuationData.estimatedValue || 0,
        zipCode: valuationData.zipCode || valuationData.zip || '',
        vin: valuationData.vin || '',
        fuelType: valuationData.fuelType || valuationData.fuel_type || '',
        transmission: valuationData.transmission || '',
        color: valuationData.color || '',
        bodyType: valuationData.bodyType || valuationData.bodyStyle || '', 
        confidenceScore: valuationData.confidenceScore || 75,
        isPremium: isPremium, // This is now a valid property
        priceRange: valuationData.priceRange || [
          Math.floor((valuationData.estimatedValue || 0) * 0.95),
          Math.ceil((valuationData.estimatedValue || 0) * 1.05)
        ],
        // Convert adjustments to match ReportData format
        adjustments: valuationData.adjustments?.map(adj => ({
          factor: adj.factor || '',
          impact: adj.impact || 0,
          description: adj.description || ''
        })) || [],
        generatedAt: new Date().toISOString(),
        explanation: valuationData.explanation || valuationData.gptExplanation || '',
        // Add userId if available
        userId: valuationData.userId || localStorage.getItem('user_id') || undefined
      };
      
      // Add AI condition data if available - this is now a valid property
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition,
          confidenceScore: conditionData.confidenceScore,
          issuesDetected: conditionData.issuesDetected,
          summary: conditionData.summary || conditionData.aiSummary || ''
        };
      } else if (valuationData.aiCondition) {
        reportData.aiCondition = {
          condition: valuationData.aiCondition.condition,
          confidenceScore: valuationData.aiCondition.confidenceScore,
          issuesDetected: valuationData.aiCondition.issuesDetected,
          summary: valuationData.aiCondition.summary || valuationData.aiCondition.aiSummary || ''
        };
      }
      
      // Add photo data if available - this is now a valid property
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
  
  return {
    isGenerating,
    handleDownloadPdf
  };
};

export default useValuationPdf;
