
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForecast } from "@/hooks/useForecast";
import { ForecastTrendIndicator } from "./ForecastTrendIndicator";
import { ForecastMetrics } from "./ForecastMetrics";

interface ForecastChartProps {
  valuationId: string;
  basePrice: number;
}

// Map forecast trend values to component expected values
const mapTrendValue = (trend: 'up' | 'down' | 'stable'): 'increasing' | 'decreasing' | 'stable' => {
  switch (trend) {
    case 'up':
      return 'increasing';
    case 'down':
      return 'decreasing';
    case 'stable':
    default:
      return 'stable';
  }
};

export function ForecastChart({ valuationId, basePrice }: ForecastChartProps) {
  const { forecastData, isLoading, error } = useForecast(valuationId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading forecast data...</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Forecast Unavailable</CardTitle>
          <CardDescription>
            Unable to generate forecast at this time
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  // Map the trend value for the component
  const mappedTrend = forecastData.valueTrend ? mapTrendValue(forecastData.valueTrend) : 'stable';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            12-Month Value Forecast
          </CardTitle>
          <CardDescription>
            Projected value trend based on market data analysis
          </CardDescription>
        </div>
        <ForecastTrendIndicator trend={mappedTrend} />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData.forecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip
                formatter={(
                  value: number,
                ) => [formatCurrency(value), "Estimated Value"]}
                labelFormatter={(label) => `Forecast for ${label}`}
              />
              <Legend />
              <ReferenceLine
                y={basePrice}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                label={{
                  position: "right",
                  value: "Current Value",
                  fill: "hsl(var(--primary))",
                  fontSize: 12,
                }}
              />
              <Line
                name="Forecast Value"
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ForecastMetrics
          bestTimeToSell={forecastData.bestTimeToSell || 'Spring'}
          percentageChange={forecastData.percentageChange || '0%'}
          lowestValue={forecastData.lowestValue || basePrice}
          highestValue={forecastData.highestValue || basePrice}
        />
      </CardContent>
    </Card>
  );
}
