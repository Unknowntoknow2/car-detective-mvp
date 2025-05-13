
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSearchParams, useParams } from 'react-router-dom';
import ValuationResult from '@/components/valuation/ValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const valuationId = searchParams.get('valuationId') || id;
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!valuationId) {
      setError('No valuation ID provided.');
    }
  }, [valuationId]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        {error ? (
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <ValuationResult
            valuationId={valuationId || undefined}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
