
import React from 'react';
import { Info } from 'lucide-react';

export const VinInfoMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
      <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <p>
        The VIN (Vehicle Identification Number) is a 17-character code that can be found on your vehicle's
        registration, insurance card, or on the driver's side dashboard.
      </p>
    </div>
  );
};
