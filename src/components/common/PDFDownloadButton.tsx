<<<<<<< HEAD

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { saveAs } from 'file-saver';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData } from '@/utils/pdf/types';
import { formatCurrency } from '@/utils/formatters';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
=======
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveAs } from "file-saver";
import { generateValuationPdf } from "@/utils/pdf/generateValuationPdf";
import { ReportData } from "@/utils/pdf/types";
import { formatCurrency } from "@/utils/formatters";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface PDFDownloadButtonProps {
  valuationResult: any;
  enrichedData?: EnrichedVehicleData | null;
  className?: string;
  isPremium?: boolean;
}

<<<<<<< HEAD
export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  valuationResult, 
  enrichedData,
  className = '',
  isPremium = false
=======
export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  valuationResult,
  className = "",
  isPremium = false,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD
        make: valuationResult.make || '',
        model: valuationResult.model || '',
        year: valuationResult.year || new Date().getFullYear(),
        mileage: valuationResult.mileage || 0,
        zipCode: valuationResult.zip || valuationResult.zipCode || '',
        condition: valuationResult.condition || 'Good',
        estimatedValue: valuationResult.estimated_value || valuationResult.estimatedValue || 0,
=======
        id: valuationResult.id || crypto.randomUUID(),
        make: valuationResult.make,
        model: valuationResult.model,
        year: valuationResult.year,
        mileage: valuationResult.mileage,
        condition: valuationResult.condition,
        zipCode: valuationResult.zip || valuationResult.zipCode,
        // Use estimated value as price
        price: valuationResult.estimated_value ||
          valuationResult.estimatedValue || 0,
        estimatedValue: valuationResult.estimated_value ||
          valuationResult.estimatedValue || 0,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        adjustments: (valuationResult.adjustments || []).map((adj: any) => ({
          factor: adj.factor || "",
          impact: adj.impact || 0,
          description: adj.description ||
            `Adjustment for ${adj.factor || "unknown"}`,
        })),
        generatedAt: new Date().toISOString(),
<<<<<<< HEAD
        confidenceScore: valuationResult.confidence_score || valuationResult.confidenceScore || 0,
        aiCondition: valuationResult.aiCondition || {
          condition: 'Unknown',
          confidenceScore: 0,
          issuesDetected: [],
          summary: 'No condition assessment available'
        },
        vin: valuationResult.vin
      };
      
      // Generate the PDF with auction data included
      const pdfBytes = await generateValuationPdf(formData, {
        isPremium: true,
        includeExplanation: true,
        includeAuctionData: true,
        enrichedData: enrichedData || undefined
      });
      
=======
        confidenceScore: valuationResult.confidence_score ||
          valuationResult.confidenceScore,
        priceRange: valuationResult.price_range || valuationResult.priceRange,
      };

      // Generate the PDF
      const pdfBytes = await generateValuationPdf(formData);

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a sanitized filename
<<<<<<< HEAD
      const sanitizedMake = valuationResult.make?.replace(/[^a-z0-9]/gi, '') || 'Vehicle';
      const sanitizedModel = valuationResult.model?.replace(/[^a-z0-9]/gi, '') || 'Report';
      const filename = `CarDetective_Premium_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;
      
=======
      const sanitizedMake = valuationResult.make?.replace(/[^a-z0-9]/gi, "") ||
        "Vehicle";
      const sanitizedModel =
        valuationResult.model?.replace(/[^a-z0-9]/gi, "") || "Report";
      const filename =
        `CarDetective_Valuation_${sanitizedMake}_${sanitizedModel}_${Date.now()}.pdf`;

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      // Trigger the download
      saveAs(pdfBlob, filename);

      toast({
        title: "Success",
        description: "Premium PDF report with auction data downloaded successfully",
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
              disabled
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Premium Report (PDF)
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Premium to download reports with STAT.vin data</p>
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
<<<<<<< HEAD
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      Download Premium Report (PDF)
=======
      {isGenerating
        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        : <FileDown className="mr-2 h-4 w-4" />}
      Download Report (PDF)
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </Button>
  );
};

export default PDFDownloadButton;
