
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface MarketTrendChartProps {
  data: any[];
}

export function MarketTrendChart({ data }: MarketTrendChartProps) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            activeDot={{ r: 8 }} 
            name="Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
