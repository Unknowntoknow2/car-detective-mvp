
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CarfaxErrorAlertProps {
  error: string;
}

export const CarfaxErrorAlert: React.FC<CarfaxErrorAlertProps> = ({ error }) => {
  return (
    <div className="mt-4 p-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{error} This doesn't affect the vehicle details lookup.</p>
    </div>
  );
};
