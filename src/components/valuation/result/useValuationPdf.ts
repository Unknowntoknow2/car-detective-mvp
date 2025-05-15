
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ValuationResult } from '@/types/valuation';
import { AICondition } from '@/types/photo';
import { ReportData } from '@/utils/pdf/types';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { useAuth } from '@/hooks/useAuth';

interface UseValuationPdfProps {
  valuationData: ValuationResult | null;
  conditionData: AICondition | null;
}

export function useValuationPdf({ 
  valuationData, 
  conditionData 
}: UseValuationPdfProps) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadPdf = async (): Promise<void> => {
    if (!valuationData) {
      toast({
        title: "Error",
        description: "No valuation data available to generate PDF",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to download the valuation report",
        variant: "destructive"
      });
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Format data for PDF generation
      const reportData: ReportData = {
        id: valuationData.id,
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Vehicle',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
        zipCode: valuationData.zipCode || valuationData.zip || '00000',
        estimatedValue: valuationData.estimatedValue || valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidenceScore || valuationData.confidence_score || 75,
        priceRange: valuationData.priceRange || [
          Math.round((valuationData.estimatedValue || valuationData.estimated_value || 0) * 0.9),
          Math.round((valuationData.estimatedValue || valuationData.estimated_value || 0) * 1.1)
        ],
        generatedAt: new Date().toISOString(),
        userId: user.id,
        isPremium: valuationData.isPremium || valuationData.premium_unlocked || false,
        adjustments: valuationData.adjustments || [],
        explanation: valuationData.explanation || valuationData.gptExplanation || '',
        vin: valuationData.vin || ''
      };
      
      // Add AI condition data if available
      if (conditionData) {
        reportData.aiCondition = {
          condition: conditionData.condition,
          confidenceScore: conditionData.confidenceScore,
          issuesDetected: conditionData.issuesDetected,
          summary: conditionData.summary
        };
      } else if (valuationData.aiCondition) {
        reportData.aiCondition = valuationData.aiCondition;
      }
      
      await downloadValuationPdf(reportData);
      
      toast({
        title: "PDF Downloaded",
        description: "Your valuation report has been downloaded successfully."
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download PDF report",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return {
    isDownloading,
    handleDownloadPdf
  };
}
