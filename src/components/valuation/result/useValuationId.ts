
import { useState, useEffect } from 'react';

export const useValuationId = (propValuationId?: string) => {
  const [localValuationId, setLocalValuationId] = useState<string | undefined>(propValuationId);
  
  // Try to recover valuationId from localStorage if not provided
  useEffect(() => {
    if (!localValuationId) {
      const storedValuation = localStorage.getItem('latest_valuation_id');
      if (storedValuation) {
        console.log("Retrieved valuationId from localStorage:", storedValuation);
        setLocalValuationId(storedValuation);
      }
    }
  }, [localValuationId]);

  return {
    localValuationId
  };
};
