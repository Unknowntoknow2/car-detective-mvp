
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { useSearchParams, useParams } from 'react-router-dom';
import ValuationResult from '@/components/valuation/ValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useValuationResult } from '@/hooks/useValuationResult';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const valuationId = searchParams.get('valuationId') || id;
  const [error, setError] = useState<string | null>(null);
  
  // Fetch valuation data
  const { data, isLoading } = useValuationResult(valuationId || '');
  
  // Check premium access
  const { hasPremiumAccess } = usePremiumAccess(valuationId || undefined);
  
  const handleUpgrade = () => {
    window.location.href = `/premium?valuationId=${valuationId}`;
  };
  
  useEffect(() => {
    if (!valuationId) {
      setError('No valuation ID provided.');
    }
  }, [valuationId]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading valuation results...</p>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <main className="py-8">
        {error ? (
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : data ? (
          <div className="container mx-auto px-4">
            <ValuationResult
              valuationId={valuationId || undefined}
              data={data}
              isPremium={hasPremiumAccess}
              onUpgrade={handleUpgrade}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Data Found</AlertTitle>
              <AlertDescription>The valuation data could not be found.</AlertDescription>
            </Alert>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
