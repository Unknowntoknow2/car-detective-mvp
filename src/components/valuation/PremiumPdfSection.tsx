
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, Share2, Mail, Shield } from 'lucide-react';
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
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [emailedToDealers, setEmailedToDealers] = useState(false);
  const { user } = useUser();

  const handleGeneratePdf = async (options: { emailToDealers?: boolean } = {}) => {
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
      
      // Upload with enhanced features
      const result = await uploadValuationPdf(reportData, user.id, {
        emailToDealers: options.emailToDealers,
        includeAINSummary: true,
        includeDebugInfo: process.env.NODE_ENV === 'development'
      });
      
      setPdfUrl(result.url);
      setFilename(result.filename);
      setTrackingId(result.trackingId);
      
      if (options.emailToDealers) {
        setEmailedToDealers(true);
      }
      
      toast({
        title: "PDF Generated Successfully",
        description: options.emailToDealers 
          ? "Your premium report is ready and has been sent to verified dealers"
          : "Your premium report is ready for download",
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
        navigator.clipboard.writeText(pdfUrl);
        toast({
          title: "Link Copied",
          description: "Report link copied to clipboard",
        });
      }
    } else {
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
              Generate a comprehensive PDF report with AIN summary, auction data, watermark protection, and tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => handleGeneratePdf()} 
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Premium PDF
                  </>
                )}
              </Button>

              <Button 
                onClick={() => handleGeneratePdf({ emailToDealers: true })} 
                disabled={isGenerating}
                variant="outline"
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating & Emailing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Generate & Email to Dealers
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Includes watermark protection and tracking ID</span>
              </div>
              <div>• AIN-generated summary and insights</div>
              <div>• Professional dealer-ready format</div>
              {emailedToDealers && <div>• Automatically sent to verified dealers</div>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your premium report is ready! {emailedToDealers && 'It has been sent to verified dealers.'} The download link is valid for 24 hours.
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

                <div className="text-xs text-muted-foreground space-y-1">
                  {filename && <p>File: {filename}</p>}
                  {trackingId && <p>Tracking ID: {trackingId}</p>}
                  {emailedToDealers && (
                    <p className="text-green-600">✓ Sent to verified dealers</p>
                  )}
                </div>
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
