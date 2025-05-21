// ✅ File: src/pages/ValuationDetailPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import FollowUpForm from '@/components/lookup/followup/FollowUpForm';
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
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { NextStepsCard } from '@/components/valuation/valuation-complete/NextStepsCard';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id?: string }>();
  // Type guard: fallback to empty string if undefined
  const valuationId = id ?? '';

  const result = useValuationResult(valuationId);

  // Handlers for UI actions
  const handleDownloadPdf = () => {
    toast.success("Generating PDF report...");
    // In a real implementation, this would download a PDF
  };
  const handleEmailReport = () => {
    toast.success("Report sent to your email");
    // In a real implementation, this would send an email
  };
  const handleShareReport = () => {
    toast.success("Share link copied to clipboard");
    // In a real implementation, this would generate and copy a share link
  };
  const handleFactorChange = (id: string, value: any) => {
    toast.info(`${id} updated to ${value}. Recalculating valuation...`);
    // In a real implementation, this would update the valuation
  };

  // Error/skeleton/data loading UI
  if (result.isLoading) {
    return (
      <MainLayout>
        <Container>
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
        </Container>
      </MainLayout>
    );
  }

  if (result.isError) {
    return (
      <MainLayout>
        <Container>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {typeof result.error === 'string' ? result.error : 'Something went wrong while fetching the valuation.'}
            </AlertDescription>
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  if (!result.data) {
    return (
      <MainLayout>
        <Container>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Valuation Found</AlertTitle>
            <AlertDescription>
              We couldn't find the valuation data for this report.
            </AlertDescription>
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  // Unpack data, apply defaults for missing fields
  const data = result.data;
  const reportId = data.id || data.valuationId;
  const valuationWithRequiredId = {
    ...data,
    id: reportId,
    created_at: data.created_at || new Date().toISOString()
  };

  const isPremiumUnlocked = Boolean(data?.premium_unlocked);
  const accidentCount = data.accident_count || 0;
  const titleStatus = data.titleStatus || 'Clean';

  return (
    <MainLayout>
      <Container>
        {/* Action buttons */}
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
            {/* (OPTIONAL) Add FollowUpForm here if you want */}
            {/* <FollowUpForm /> */}
          </CardContent>
        </Card>

        {/* Value Factors Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Value Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ValuationFactorsGrid
              values={{
                accidents: accidentCount,
                mileage: data.mileage || 0,
                year: data.year || new Date().getFullYear(),
                titleStatus: titleStatus
              }}
              onChange={handleFactorChange}
            />
          </CardContent>
        </Card>

        {/* Next Steps */}
        <NextStepsCard valuationId={reportId} isPremium={isPremiumUnlocked} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Dealer Offers</h2>
          <DealerOffersList reportId={reportId} showActions />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Chat with AI Assistant</h2>
          <AIChatBubble valuation={valuationWithRequiredId} />
        </div>

        {/* Vehicle History Section (if premium) */}
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
      </Container>
    </MainLayout>
  );
}
