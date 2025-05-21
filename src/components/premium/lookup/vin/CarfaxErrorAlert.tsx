
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CarfaxErrorAlertProps {
  error: string;
}

export const CarfaxErrorAlert: React.FC<CarfaxErrorAlertProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>CARFAX Error</AlertTitle>
      <AlertDescription>
        {error || "Unable to retrieve CARFAX vehicle history report."}
      </AlertDescription>
    </Alert>
  );
};
