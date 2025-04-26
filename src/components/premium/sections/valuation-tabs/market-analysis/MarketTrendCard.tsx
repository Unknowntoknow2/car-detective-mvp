
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const isIncreasing = trend === 'increasing';
  const trendColor = isIncreasing ? 'text-green-600' : 'text-red-600';
  const trendBgColor = isIncreasing ? 'bg-green-100' : 'bg-red-100';
  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendIcon className={`h-4 w-4 ${trendColor}`} /> 
          Price Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <div className={`text-2xl font-bold ${trendColor}`}>
            {isIncreasing ? '+' : ''}{Math.abs(trendPercentage)}%
          </div>
          <div className={`text-sm px-2 py-0.5 rounded ${trendBgColor} ${trendColor}`}>
            {isIncreasing ? 'Rising' : 'Falling'}
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">30-day price trend</p>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <div className="text-sm font-medium">{listingCount}</div>
            <div className="text-xs text-slate-500">Comparable listings</div>
          </div>
          <div>
            <div className="text-sm font-medium">{averageDaysOnMarket} days</div>
            <div className="text-xs text-slate-500">Average time on market</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
