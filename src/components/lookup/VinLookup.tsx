
import React from 'react';
import { UnifiedVinLookup } from './UnifiedVinLookup';

// Main VIN Lookup component that serves as the primary entry point
const VinLookup: React.FC<{
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
  onResultsReady?: (result: any) => void;
}> = ({ onSubmit, isLoading, onResultsReady }) => {
  return (
    <UnifiedVinLookup
      onSubmit={onSubmit}
      showHeader={true}
      className="max-w-2xl mx-auto"
    />
  );
};

export default VinLookup;
