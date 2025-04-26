
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ChartBar } from "lucide-react";

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
  const TrendIcon = trend === 'increasing' ? TrendingUp : 
                    trend === 'decreasing' ? TrendingDown : 
                    ChartBar;
  
  const trendColor = trend === 'increasing' ? 'text-green-600' : 
                     trend === 'decreasing' ? 'text-red-600' : 
                     'text-orange-500';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendIcon className={`mr-2 h-5 w-5 ${trendColor}`} />
          Market Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">30-Day Trend</span>
            <span className={`font-bold ${trendColor}`}>
              {trend === 'stable' ? 'Stable' : (trendPercentage > 0 ? '+' : '') + trendPercentage + '%'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Listings</span>
            <span>{listingCount} vehicles</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Days Listed</span>
            <span>{averageDaysOnMarket} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
