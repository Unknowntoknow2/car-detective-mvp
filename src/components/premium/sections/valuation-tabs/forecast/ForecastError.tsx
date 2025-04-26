
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/premium/common/ErrorState";

interface ForecastErrorProps {
  error: string;
  onRetry: () => void;
}

export function ForecastError({ error, onRetry }: ForecastErrorProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <ErrorState 
          title="Forecast Error" 
          message={error}
          onRetry={onRetry}
          icon={<AlertTriangle className="h-12 w-12 text-red-500" />}
        />
      </CardContent>
    </Card>
  );
}
