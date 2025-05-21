
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, FileCheck, Share2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';
import { useShareReport } from '@/hooks/useShareReport';
import { ValuationSummary } from './report/ValuationSummary';
import { useValuationData } from '@/modules/valuation-result/hooks/useValuationData';

export function PremiumSuccessPage() {
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get('id');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const { downloadPdf } = useDownloadPdf();
  const { shareViaEmail } = useShareReport();
  
  // Handle case when valuationId is null
  const validValuationId = valuationId || '';
  
  const { data: valuation, isLoading, error } = useValuationData(validValuationId);
  
  const handleDownload = async () => {
    if (!valuation) return;
    
    setIsDownloading(true);
    try {
      await downloadPdf(valuation.id);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!valuation) return;
    
    setIsSharing(true);
    try {
      await shareViaEmail(valuation.id);
    } catch (err) {
      console.error('Failed to share report:', err);
    } finally {
      setIsSharing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !valuation) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
            <p className="text-gray-500 mb-4">
              We couldn't find the valuation report you're looking for.
            </p>
            <Link to="/valuation">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Start a New Valuation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-green-500" />
            Premium Valuation Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <p className="text-gray-600 mb-6">
              Your comprehensive vehicle valuation report is ready. This detailed analysis includes 
              market comparisons, condition assessment, and personalized value insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={handleDownload} 
                className="flex-1"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF Report
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="flex-1"
                disabled={isSharing}
              >
                {isSharing ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                Email Report
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Report Summary</h3>
              <ValuationSummary valuation={valuation} showEstimatedValue={true} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mb-8">
        <Link to="/dashboard">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
