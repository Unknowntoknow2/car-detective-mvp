<<<<<<< HEAD

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useValuationPdf } from '@/components/valuation/result/useValuationPdf';
=======
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { ReportData } from "@/utils/pdf/types";
import {
  downloadValuationPdf,
  generateValuationPdf,
} from "@/utils/pdf/generateValuationPdf";
import { useAuth } from "@/hooks/useAuth";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface DownloadPDFButtonProps {
  valuationId?: string;
  fileName?: string;
  children?: React.ReactNode;
  className?: string;
<<<<<<< HEAD
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  isSample?: boolean;
=======
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  // Data can be provided directly if already available
  valuationData?: Partial<ReportData>;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

export function DownloadPDFButton({
  valuationId,
  fileName = 'valuation-report.pdf',
  children,
  className,
<<<<<<< HEAD
  variant = 'default',
  isSample = false
=======
  variant = "outline",
  size = "default",
  disabled = false,
  valuationData,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the useValuationPdf hook with null values
  const { downloadSamplePdf } = useValuationPdf({
    valuationData: null,
    conditionData: null
  });

  const handleDownload = async () => {
<<<<<<< HEAD
    // If it's a sample, use the sample download functionality
    if (isSample) {
      try {
        await downloadSamplePdf();
      } catch (error) {
        console.error('Error downloading sample PDF:', error);
        toast.error('Error downloading sample PDF', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      }
=======
    if (!user) {
      toast({
        description: "Please log in to download the valuation report.",
        variant: "destructive",
      });
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return;
    }
    
    // Regular PDF download logic
    if (!valuationId) {
      toast.error('No valuation ID provided');
      return;
    }
    
    setIsLoading(true);
    try {
<<<<<<< HEAD
      // Try to call the edge function to generate the PDF
      const { data, error } = await supabase.functions.invoke('generate-valuation-pdf', {
        body: { valuationId }
      });
      
      if (error) {
        throw new Error(`Failed to generate PDF: ${error.message}`);
      }
      
      if (data?.pdfBase64) {
        // Convert base64 to blob
        const byteCharacters = atob(data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Use file-saver to download the blob as a file
        saveAs(blob, fileName);
        toast.success('PDF download complete');
      } else {
        // Fallback for demo purposes if no PDF generation is available
        const mockPdfUrl = `https://example.com/valuation-pdfs/${valuationId}.pdf`;
        
        toast.success('PDF generated successfully', {
          description: 'Your report would download automatically in production.'
        });
        
        console.log('PDF would be downloaded from:', mockPdfUrl);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error downloading PDF', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
=======
      // If we already have the valuation data, use it directly
      if (valuationData && Object.keys(valuationData).length > 0) {
        const reportData: ReportData = {
          id: valuationId,
          make: valuationData.make || "Unknown",
          model: valuationData.model || "Vehicle",
          year: valuationData.year || new Date().getFullYear(),
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || "Good",
          // Use the appropriate property for price
          price: valuationData.price || valuationData.estimatedValue || 0,
          userId: user.id,
          isPremium: isPremium,
          generatedAt: new Date().toISOString(),

          // These are now supported in the ReportData interface
          estimatedValue: valuationData.estimatedValue,
          confidenceScore: valuationData.confidenceScore,
          priceRange: valuationData.priceRange,
          zipCode: valuationData.zipCode,

          // Optional properties
          vin: valuationData.vin,
          explanation: valuationData.explanation,
          adjustments: valuationData.adjustments,
        };

        // Add conditional data if available
        if (valuationData.aiCondition) {
          const aiConditionData = valuationData.aiCondition as any;
          reportData.aiCondition = {
            condition: aiConditionData.condition,
            confidenceScore: aiConditionData.confidenceScore,
            issuesDetected: aiConditionData.issuesDetected,
            summary: aiConditionData.summary || "",
          };
        }

        await downloadValuationPdf(reportData);
      } else {
        // Fetch data from the server and generate PDF
        const response = await fetch(
          `https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/generate-valuation-pdf`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${
                localStorage.getItem("supabase.auth.token") || ""
              }`,
            },
            body: JSON.stringify({
              valuationId,
              userId: user.id,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate PDF");
        }

        const data = await response.json();

        // If we got a URL, open it directly
        if (data.url) {
          // Open in a new tab or trigger download directly
          globalThis.open(data.url, "_blank");
        } else {
          throw new Error("No PDF URL returned from server");
        }
      }

      if (onDownload) onDownload();

      toast({
        description: "Your valuation report has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Download failed:", error);
      toast({
        description: error.message || "Failed to download PDF report",
        variant: "destructive",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      });
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
  // For non-premium users accessing premium content
  const handlePremiumPrompt = () => {
    toast({
      description:
        "Upgrade to premium to download full reports with enhanced insights.",
      variant: "default",
    });
    // Here you would add navigation to premium upgrade page
  };

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <Button
      variant={variant}
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
    >
<<<<<<< HEAD
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {children || (isSample ? 'Download Sample Report' : 'Download PDF Report')}
=======
      {isLoading
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : <Download className="h-4 w-4" />}
      {isPremium ? "Download Report" : "Upgrade for Full Report"}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </Button>
  );
}
