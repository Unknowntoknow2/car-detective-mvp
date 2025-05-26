
import React from 'react';
import { Car } from 'lucide-react';

export function CarFinderQaherHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Car className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Car Finder Qaher</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Advanced Vehicle Intelligence & Valuation System
      </p>
    </div>
  );
}
