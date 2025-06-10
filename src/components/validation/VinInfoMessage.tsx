
import React from 'react';
import { Info } from 'lucide-react';

export const VinInfoMessage: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
      <Info className="h-4 w-4" />
      <span>VIN must be exactly 17 characters (letters and numbers, excluding I, O, Q)</span>
    </div>
  );
};
