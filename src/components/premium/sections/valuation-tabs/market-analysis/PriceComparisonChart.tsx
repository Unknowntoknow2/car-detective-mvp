
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface PriceComparisonChartProps {
  vehicleData: {
    make: string;
    model: string;
    year: number;
    zipCode?: string;
  };
  averagePrices: {
    retail: number;
    private: number;
    auction: number;
    overall: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  estimatedValue: number;
  normalizedValue: number;
}

export function PriceComparisonChart({
  vehicleData,
  averagePrices,
  priceRange,
  estimatedValue,
  normalizedValue
}: PriceComparisonChartProps) {
  const data = [
    {
      name: 'Auction',
      value: averagePrices.auction,
      fill: '#94a3b8'
    },
    {
      name: 'Private',
      value: averagePrices.private,
      fill: '#64748b'
    },
    {
      name: 'Retail',
      value: averagePrices.retail,
      fill: '#475569'
    },
    {
      name: 'Your Value',
      value: normalizedValue,
      fill: '#0ea5e9'
    }
  ];
  
  const min = Math.min(priceRange.min, ...data.map(item => item.value)) * 0.95;
  const max = Math.max(priceRange.max, ...data.map(item => item.value)) * 1.05;
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Price Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {vehicleData.year} {vehicleData.make} {vehicleData.model} in {vehicleData.zipCode || 'your area'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                domain={[min, max]}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={estimatedValue} 
                stroke="#0369a1" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Est. Value', 
                  fill: '#0369a1', 
                  fontSize: 12,
                  position: 'insideBottomRight'
                }} 
              />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Base estimated value: {formatCurrency(estimatedValue)}</p>
          <p>Your region adjusted value: {formatCurrency(normalizedValue)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
