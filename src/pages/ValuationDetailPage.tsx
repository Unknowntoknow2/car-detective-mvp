// src/pages/ValuationDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Mail, Share2 } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id?: string }>();
  const valuationId = id ?? '';
  const result = useValuationResult(valuationId);

  const handleDownloadPdf = () => toast.success("Generating PDF report...");
  const handleEmailReport = () => toast.success("Report sent to your email");
  const handleShareReport = () => toast.success("Share link copied to clipboard");
  const handleFactorChange = (id: string, value: any) => toast.info(`${id} updated to ${value}. Recalculating valuation...`);

  if (result.isLoading) {
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

  if (result.isError) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{typeof result.error === 'string' ? result.error : 'Something went wrong while fetching the valuation.'}</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!result.data) {
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

  const data = result.data;
  const reportId = data.id || data.valuationId;
  const accidentCount = data.accident_count || 0;
  const titleStatus = data.titleStatus || 'Clean';

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
          <CardContent><PredictionResult valuationId={reportId} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Value Factors</CardTitle></CardHeader>
          <CardContent>
            <ValuationFactorsGrid
              values={{
                accidents: accidentCount,
                mileage: data.mileage || 0,
                year: data.year || new Date().getFullYear(),
                titleStatus: titleStatus,
              }}
              onChange={handleFactorChange}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
