
import React from 'react';
import { UnifiedValuationResult } from './UnifiedValuationResult';

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: VehicleInfo;
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

// This is a compatibility layer for the old component
export const ValuationResults: React.FC<ValuationResultsProps> = (props) => {
  return (
    <UnifiedValuationResult
      {...props}
      displayMode="detailed"
    />
  );
};

// No need for default export as the original didn't have one
