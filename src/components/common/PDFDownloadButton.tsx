
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PDFDownloadButtonProps {
  valuationResult: any;
  isPremium: boolean;
}

export function PDFDownloadButton({ valuationResult, isPremium }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!isPremium) {
      toast({
        description: "Upgrade to premium to download PDF reports",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Mock PDF generation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        description: "PDF report downloaded successfully",
      });
    } catch (error) {
      toast({
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!isPremium || isGenerating}
      className="w-full"
    >
      {isGenerating ? (
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
}
