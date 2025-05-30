
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PricePoint {
  price: number;
  date: string;
  source: string;
}

interface AuctionIntelligencePriceChartProps {
  data: PricePoint[];
}

export function AuctionIntelligencePriceChart({ data }: AuctionIntelligencePriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-muted-foreground text-sm">
        No price data available
      </div>
    );
  }

  // Prepare chart data
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((point, index) => ({
      index: index + 1,
      price: point.price,
      date: new Date(point.date).toLocaleDateString(),
      source: point.source,
      fullDate: point.date
    }));

  const formatPrice = (value: number) => `$${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.date}</p>
          <p className="text-sm text-blue-600">{formatPrice(data.price)}</p>
          <p className="text-xs text-muted-foreground">{data.source}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="index" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickFormatter={formatPrice}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
