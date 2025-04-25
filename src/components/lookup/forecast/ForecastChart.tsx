
import React, { useState, useEffect } from 'react';
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
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import type { ForecastPoint, ForecastResult } from '@/utils/forecasting/valuation-forecast';

interface ForecastChartProps {
  valuationId: string;
  basePrice: number;
}

export function ForecastChart({ valuationId, basePrice }: ForecastChartProps) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/valuation-forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ valuationId })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        
        const data = await response.json();
        setForecastData(data);
      } catch (err) {
        setError('Failed to load forecast data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (valuationId) {
      fetchForecast();
    }
  }, [valuationId]);

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

  const getTrendColor = () => {
    switch (forecastData.valueTrend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = () => {
    switch (forecastData.valueTrend) {
      case 'increasing': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'decreasing': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <BarChart2 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">12-Month Value Forecast</CardTitle>
          <CardDescription>Projected value trend based on market data analysis</CardDescription>
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor()} bg-opacity-10 px-2 py-1 rounded-full`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {forecastData.valueTrend === 'increasing' ? 'Appreciating' : 
             forecastData.valueTrend === 'decreasing' ? 'Depreciating' : 'Stable'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData.forecast}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
              />
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">Best Time to Sell</p>
            <p className="text-lg">{forecastData.bestTimeToSell}</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">12-Month Change</p>
            <p className={`text-lg ${forecastData.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {forecastData.percentageChange}%
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">Value Range</p>
            <p className="text-lg">
              ${forecastData.lowestValue.toLocaleString()} - ${forecastData.highestValue.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
