
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PriceDistributionChartProps {
  distribution: number[];
  listingCount: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
  priceRange: {
    lowest: number;
    average: number;
    highest: number;
  };
}

export function PriceDistributionChart({ 
  distribution, 
  listingCount,
  vehicleInfo,
  priceRange
}: PriceDistributionChartProps) {
  const range = priceRange.highest - priceRange.lowest;
  const step = range / (distribution.length - 1);
  
  const chartData = distribution.map((count, index) => {
    const price = Math.round(priceRange.lowest + (step * index));
    
    return {
      price: `$${(price / 1000).toFixed(0)}k`,
      count,
      rawPrice: price,
      isAverage: Math.abs(price - priceRange.average) < step / 2
    };
  });
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-md">
          <p className="text-sm text-slate-500">Price Range</p>
          <p className="font-medium">{payload[0].payload.price}</p>
          <p className="text-primary font-semibold mt-1">
            {payload[0].value} {payload[0].value === 1 ? 'listing' : 'listings'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Price Distribution
        </CardTitle>
        <p className="text-sm text-slate-500">
          {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim || ""} 
          ({listingCount} listings)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <XAxis 
                dataKey="price" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#9b87f5"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Your estimated value: ${priceRange.average.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Based on market listings
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
