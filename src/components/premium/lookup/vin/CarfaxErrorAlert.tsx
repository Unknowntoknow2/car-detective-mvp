
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface CarfaxErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function CarfaxErrorAlert({ error, onRetry }: CarfaxErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Carfax Lookup Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error || "Unable to fetch Carfax data for this VIN. Please try again or enter vehicle details manually."}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export interface CarfaxData {
  accidents: number;
  ownerCount: number;
  serviceRecords: number;
  recalls: number;
  lastServiceDate?: string;
  title: string;
  vehicleUse?: string;
}
