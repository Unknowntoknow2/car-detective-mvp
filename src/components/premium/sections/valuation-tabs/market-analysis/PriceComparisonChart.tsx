
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleData {
  make: string;
  model: string;
  year: number;
  zipCode: string;
}

interface PriceComparisonChartProps {
  vehicleData: VehicleData;
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Value: {formatCurrency(data.value)}
        </p>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {data.description}
          </p>
        )}
      </div>
    );
  }
  
  return null;
};

export function PriceComparisonChart({ 
  vehicleData, 
  averagePrices, 
  priceRange, 
  estimatedValue, 
  normalizedValue 
}: PriceComparisonChartProps) {
  const { make, model, year, zipCode } = vehicleData;
  
  // Prepare data for chart
  const chartData = [
    {
      name: 'Retail',
      value: averagePrices.retail,
      fill: '#8884d8',
      description: 'Average dealer retail price for similar vehicles'
    },
    {
      name: 'Private',
      value: averagePrices.private,
      fill: '#82ca9d',
      description: 'Average private party sale price'
    },
    {
      name: 'Auction',
      value: averagePrices.auction,
      fill: '#ffc658',
      description: 'Average auction sale price (wholesale)'
    },
    {
      name: 'Your Vehicle',
      value: normalizedValue,
      fill: '#ff7300',
      description: 'Your vehicle value adjusted for mileage and condition'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          {year} {make} {model} in {zipCode}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, "compact")} 
                domain={[0, Math.max(priceRange.max * 1.1, normalizedValue * 1.1)]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" />
              <ReferenceLine
                y={estimatedValue}
                stroke="#ff0000"
                strokeDasharray="3 3"
                label={{ value: 'Base Value', position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Price Range</p>
            <p>{formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}</p>
          </div>
          <div>
            <p className="font-medium">Market Average</p>
            <p>{formatCurrency(averagePrices.overall)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
