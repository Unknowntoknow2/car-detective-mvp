
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForecastErrorProps {
  error: string;
  onRetry: () => void;
}

export function ForecastError({ error, onRetry }: ForecastErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Forecast</h3>
      <p className="text-red-700 mb-4">
        {error || "There was a problem generating the forecast data. Please try again."}
      </p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="border-red-300 text-red-700 hover:bg-red-50"
      >
        Try Again
      </Button>
    </div>
  );
}
