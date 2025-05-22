
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CarfaxErrorAlertProps {
  error: string;
}

export function CarfaxErrorAlert({ error }: CarfaxErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>CARFAX® Report Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
