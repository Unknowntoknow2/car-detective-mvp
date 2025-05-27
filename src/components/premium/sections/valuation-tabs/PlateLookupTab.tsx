
import React from 'react';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';

interface PlateLookupTabProps {
  plateValue: string;
  plateState: string;
  isLoading: boolean;
  vehicle: any;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
}

export function PlateLookupTab({
  plateValue,
  plateState,
  isLoading,
  vehicle,
  onPlateChange,
  onStateChange,
  onLookup
}: PlateLookupTabProps) {
  const handleSubmit = (plate: string, state: string) => {
    onPlateChange(plate);
    onStateChange(state);
    onLookup();
  };

  return (
    <UnifiedPlateLookup 
      onSubmit={handleSubmit}
      showHeader={false}
    />
  );
}
