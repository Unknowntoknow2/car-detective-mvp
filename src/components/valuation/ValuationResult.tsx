
import React from 'react';
import { UnifiedValuationResult } from './UnifiedValuationResult';

interface ValuationResultProps {
  valuationId: string;
  manualValuation?: any;
  photoCondition?: any;
}

// This is a compatibility layer for the old component
export const ValuationResult: React.FC<ValuationResultProps> = ({ 
  valuationId, 
  manualValuation,
  photoCondition 
}) => {
  return (
    <UnifiedValuationResult
      valuationId={valuationId}
      manualValuation={manualValuation}
      photoCondition={photoCondition}
      displayMode="simple"
    />
  );
};

// Make sure it's also exported as default
export default ValuationResult;
