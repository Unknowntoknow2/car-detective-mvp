
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Informational component to explain VIN format
 */
export const VinInfoMessage: React.FC = () => {
  return (
    <div className="text-xs text-slate-500 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
};
