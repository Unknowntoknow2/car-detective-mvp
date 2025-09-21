import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConsolidatedForecastData {
  forecast: Array<{
    month: string;
    value: number;
  }>;
  percentageChange: string;
  bestTimeToSell?: string;
  confidenceScore: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface ConsolidatedForecastResult {
  forecastData: ConsolidatedForecastData | null;
  loading: boolean;
  error: string | null;
}

export function useConsolidatedForecast(
  valuationId: string,
  isPremium: boolean = true
): ConsolidatedForecastResult {
  const [forecastData, setForecastData] = useState<ConsolidatedForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      if (!isPremium) {
        setError("Premium access required for market forecasting");
        setLoading(false);
        return;
      }

      if (!valuationId) {
        setError("Valuation ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        
        const { data, error: invokeError } = await supabase.functions.invoke(
          "valuation-forecast",
          {
            body: { valuationId },
          }
        );

        if (invokeError) {
          console.error('❌ Edge function error:', invokeError);
          throw new Error(`Forecast service error: ${invokeError.message}`);
        }

        if (!data) {
          throw new Error('No forecast data returned from service');
        }


        // Validate required data
        if (!data.months || !data.values || data.values.length === 0) {
          setError("Insufficient market data available for accurate forecasting");
          return;
        }

        // Transform to consolidated format
        const consolidatedData: ConsolidatedForecastData = {
          forecast: data.months.map((month: string, index: number) => ({
            month,
            value: data.values[index] || 0,
          })),
          percentageChange: data.percentageChange || "0.0",
          bestTimeToSell: data.bestTimeToSell || "Market conditions are stable",
          confidenceScore: data.confidenceScore || 50,
          trend: data.trend || "stable",
        };

        setForecastData(consolidatedData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error("❌ Forecast fetch error:", errorMessage);
        setError(`Failed to load forecast: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [valuationId, isPremium]);

  return { forecastData, loading, error };
}