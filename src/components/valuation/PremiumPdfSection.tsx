
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, Share2 } from 'lucide-react';
import { QrCodeDownload } from './QrCodeDownload';
import { uploadValuationPdf } from '@/utils/pdf/uploadValuationPdf';
import { convertVehicleInfoToReportData } from '@/utils/pdf/generateValuationPdf';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

interface PremiumPdfSectionProps {
  valuationResult: any;
  isPremium: boolean;
}

export function PremiumPdfSection({ valuationResult, isPremium }: PremiumPdfSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const { user } = useUser();

  const handleGeneratePdf = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Required",
        description: "PDF reports are only available for premium users",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate PDF reports",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Convert valuation result to report data
      const reportData = convertVehicleInfoToReportData(valuationResult, valuationResult);
      
      // Upload and get signed URL
      const result = await uploadValuationPdf(reportData, user.id);
      
      setPdfUrl(result.url);
      setFilename(result.filename);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your premium report is ready for download",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (!pdfUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vehicle Valuation Report',
          text: `Vehicle valuation report for ${valuationResult.year} ${valuationResult.make} ${valuationResult.model}`,
          url: pdfUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying URL
        navigator.clipboard.writeText(pdfUrl);
        toast({
          title: "Link Copied",
          description: "Report link copied to clipboard",
        });
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(pdfUrl);
      toast({
        title: "Link Copied",
        description: "Report link copied to clipboard",
      });
    }
  };

  if (!isPremium) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Premium PDF Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pdfUrl ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a comprehensive PDF report with auction data, detailed analysis, and professional formatting.
            </p>
            <Button 
              onClick={handleGeneratePdf} 
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Premium PDF Report
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your premium report is ready! The download link is valid for 24 hours.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleDownload} className="flex-1 sm:flex-none">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  
                  <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-none">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {filename && (
                  <p className="text-xs text-muted-foreground">
                    File: {filename}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <QrCodeDownload url={pdfUrl} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PremiumPdfSection;
