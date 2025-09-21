import { useEffect, useState } from "react";

export function useValuationId(searchParamsId?: string | null) {
  const [valuationId, setValuationId] = useState<string | undefined>(
    searchParamsId || undefined,
  );
  const [manualData, setManualData] = useState<any>(null);

  // Try to get valuationId from various sources
  useEffect(() => {
    const getValuationId = () => {
      // First check URL query param (highest priority)
      if (searchParamsId) {
        return searchParamsId;
      }

      // Then check latest_valuation_id in localStorage
      const storedId = localStorage.getItem("latest_valuation_id");
      if (storedId) {
        return storedId;
      }

      // Check if manual valuation data exists
      const manualData = localStorage.getItem("manual_valuation_data");
      if (manualData) {
        try {
          const parsedData = JSON.parse(manualData);
          setManualData(parsedData);
          return parsedData.valuationId;
        } catch (e) {
        }
      }

      // Also check temp_valuation_data as last resort
      const tempData = localStorage.getItem("temp_valuation_data");
      if (tempData) {
        try {
          const parsedTempData = JSON.parse(tempData);
          setManualData(parsedTempData);
          return parsedTempData.id;
        } catch (e) {
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
