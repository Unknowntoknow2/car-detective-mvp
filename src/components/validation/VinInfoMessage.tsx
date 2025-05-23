
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function VinInfoMessage() {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>
        Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
}

export default VinInfoMessage;
