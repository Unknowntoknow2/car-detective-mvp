
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValuationErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function ValuationErrorState({ error, onRetry }: ValuationErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
        <div>
          <h3 className="font-medium text-red-800">Error</h3>
          <p className="text-red-700">{error || "Failed to process vehicle valuation"}</p>
          {onRetry && (
            <Button variant="outline" className="mt-2" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
