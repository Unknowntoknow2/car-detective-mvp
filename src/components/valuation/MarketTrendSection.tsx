
import React from 'react';
import { 
  PremiumLockSection,
  LoadingState,
  ErrorState,
  MarketTrendContent,
  useForecastData
} from './market-trend';

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
  onUpgrade
}: MarketTrendSectionProps) {
  const { forecastData, loading, error, trend } = useForecastData({
    valuationId,
    make,
    model,
    year,
    estimatedValue,
    isPremium
  });

  if (!isPremium) {
    return <PremiumLockSection onUpgrade={onUpgrade} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error || !forecastData) {
    return <ErrorState errorMessage={error || "Unable to load market forecast data"} />;
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
