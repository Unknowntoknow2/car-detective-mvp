
import React from 'react';
import { useEffect, useState } from 'react';
import { UnifiedValuationResult } from './UnifiedValuationResult';

interface ValuationResultProps {
  valuationId?: string;
  manualValuation?: any;
}

// This is a compatibility layer for the old component
export const ValuationResult: React.FC<ValuationResultProps> = ({ 
  valuationId, 
  manualValuation
}) => {
  const [hydratedId, setHydratedId] = useState<string | undefined>(valuationId);

  useEffect(() => {
    console.log('ValuationResult component loaded');
    console.log('Initial valuationId from props:', valuationId);
    console.log('Initial manualValuation:', manualValuation);
    
    // If no valuationId is provided as prop, try to get it from localStorage
    if (!valuationId && !manualValuation) {
      const localId = localStorage.getItem('latest_valuation_id');
      if (localId) {
        console.log("Retrieved valuationId from localStorage:", localId);
        setHydratedId(localId);
      } else {
        console.warn("No valuationId found in localStorage");
      }
    }
  }, [valuationId, manualValuation]);

  if (!hydratedId && !manualValuation) {
    console.warn("No valuationId or manualValuation available for rendering results");
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-2">
          No valuation result found. Please try submitting your vehicle details again.
        </p>
        <p className="text-sm text-muted-foreground">
          If you just completed a VIN lookup, the results may still be processing.
        </p>
      </div>
    );
  }

  console.log("Rendering UnifiedValuationResult with:", {
    valuationId: hydratedId,
    hasManualValuation: !!manualValuation
  });

  return (
    <UnifiedValuationResult
      valuationId={hydratedId}
      manualValuation={manualValuation}
      displayMode="simple"
    />
  );
};

// Make sure it's also exported as default
export default ValuationResult;
