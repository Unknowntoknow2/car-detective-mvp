
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ForecastErrorProps {
  error: string;
  onRetry: () => void;
}

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
  icon?: React.ReactNode;
}

function ErrorState({ title, message, onRetry, icon }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
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
