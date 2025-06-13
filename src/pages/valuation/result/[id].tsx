import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useValuationResult } from "@/hooks/useValuationResult";
import UnifiedValuationResult from "@/components/valuation/valuation-core/UnifiedValuationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FreeValuationResultPage() {
  const router = useRouter();
  const { id } = router.query;

  const [hydratedId, setHydratedId] = useState<string | undefined>(
    typeof id === "string" ? id : undefined
  );

  const { data, isLoading, error } = useValuationResult(hydratedId || "");

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

  if (error || !data) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="mt-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Valuation Not Found</AlertTitle>
          <AlertDescription>
            We couldn’t find a valuation with this ID. Please check the link or try again.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const priceRange: [number, number] = data?.price_range
    ? Array.isArray(data.price_range)
      ? [Number(data.price_range[0]), Number(data.price_range[1])]
      : "low" in data.price_range && "high" in data.price_range
      ? [Number(data.price_range.low), Number(data.price_range.high)]
      : [0, 0]
    : [0, 0];

  const vehicleInfo = {
    make: data.make || "Unknown",
    model: data.model || "Vehicle",
    year: data.year || new Date().getFullYear(),
    mileage: data.mileage || 0,
    condition: data.condition || "Good",
  };

  const adjustments = (data?.adjustments || []).map((adj) => ({
    ...adj,
    description: adj.description || `Adjustment for ${adj.factor}`,
  }));

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Valuation Result</h1>
        </div>

        <UnifiedValuationResult
          valuationId={hydratedId}
          displayMode="full"
          vehicleInfo={vehicleInfo}
          estimatedValue={data.estimatedValue || 0}
          confidenceScore={data.confidenceScore || 85}
          priceRange={priceRange}
          adjustments={adjustments}
        />
      </div>
    </MainLayout>
  );
}
