
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Calendar, Gauge } from "lucide-react";

interface ForecastSummaryProps {
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
  confidenceScore: number;
  bestTimeToSell: string;
}

export function ForecastSummary({
  trend,
  percentageChange,
  confidenceScore,
  bestTimeToSell
}: ForecastSummaryProps) {
  // Determine trend icon and colors
  let TrendIcon = TrendingUp;
  let trendColorClass = "text-green-600";
  let trendBgClass = "bg-green-50";
  let trendBorderClass = "border-green-100";
  
  if (trend === 'decreasing') {
    TrendIcon = TrendingDown;
    trendColorClass = "text-red-600";
    trendBgClass = "bg-red-50";
    trendBorderClass = "border-red-100";
  } else if (trend === 'stable') {
    TrendIcon = Minus;
    trendColorClass = "text-amber-600";
    trendBgClass = "bg-amber-50";
    trendBorderClass = "border-amber-100";
  }
  
  // Determine confidence level text
  let confidenceText = 'Moderate';
  let confidenceColor = 'text-amber-700';
  
  if (confidenceScore >= 80) {
    confidenceText = 'High';
    confidenceColor = 'text-green-700';
  } else if (confidenceScore < 50) {
    confidenceText = 'Low';
    confidenceColor = 'text-red-700';
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className={`${trendBgClass} border ${trendBorderClass}`}>
        <CardContent className="pt-6 px-6 pb-6">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${trendBgClass} ${trendColorClass}`}>
              <TrendIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm text-slate-600 font-medium mb-1">12-Month Trend</h4>
              <div className="flex items-center">
                <span className={`text-xl font-bold ${trendColorClass}`}>
                  {trend === 'increasing' ? '+' : trend === 'decreasing' ? '-' : ''}
                  {Math.abs(percentageChange)}%
                </span>
                <span className={`ml-2 text-sm ${trendColorClass}`}>
                  {trend === 'increasing' ? 'Increase' : trend === 'decreasing' ? 'Decrease' : 'Stable'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {trend === 'increasing' 
                  ? 'Your vehicle is projected to increase in value' 
                  : trend === 'decreasing'
                  ? 'Your vehicle is projected to decrease in value'
                  : 'Your vehicle value is projected to remain stable'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 px-6 pb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm text-slate-600 font-medium mb-1">Best Time to Sell</h4>
              <p className="text-xl font-bold text-blue-700">{bestTimeToSell}</p>
              <p className="text-xs text-slate-500 mt-1">
                Based on seasonal trends and market projections
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 px-6 pb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-purple-50 text-purple-600">
              <Gauge className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm text-slate-600 font-medium mb-1">Forecast Confidence</h4>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      confidenceScore >= 80 ? 'bg-green-500' : 
                      confidenceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
                <span className={`ml-3 font-bold ${confidenceColor}`}>{confidenceText}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {confidenceScore}% confidence in this forecast
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
