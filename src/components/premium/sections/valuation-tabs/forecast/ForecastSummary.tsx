
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Value Trend Summary</CardTitle>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            trend === 'increasing' 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : trend === 'decreasing'
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            {trend === 'increasing' ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : trend === 'decreasing' ? (
              <TrendingDown className="mr-1 h-4 w-4" />
            ) : (
              <Calendar className="mr-1 h-4 w-4" />
            )}
            <span>
              {trend === 'increasing' ? 'Appreciating' : 
               trend === 'decreasing' ? 'Depreciating' : 'Stable'}
            </span>
          </div>
        </div>
        <CardDescription>12-month value forecast analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-slate-600">Value Change</h4>
            <p className={`text-lg font-semibold ${
              percentageChange > 0 ? 'text-green-600' : 
              percentageChange < 0 ? 'text-red-600' : ''
            }`}>
              {percentageChange > 0 ? '+' : ''}{percentageChange}%
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-600">Confidence Score</h4>
            <p className="text-lg font-semibold">{confidenceScore}%</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-1">Best Time to Sell</h4>
          <p className="text-slate-600">{bestTimeToSell}</p>
        </div>
      </CardContent>
    </Card>
  );
}
