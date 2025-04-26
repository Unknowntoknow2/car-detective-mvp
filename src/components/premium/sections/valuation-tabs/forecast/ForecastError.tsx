
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastErrorProps {
  error: string;
  onRetry: () => void;
}

export function ForecastError({ error, onRetry }: ForecastErrorProps) {
  return (
    <Card className="bg-red-50 border-red-100">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Forecast Error</h3>
          <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
          <Button 
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
