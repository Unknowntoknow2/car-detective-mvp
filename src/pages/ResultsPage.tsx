<<<<<<< HEAD

import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';
=======
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout";
import { useParams, useSearchParams } from "react-router-dom";
import ValuationResult from "@/components/valuation/ValuationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
<<<<<<< HEAD

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Valuation Results</h1>
        <Card className="p-6">
          <ValuationResult 
            valuationId={id}
            isManualValuation={false}
          />
        </Card>
      </div>
=======
  const valuationId = searchParams.get("valuationId") || id;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!valuationId) {
      setError("No valuation ID provided.");
    }
  }, [valuationId]);

  return (
    <MainLayout>
      <main className="py-8">
        {error
          ? (
            <div className="container mx-auto px-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )
          : (
            <ValuationResult
              valuationId={valuationId || undefined}
            />
          )}
      </main>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </MainLayout>
  );
};

export default ResultsPage;
