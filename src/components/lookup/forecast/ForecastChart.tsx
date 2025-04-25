
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForecast } from '@/hooks/useForecast';
import { ForecastTrendIndicator } from './ForecastTrendIndicator';
import { ForecastMetrics } from './ForecastMetrics';

interface ForecastChartProps {
  valuationId: string;
  basePrice: number;
}

export function ForecastChart({ valuationId, basePrice }: ForecastChartProps) {
  const { forecastData, isLoading, error } = useForecast(valuationId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading forecast data...</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Forecast Unavailable</CardTitle>
          <CardDescription>Unable to generate forecast at this time</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">12-Month Value Forecast</CardTitle>
          <CardDescription>Projected value trend based on market data analysis</CardDescription>
        </div>
        <ForecastTrendIndicator trend={forecastData.valueTrend} />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData.forecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Estimated Value']}
                labelFormatter={(label) => `Forecast for ${label}`}
              />
              <Legend />
              <ReferenceLine 
                y={basePrice} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3"
                label={{ 
                  position: 'right',
                  value: 'Current Value',
                  fill: 'hsl(var(--primary))',
                  fontSize: 12
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
          bestTimeToSell={forecastData.bestTimeToSell}
          percentageChange={forecastData.percentageChange}
          lowestValue={forecastData.lowestValue}
          highestValue={forecastData.highestValue}
        />
      </CardContent>
    </Card>
  );
}
