import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

interface MarketComparisonProps {
  estimatedValue: number;
  marketData?: {
    label: string;
    value: number;
  }[];
  isPremium?: boolean;
}

const MarketComparison: React.FC<MarketComparisonProps> = ({
  estimatedValue,
  marketData,
  isPremium = false
}) => {
  // If no market data is provided, create some sample data
  const data = marketData || [
    { label: 'Private Sale', value: Math.round(estimatedValue * 1.05) },
    { label: 'Your Vehicle', value: estimatedValue },
    { label: 'Trade-In', value: Math.round(estimatedValue * 0.85) },
    { label: 'Auction', value: Math.round(estimatedValue * 0.8) }
  ];

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].payload.label}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Market Comparison</span>
          {!isPremium && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              Premium Feature
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPremium ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={40}
              >
                <XAxis
                  dataKey="label"
                  scale="band"
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[
                    Math.floor(Math.min(...data.map(item => item.value)) * 0.9),
                    Math.ceil(Math.max(...data.map(item => item.value)) * 1.1)
                  ]}
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill={(entry) => entry.label === 'Your Vehicle' ? '#3b82f6' : '#93c5fd'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-md p-4">
            <Info className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Market Comparison</h3>
            <p className="text-gray-500 text-center mt-2 max-w-xs">
              Upgrade to premium to see how your vehicle compares to different market segments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketComparison;
