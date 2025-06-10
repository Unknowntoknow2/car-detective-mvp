
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PDFDownloadButtonProps {
  valuationResult: any;
  isPremium: boolean;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  valuationResult,
  isPremium,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!isPremium) return;

    setIsDownloading(true);
    try {
      // MVP: Basic download simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isPremium) {
    return (
      <div>
        <Button disabled role="button" aria-label="Download report">
          <Lock className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Upgrade to premium to download detailed reports
        </p>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading}
      role="button" 
      aria-label="Download report"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" role="status" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </>
      )}
    </Button>
  );
};
