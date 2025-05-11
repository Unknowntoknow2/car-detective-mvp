
import { useState, useEffect } from 'react';

export function useValuationId(searchParamsId?: string | null) {
  const [valuationId, setValuationId] = useState<string | undefined>(
    searchParamsId || undefined
  );
  const [manualData, setManualData] = useState<any>(null);

  // Try to get valuationId from various sources
  useEffect(() => {
    const getValuationId = () => {
      // First check URL query param (highest priority)
      if (searchParamsId) {
        console.log('Using ID from URL parameters:', searchParamsId);
        return searchParamsId;
      }
      
      // Then check latest_valuation_id in localStorage
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId) {
        console.log('Retrieved valuationId from localStorage:', storedId);
        return storedId;
      }
      
      // Check if manual valuation data exists
      const manualData = localStorage.getItem('manual_valuation_data');
      if (manualData) {
        try {
          const parsedData = JSON.parse(manualData);
          setManualData(parsedData);
          console.log('Retrieved manual valuation data from localStorage');
          return parsedData.valuationId;
        } catch (e) {
          console.error('Error parsing manual valuation data:', e);
        }
      }
      
      // Also check temp_valuation_data as last resort
      const tempData = localStorage.getItem('temp_valuation_data');
      if (tempData) {
        try {
          const parsedTempData = JSON.parse(tempData);
          setManualData(parsedTempData);
          console.log('Retrieved temporary valuation data');
          return parsedTempData.id;
        } catch (e) {
          console.error('Error parsing temp valuation data:', e);
        }
      }
      
      return undefined;
    };

    const id = getValuationId();
    if (id && id !== valuationId) {
      setValuationId(id);
    }
  }, [searchParamsId, valuationId]);

  return { valuationId, manualData };
}
