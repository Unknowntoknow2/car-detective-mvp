
import React from "react";
import {
  ErrorState,
  MarketTrendContent,
  useForecastData,
} from "./market-trend";
import LoadingState from "@/modules/valuation-result/components/LoadingState";
import { PremiumFeatureLock } from "@/components/valuation/market-trend/PremiumLockSection";

interface MarketTrendSectionProps {
  valuationId: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function MarketTrendSection({
  valuationId,
  make,
  model,
  year,
  estimatedValue,
  isPremium,
  onUpgrade,
}: MarketTrendSectionProps) {
  const { forecastData, loading, error, trend } = useForecastData({
    valuationId,
    make,
    model,
    year,
    estimatedValue,
    isPremium,
  });

  if (!isPremium) {
    return <PremiumFeatureLock onUpgrade={onUpgrade} />;
  }

  if (loading) {
    return <LoadingState message="Loading market trends..." />;
  }

  if (error || !forecastData) {
    return (
      <ErrorState
        message={error || "Unable to load market forecast data"}
      />
    );
  }

  return (
    <MarketTrendContent
      trend={trend}
      forecastData={forecastData}
      year={year}
      make={make}
      model={model}
    />
  );
}

export default MarketTrendSection;
