
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePrediction } from "@/hooks/usePrediction";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface PredictionResultProps {
  valuationId?: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const { price, isLoading, error, getPrediction } = usePrediction(valuationId);

  // Auto-fetch prediction when component mounts and valuationId is available
  useEffect(() => {
    if (valuationId) {
      getPrediction();
    }
  }, [valuationId, getPrediction]);

  if (!valuationId) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Complete the valuation form to get a prediction</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Predicted Market Value</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => getPrediction()}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update
          </Button>
        </div>

        {error ? (
          <p className="text-destructive">{error}</p>
        ) : isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Calculating...</p>
          </div>
        ) : price ? (
          <p className="text-3xl font-bold">${price.toLocaleString()}</p>
        ) : (
          <Button onClick={() => getPrediction()}>
            Get Prediction
          </Button>
        )}
      </div>
    </Card>
  );
}
