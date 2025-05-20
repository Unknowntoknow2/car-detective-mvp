// src/hooks/useVinDecoder.ts

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VinData {
  vin: string;
  make: string;
  model: string;
  modelYear: number | string;
  vehicleType?: string;
  bodyClass?: string;
  driveType?: string;
  fuelType?: string;
  engine?: string;
  engineSize?: number | string;
  engineCylinders?: number | string;
  transmissionStyle?: string;
  manufacturer?: string;
  plantCountry?: string;
  plantState?: string;
  plantCity?: string;
  series?: string;
  trim?: string;
  doors?: number | string;
  grossVehicleWeight?: string;
  // ...any other fields you expect
}

export function useVinDecoder(vin: string) {
  const [data, setData] = useState<VinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin || vin.length !== 17) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    supabase.functions
      .invoke<any>("fetch_vpic_data", { body: { vin } })
      .then((response) => {
        if (response.error) {
          setError(response.error.message || "Unknown error");
          setData(null);
        } else if (response.data?.data) {
          setData(response.data.data);
        } else {
          setError("No data received");
          setData(null);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch VIN data");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [vin]);

  return { data, loading, error };
}
