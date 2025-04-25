
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
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import type { ForecastPoint } from '@/utils/forecasting/valuation-forecast';

interface ForecastChartProps {
  data: ForecastPoint[];
  basePrice: number;
  valueTrend: 'increasing' | 'decreasing' | 'stable';
}

export function ForecastChart({ data, basePrice, valueTrend }: ForecastChartProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);

  // Calculate the domain padding to ensure consistent visual spacing
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;

  // Get trend color
  const getTrendColor = () => {
    switch (valueTrend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (valueTrend) {
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
            {valueTrend === 'increasing' ? 'Appreciating' : 
             valueTrend === 'decreasing' ? 'Depreciating' : 'Stable'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
              />
              <YAxis 
                domain={[minValue - padding, maxValue + padding]}
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
                strokeWidth={1}
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
      </CardContent>
    </Card>
  );
}
