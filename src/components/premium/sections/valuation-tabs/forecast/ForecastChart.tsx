
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { LoadingState } from '@/components/premium/common/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

interface ForecastChartProps {
  data: Array<{ month: string; value: number }>;
  isLoading: boolean;
  basePrice: number;
}

export function ForecastChart({ data, isLoading, basePrice }: ForecastChartProps) {
  // Add today's marker to chart data
  const chartData = useMemo(() => {
    // Determine if forecast is generally going up or down
    const trend = data.length > 0 && data[data.length - 1].value > basePrice ? 'up' : 'down';
    
    // Calculate confidence intervals (mock implementation)
    return data.map((point, index) => {
      // Calculate uncertainty that increases with time
      const uncertainty = 0.02 + (index / data.length) * 0.08;
      
      return {
        ...point,
        upper: Math.round(point.value * (1 + uncertainty)),
        lower: Math.round(point.value * (1 - uncertainty)),
        // Add confidence intervals and seasonal adjustments
        seasonal: trend === 'up' 
          ? point.value + Math.sin(index / 3) * 200
          : point.value + Math.sin(index / 3) * 200
      };
    });
  }, [data, basePrice]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 h-[350px] flex items-center justify-center">
          <LoadingState text="Generating forecast..." />
        </CardContent>
      </Card>
    );
  }
  
  // Format for large numbers ($10,000 becomes $10K)
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">12-Month Value Forecast</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#94a3b8"
              />
              <YAxis 
                tickFormatter={formatValue}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#94a3b8"
                width={60}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Estimated Value']}
                labelFormatter={(month) => `Forecast: ${month}`}
                contentStyle={{ 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}
              />
              
              {/* Current value marker */}
              <ReferenceLine 
                x={chartData[0]?.month} 
                stroke="#7c3aed" 
                strokeWidth={2}
                strokeDasharray="3 3"
              >
                <Label 
                  value="Today" 
                  position="insideTopLeft" 
                  fill="#7c3aed"
                  fontSize={12}
                  offset={10}
                />
              </ReferenceLine>
              
              {/* Confidence interval area */}
              <Line
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="transparent"
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="transparent"
              />
              
              {/* Main forecast line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#7c3aed" }}
              />
              
              {/* Seasonal adjusted line (lighter color) */}
              <Line
                type="monotone"
                dataKey="seasonal"
                stroke="#c4b5fd"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 bg-primary rounded-sm"></div>
            <span>Base Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-4 bg-primary/30 rounded-sm"></div>
            <span>Seasonal Adjustment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
