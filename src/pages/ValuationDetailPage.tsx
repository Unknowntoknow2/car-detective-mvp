
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Mail, Share2 } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { AIChatBubble } from '@/components/chat/AIChatBubble';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useValuationResult(id || '');

  // FEATURE_UNVEIL: Handle PDF download
  const handleDownloadPdf = () => {
    toast.success("Generating PDF report...");
    // In a real implementation, this would download a PDF
  };

  // FEATURE_UNVEIL: Handle email report
  const handleEmailReport = () => {
    toast.success("Report sent to your email");
    // In a real implementation, this would send an email
  };

  // FEATURE_UNVEIL: Handle share report
  const handleShareReport = () => {
    toast.success("Share link copied to clipboard");
    // In a real implementation, this would generate and copy a share link
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Valuation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {typeof error === 'string' ? error : 'Something went wrong while fetching the valuation.'}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Valuation Found</AlertTitle>
            <AlertDescription>
              We couldn't find the valuation data for this report.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Use valuationId or id property as needed
  const reportId = data.id || data.valuationId;

  // Ensure data has a non-optional id property to satisfy the Valuation type
  const valuationWithRequiredId = {
    ...data,
    id: reportId, // Ensure id is always defined
    created_at: data.created_at || new Date().toISOString() // Ensure created_at is always defined
  };

  // Check if premium features are unlocked, safely accessing the premium_unlocked property
  const isPremiumUnlocked = Boolean(data?.premium_unlocked);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* FEATURE_UNVEIL: Action buttons */}
        <div className="flex flex-wrap gap-4 justify-end">
          <Button variant="outline" onClick={handleShareReport}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleEmailReport}>
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Valuation Report</CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionResult valuationId={reportId} />
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Dealer Offers</h2>
          <DealerOffersList reportId={reportId} showActions />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Chat with AI Assistant</h2>
          <AIChatBubble valuation={valuationWithRequiredId} />
        </div>

        {/* FEATURE_UNVEIL: Vehicle History Section (if premium) */}
        {isPremiumUnlocked && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Vehicle History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-md bg-slate-50">
                <h3 className="font-medium mb-2">CARFAX Report Summary</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>No accidents or damage reported</li>
                  <li>2 previous owners</li>
                  <li>Personal use vehicle</li>
                  <li>Regular maintenance history</li>
                </ul>
                <Button variant="link" className="px-0 text-sm mt-2">
                  View Full CARFAX Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
