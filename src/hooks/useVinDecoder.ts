
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecodedVehicleInfo } from "@/types/vehicle";

interface VinDecoderResult {
  isLoading: boolean;
  error: string | null;
  result: DecodedVehicleInfo | null;
  lookupVin: (vin: string) => Promise<void>;
  valuationId?: string;
}

export function useVinDecoder(): VinDecoderResult {
  const [result, setResult] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);

  const lookupVin = useCallback(async (vin: string) => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: apiError } = await supabase.functions
        .invoke("vin-decoder", { body: { vin } });

      if (apiError) {
        setError(apiError.message || "Failed to decode VIN");
        setResult(null);
      } else if (data?.data) {
        setResult(data.data as DecodedVehicleInfo);
        if (data.valuationId) {
          setValuationId(data.valuationId);
        }
      } else {
        setError("No data received for this VIN");
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the VIN");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, result, lookupVin, valuationId };
}
