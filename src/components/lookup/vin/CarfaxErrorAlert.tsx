
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CarfaxErrorAlertProps {
  error: string;
}

export const CarfaxErrorAlert: React.FC<CarfaxErrorAlertProps> = ({ error }) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default CarfaxErrorAlert;
