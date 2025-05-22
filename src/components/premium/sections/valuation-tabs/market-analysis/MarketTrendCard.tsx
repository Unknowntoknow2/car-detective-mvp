
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketTrendCardProps {
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  listingCount: number;
  averageDaysOnMarket: number;
}

export function MarketTrendCard({ 
  trend, 
  trendPercentage, 
  listingCount, 
  averageDaysOnMarket 
}: MarketTrendCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Market Trend</h3>
            {trend === 'increasing' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : trend === 'decreasing' ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <Minus className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          <div className="text-2xl font-bold">
            {trend === 'increasing' ? (
              <span className="text-green-600">+{trendPercentage.toFixed(1)}%</span>
            ) : trend === 'decreasing' ? (
              <span className="text-red-600">{trendPercentage.toFixed(1)}%</span>
            ) : (
              <span className="text-gray-600">Stable</span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {trend === 'increasing'
              ? 'Prices are trending upward for this vehicle.'
              : trend === 'decreasing'
              ? 'Prices are trending downward for this vehicle.'
              : 'Prices are stable for this vehicle.'}
          </p>
          
          <div className="pt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Similar Listings</p>
              <p className="text-lg font-medium">{listingCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Days Listed</p>
              <p className="text-lg font-medium">{averageDaysOnMarket} days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
