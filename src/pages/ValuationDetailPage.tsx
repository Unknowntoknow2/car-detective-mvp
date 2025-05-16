
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { AIChatBubble } from '@/components/chat/AIChatBubble';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useValuationResult(id || '');

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {typeof error === 'string' ? error : 'Something went wrong while fetching the valuation.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Valuation Found</AlertTitle>
        <AlertDescription>
          We couldn't find the valuation data for this report.
        </AlertDescription>
      </Alert>
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valuation Report</CardTitle>
        </CardHeader>
        <CardContent>
          <PredictionResult valuationId={reportId} />
        </CardContent>
      </Card>

      <div className="mt-8">
        <DealerOffersList reportId={reportId} showActions />
      </div>

      <div className="mt-8">
        <AIChatBubble valuation={valuationWithRequiredId} />
      </div>
    </>
  );
}
