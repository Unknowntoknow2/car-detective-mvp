
import React from 'react';
import { UnifiedPlateLookup, UnifiedPlateLookupProps } from './plate/UnifiedPlateLookup';

export interface PlateLookupProps extends Omit<UnifiedPlateLookupProps, 'tier'> {
  tier?: 'free' | 'premium';
}

export const PlateLookup: React.FC<PlateLookupProps> = ({ 
  tier = 'free',
  ...props 
}) => {
  return (
    <UnifiedPlateLookup
      tier={tier}
      showPremiumFeatures={tier === 'free'}
      includePremiumBadging={true}
      {...props}
    />
  );
};

export default PlateLookup;
