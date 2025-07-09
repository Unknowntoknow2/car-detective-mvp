import { useEffect, useState } from "react";
import { formatCurrency as formatCurrencyUtil } from "@/utils/formatters";

// ValuationData type declaration
export type ValuationData = {
  id?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
    source?: string; // Data source for the adjustment
    timestamp?: string; // When the adjustment was calculated
  }>;
  explanation?: string;
  fuelType?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  } | null;
  dataSource?: {
    marketListings?: number; // Number of real market listings used
    calculationMethod?: string; // How the value was calculated
    dataSourcesUsed?: string[]; // List of data sources
    timestamp?: string; // When the calculation was performed
  };
};

export interface PremiumCheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
  alreadyUnlocked?: boolean;
}

// Formatting utility
export const formatCurrency = (value: number): string => {
  return formatCurrencyUtil(value);
};

// Hook for derived valuation logic
export const useValuationLogic = (data?: ValuationData) => {
  const [priceRange, setPriceRange] = useState<{ low: number; high: number }>({
    low: 0,
    high: 0,
  });
  const [marketTrend, setMarketTrend] = useState<"up" | "down" | "stable">(
    "stable",
  );
  const [recommendation, setRecommendation] = useState<"buy" | "sell" | "hold">(
    "hold",
  );
  const [recommendationText, setRecommendationText] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [confidenceColor, setConfidenceColor] = useState("");

  useEffect(() => {
    if (!data) return;

    // Only calculate price range if confidence score is available from real data
    if (data.confidenceScore && data.confidenceScore > 0) {
      const confidenceModifier = data.confidenceScore / 100;
      const range = Math.round(
        data.estimatedValue * (1 - confidenceModifier) * 0.15,
      );

      setPriceRange({
        low: Math.max(0, data.estimatedValue - range),
        high: data.estimatedValue + range,
      });
    } else {
      // No confidence data available - set to zero to indicate missing data
      setPriceRange({ low: 0, high: 0 });
    }

    // Market trend must come from real market data - no mock values
    // This would be set from actual market analysis data
    setMarketTrend("stable"); // Default only - real implementation would use market data

    // Set recommendation based on trend and condition
    const condition = data.condition?.toLowerCase() || "good";
    let rec: "buy" | "sell" | "hold" = "hold";

    if (
      marketTrend === "up" &&
      ["excellent", "very good", "good"].includes(condition)
    ) {
      rec = "hold";
    } else if (marketTrend === "up" && ["fair", "poor"].includes(condition)) {
      rec = "sell";
    } else if (
      marketTrend === "down" && ["excellent", "very good"].includes(condition)
    ) {
      rec = "hold";
    } else if (marketTrend === "down") {
      rec = "sell";
    } else if (
      marketTrend === "stable" && ["excellent", "very good"].includes(condition)
    ) {
      rec = "hold";
    } else {
      rec = "sell";
    }

    setRecommendation(rec);

    // Set recommendation text
    let text = "";
    if (rec === "sell") {
      text = "Consider selling now to maximize value";
    } else if (rec === "hold") {
      text = "This vehicle should maintain its value";
    } else {
      text = "Good time to buy at this price point";
    }
    setRecommendationText(text);

    // Set confidence level and color only if real confidence data exists
    const score = data.confidenceScore || 0;
    let level: "low" | "medium" | "high" = "low";
    let color = "";

    if (!data.confidenceScore) {
      // No confidence data available
      level = "low";
      color = "text-muted-foreground";
    } else if (score >= 85) {
      level = "high";
      color = "text-success-dark";
    } else if (score >= 70) {
      level = "medium";
      color = "text-primary";
    } else {
      level = "low";
      color = "text-warning-dark";
    }

    setConfidenceLevel(level);
    setConfidenceColor(color);
  }, [data]);

  return {
    priceRange,
    marketTrend,
    recommendation,
    recommendationText,
    confidenceLevel,
    confidenceColor,
  };
};
