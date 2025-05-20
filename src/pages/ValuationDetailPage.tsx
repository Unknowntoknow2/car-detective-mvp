// ✅ File: src/pages/ValuationResultPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

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

export default function ValuationResultPage() {
  const { id } = useParams<{ id?: string }>();
  const valuationId = id ?? '';

  // useValuationResult returns { data, isLoading, error }
  const { data, isLoading, error } = useValuationResult(valuationId);

  // Action handlers
  const handleDownloadPdf = () => {
    toast.success("Generating PDF report...");
    // TODO: implement PDF download logic
  };

  const handleEmailReport = () => {
    toast.success("Report sent to your email");
    // TODO: implement email report logic
  };

  const handleShareReport = () => {
    toast.success("Share link copied to clipboard");
    // TODO: implement share logic
  };

  const handleFactorChange = (id: string, value: any) => {
    toast.info(`${id} updated to ${value}. Recalculating valuation...`);
    // TODO: implement factor update logic
  };

  if (isLoading) {
    return (
      <MainLayout>
        <main>
          <div className="container mx-auto py-8">
            <div className="w-full p-4 border rounded shadow bg-white">
              <h2 className="text-lg font-bold mb-2">Valuation Details</h2>
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <main>
          <div className="container mx-auto py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {typeof error === 'string' ? error : 'Something went wrong while fetching the valuation.'}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <main>
          <div className="container mx-auto py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Valuation Found</AlertTitle>
              <AlertDescription>
                We couldn't find the valuation data for this report.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </MainLayout>
    );
  }

  // Post-load data setup
  const reportId = data.id || data.valuationId;
  const isPremiumUnlocked = Boolean(data?.premium_unlocked);
  const accidentCount = data.accident_count || 0;
  const titleStatus = data.titleStatus || 'Clean';

  // For AIChatBubble, make sure required fields are set
  const valuationWithRequiredId = {
    ...data,
    id: reportId,
    created_at: data.created_at || new Date().toISOString()
  };

  return (
    <MainLayout>
      <main>
        <div className="container mx-auto py-8 space-y-8">
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

          <div className="p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-bold mb-2">Valuation Report</h2>
            <PredictionResult valuationId={reportId} />
          </div>

          <div className="p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-bold mb-2">Value Factors</h2>
            <ValuationFactorsGrid
              values={{
                accidents: accidentCount,
                mileage: data.mileage || 0,
                year: data.year || new Date().getFullYear(),
                titleStatus: titleStatus
              }}
              onChange={handleFactorChange}
            />
          </div>

          <div className="p-4 border rounded shadow bg-white">
            <NextStepsCard
              valuationId={reportId}
              isPremium={isPremiumUnlocked}
            />
          </div>

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
            <div className="p-4 border rounded shadow bg-white mt-8">
              <h2 className="text-lg font-bold mb-2">Vehicle History</h2>
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
            </div>
          )}
               </div>
      </main>
    </MainLayout>
  );
}

