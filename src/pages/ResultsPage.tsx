
import React from 'react';
import { useParams } from 'react-router-dom';
import { ValuationProvider, useValuationContext } from '@/contexts/ValuationContext';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { RerunValuationButton } from '@/components/valuation/RerunValuationButton';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600">No valuation ID provided</p>
      </div>
    );
  }

  return (
    <ValuationProvider valuationId={id}>
      <div className="min-h-screen bg-background">
        <RerunValuationButton />
        <ResultsContent />
      </div>
    </ValuationProvider>
  );
}

function ResultsContent() {
  const { valuationData, isLoading, error } = useValuationContext();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading valuation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <p className="text-sm text-muted-foreground">
          Try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No valuation data found</p>
      </div>
    );
  }

  return <UnifiedValuationResult result={valuationData} />;
}
