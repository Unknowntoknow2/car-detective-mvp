
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationErrorStateProps {
  error: string;
  title?: string;
  onRetry?: () => void;
  onManualEntry?: () => void;
}

export const ValuationErrorState: React.FC<ValuationErrorStateProps> = ({
  error,
  title = 'Valuation Error',
  onRetry,
  onManualEntry
}) => {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-700">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-700">{error}</p>
        
        <div className="mt-4 bg-white p-4 rounded-md border border-red-100">
          <h3 className="font-medium text-gray-900 mb-2">What you can do:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Check your network connection and try again</li>
            <li>• Make sure you've entered the correct information</li>
            <li>• Try our manual entry option instead</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onManualEntry && (
          <Button onClick={onManualEntry}>
            Enter Details Manually
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
