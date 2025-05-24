
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { saveAs } from 'file-saver';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData } from '@/utils/pdf/types';
import { formatCurrency } from '@/utils/formatters';

interface PDFDownloadButtonProps {
  valuationResult: any;
  className?: string;
  isPremium?: boolean;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  valuationResult, 
  className = '',
  isPremium = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    if (!isPremium) {
      toast({
        title: "Access Denied",
        description: "Premium access required to download PDF reports",
        variant: "destructive",
      });
      return;
    }
    
    if (!valuationResult) {
      toast({
        title: "Missing Data",
        description: "No valuation data available to generate PDF",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Format the data for the PDF generator
      const formData: ReportData = {
        make: valuationResult.make || '',
        model: valuationResult.model || '',
        year: valuationResult.year || new Date().getFullYear(),
        mileage: valuationResult.mileage || 0,
        zipCode: valuationResult.zip || valuationResult.zipCode || '',
        condition: valuationResult.condition || 'Good',
        // Use estimated value for price and estimatedValue
        estimatedValue: valuationResult.estimated_value || valuationResult.estimatedValue || 0,
        adjustments: (valuationResult.adjustments || []).map((adj: any) => ({
          factor: adj.factor || '',
          impact: adj.impact || 0,
          description: adj.description || `Adjustment for ${adj.factor || 'unknown'}`
        })),
        generatedAt: new Date().toISOString(),
        confidenceScore: valuationResult.confidence_score || valuationResult.confidenceScore || 0,
        aiCondition: valuationResult.aiCondition || {
          condition: 'Unknown',
          confidenceScore: 0,
          issuesDetected: [],
          summary: 'No condition assessment available'
        }
      };
      
      // Generate the PDF
      const pdfBytes = await generateValuationPdf(formData);
      
      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Create a sanitized filename
      const sanitizedMake = valuationResult.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
      const sanitizedModel = valuationResult.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
      const filename = `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;
      
      // Trigger the download
      saveAs(pdfBlob, filename);
      
      toast({
        title: "Success",
        description: "PDF report downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!isPremium) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              className={`opacity-50 ${className}`} 
              disabled={true}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Report (PDF)
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Premium to download PDF reports</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      className={`transition-all hover:shadow-md hover:scale-105 ${className}`}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      Download Report (PDF)
    </Button>
  );
};

export default PDFDownloadButton;
