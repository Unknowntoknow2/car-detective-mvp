import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MarketComparisonProps {
  data: { price: number; count: number }[];
  yourVehiclePrice: number;
}

export const MarketComparison = ({ data, yourVehiclePrice }: MarketComparisonProps) => {
  const transformedData = data.map(item => ({
    price: item.price,
    count: item.count
  }));

  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  // Fix the bar fill color prop
  const barFill = "#3b82f6"; // Use a static color instead of a function

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Price distribution of similar vehicles in your area.
        </p>
      
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="price" tickFormatter={formatCurrency} />
            <YAxis />
            <Tooltip 
              formatter={formatTooltipValue} 
              labelFormatter={formatCurrency} 
            />
            <Bar 
              dataKey="count" 
              fill={barFill} // Use static color
              radius={[4, 4, 0, 0]}
            />
            {/* Linear market average line */}
            <ReferenceLine
              x={yourVehiclePrice}
              stroke="#10b981"
              strokeWidth={2}
              label={{
                value: "Your Vehicle",
                position: "top",
                fill: "#10b981",
                fontSize: 12,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      </CardContent>
    </Card>
  );
};
