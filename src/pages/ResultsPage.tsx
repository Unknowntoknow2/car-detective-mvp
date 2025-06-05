
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout";
import { useParams, useSearchParams } from "react-router-dom";
import ValuationResult from "@/components/valuation/ValuationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
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
        {error ? (
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <ValuationResult valuationId={valuationId || undefined} />
        )}
      </main>
    </MainLayout>
  );
};

export default ResultsPage;
