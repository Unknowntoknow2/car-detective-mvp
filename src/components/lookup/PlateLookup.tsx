
import React from 'react';
import { UnifiedPlateLookup } from './plate/UnifiedPlateLookup';

export interface PlateLookupProps {
  tier?: 'free' | 'premium';
  onVehicleFound?: (vehicle: any) => void;
}

export const PlateLookup: React.FC<PlateLookupProps> = ({ 
  tier = 'free',
  onVehicleFound
}) => {
  return (
    <UnifiedPlateLookup />
  );
};

export default PlateLookup;
