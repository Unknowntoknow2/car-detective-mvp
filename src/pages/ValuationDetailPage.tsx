
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Mail, Share2 } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { NextStepsCard } from '@/components/valuation/valuation-complete/NextStepsCard';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id?: string }>();
  const { result, isLoading, error } = useValuationResult();

  const handleDownloadPdf = () => toast.success("Generating PDF report...");
  const handleEmailReport = () => toast.success("Report sent to your email");
  const handleShareReport = () => toast.success("Share link copied to clipboard");
  const handleFactorChange = (id: string, value: any) => toast.info(`${id} updated to ${value}. Recalculating valuation...`);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Card className="w-full">
            <CardHeader><CardTitle className="text-lg">Valuation Details</CardTitle></CardHeader>
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

  if (!result) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Valuation Found</AlertTitle>
            <AlertDescription>We couldn't find the valuation data for this report.</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  const data = result;
  const reportId = data.id || id;
  const valuationWithRequiredId = {
    ...data,
    id: reportId,
    created_at: data.createdAt || new Date().toISOString()
  };

  const isPremiumUnlocked = Boolean(data?.premium_unlocked);
  const accidentCount = data.accident_count || 0;
  const titleStatus = data.titleStatus || "Clean";

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-wrap gap-4 justify-end">
          <Button variant="outline" onClick={handleShareReport}><Share2 className="h-4 w-4 mr-2" />Share Report</Button>
          <Button variant="outline" onClick={handleDownloadPdf}><FileText className="h-4 w-4 mr-2" />Download PDF</Button>
          <Button variant="outline" onClick={handleEmailReport}><Mail className="h-4 w-4 mr-2" />Email Report</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Valuation Report</CardTitle></CardHeader>
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold">
                Estimated Value: ${data.estimatedValue?.toLocaleString() || 0}
              </h3>
              <p className="text-muted-foreground">
                Confidence Score: {data.confidenceScore || 85}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Value Factors</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="font-medium">Accidents</label>
                <p>{accidentCount}</p>
              </div>
              <div>
                <label className="font-medium">Mileage</label>
                <p>{data.mileage?.toLocaleString() || 0} miles</p>
              </div>
              <div>
                <label className="font-medium">Year</label>
                <p>{data.year || new Date().getFullYear()}</p>
              </div>
              <div>
                <label className="font-medium">Title Status</label>
                <p>{titleStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
