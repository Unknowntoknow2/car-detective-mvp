
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MarketTrendsProps {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
  };
}

export function MarketTrends({ vehicleInfo }: MarketTrendsProps) {
  // Generate mock data for market trends
  const generateMockData = () => {
    const startPrice = Math.floor(Math.random() * 10000) + 20000;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => {
      // Create a slight downward trend with some variance
      const variance = (Math.random() * 1000) - 500;
      const depreciation = index * 120; // Average monthly depreciation
      return {
        name: month,
        value: startPrice - depreciation + variance
      };
    });
  };
  
  const marketData = generateMockData();
  
  // Calculate trend
  const firstPrice = marketData[0].value;
  const lastPrice = marketData[marketData.length - 1].value;
  const priceDifference = lastPrice - firstPrice;
  const percentChange = ((priceDifference / firstPrice) * 100).toFixed(1);
  
  // Determine trend direction
  const trendDirection = priceDifference > 0 ? 'up' : priceDifference < 0 ? 'down' : 'neutral';

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>12-Month Market Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h3>
            <div className={`flex items-center ${
              trendDirection === 'up' ? 'text-green-600' : 
              trendDirection === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trendDirection === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : trendDirection === 'down' ? (
                <ArrowDown className="h-4 w-4 mr-1" />
              ) : (
                <Minus className="h-4 w-4 mr-1" />
              )}
              <span>{percentChange}%</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {trendDirection === 'up'
              ? 'This vehicle has been increasing in value. Good time to sell!'
              : trendDirection === 'down'
              ? 'This vehicle has been depreciating. Values may continue to decrease.'
              : 'This vehicle has maintained stable value over the past year.'}
          </p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={marketData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                domain={['dataMin - 1000', 'dataMax + 1000']}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="url(#colorValue)" 
              />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Market Low</div>
            <div className="font-medium">{formatCurrency(Math.min(...marketData.map(d => d.value)))}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="font-medium">
              {formatCurrency(marketData.reduce((sum, item) => sum + item.value, 0) / marketData.length)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Market High</div>
            <div className="font-medium">{formatCurrency(Math.max(...marketData.map(d => d.value)))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
