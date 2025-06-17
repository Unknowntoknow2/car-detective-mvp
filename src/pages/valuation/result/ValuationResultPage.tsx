
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useValuationResult } from "@/hooks/useValuationResult";
import UnifiedValuationResult from "@/components/valuation/valuation-core/ValuationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ValuationResultPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [hydratedId, setHydratedId] = useState<string | undefined>(id);

  const { result, isLoading, error } = useValuationResult(hydratedId);

  useEffect(() => {
    if (!hydratedId) {
      const localId = localStorage.getItem("latest_valuation_id");
      if (localId) {
        setHydratedId(localId);
      }
    }
  }, [hydratedId]);

  if (!hydratedId) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="mt-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Valuation ID</AlertTitle>
          <AlertDescription>
            No valuation ID was provided. Please complete a valuation first.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mt-12 text-center text-lg font-semibold">
          Loading your valuation result...
        </div>
      </MainLayout>
    );
  }

  if (error || !result) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="mt-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Valuation Not Found</AlertTitle>
          <AlertDescription>
            We couldn't find a valuation with this ID. Please check the link or try again.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const priceRange: [number, number] = result?.price_range
    ? Array.isArray(result.price_range)
      ? [Number(result.price_range[0]), Number(result.price_range[1])]
      : "low" in result.price_range && "high" in result.price_range
      ? [Number(result.price_range.low), Number(result.price_range.high)]
      : [0, 0]
    : [0, 0];

  const vehicleInfo = {
    make: result.make || "Unknown",
    model: result.model || "Vehicle",
    year: result.year || new Date().getFullYear(),
    mileage: result.mileage || 0,
    condition: result.condition || "Good",
  };

  const adjustments = (result?.adjustments || []).map((adj: any) => ({
    ...adj,
    description: adj.description || `Adjustment for ${adj.factor}`,
  }));

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Valuation Result</h1>
        </div>

        <UnifiedValuationResult
          displayMode="full"
          vehicleInfo={vehicleInfo}
          estimatedValue={result.estimatedValue || 0}
          confidenceScore={result.confidenceScore || 85}
          priceRange={priceRange}
          adjustments={adjustments}
        />
      </div>
    </MainLayout>
  );
}
