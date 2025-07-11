import { useEffect, useState } from "react";
import type { ForecastResult } from "@/utils/forecasting/valuation-forecast";

// DEPRECATED: Use useForecastData from MarketTrendSection instead
export function useForecast(valuationId: string) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>('This hook is deprecated. Use useForecastData from MarketTrendSection instead.');

  useEffect(() => {
    console.error('❌ DEPRECATED: useForecast hook is deprecated. Use useForecastData from MarketTrendSection instead.');
    setError('This hook is deprecated. Use useForecastData from MarketTrendSection instead.');
    setIsLoading(false);
  }, [valuationId]);

  return { forecastData, isLoading, error };
}