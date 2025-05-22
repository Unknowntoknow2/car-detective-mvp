
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
    auction: number;
    private: number;
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
  const { make, model, year } = vehicleData;
  
  // Format data for the chart
  const chartData = [
    {
      name: 'Retail',
      value: averagePrices.retail,
      fill: '#4f46e5'
    },
    {
      name: 'Private',
      value: averagePrices.private,
      fill: '#0ea5e9'
    },
    {
      name: 'Auction',
      value: averagePrices.auction,
      fill: '#10b981'
    },
    {
      name: 'Our Estimate',
      value: normalizedValue,
      fill: '#f97316'
    }
  ].filter(item => item.value > 0);
  
  // If we have no data, show placeholder message
  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-sm mb-2">
              No price comparison data available for
            </p>
            <p className="font-medium">
              {year} {make} {model}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded shadow p-2">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h3 className="font-medium">
          Price Comparison for {year} {make} {model}
        </h3>
        <div className="text-sm text-muted-foreground">
          Price Range: {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })} 
              domain={[0, Math.max(priceRange.max * 1.1, normalizedValue * 1.1)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8" />
            <ReferenceLine
              y={estimatedValue}
              stroke="#f97316"
              strokeDasharray="3 3"
              label={{ 
                position: 'top', 
                value: 'Base Value', 
                fill: '#f97316',
                fontSize: 12 
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
