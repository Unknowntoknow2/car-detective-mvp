
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForecastErrorProps {
  error: string;
  onRetry: () => void;
}

export function ForecastError({ error, onRetry }: ForecastErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Forecast Generation Failed</h3>
      <p className="text-red-700 mb-4">{error}</p>
      <Button variant="destructive" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
