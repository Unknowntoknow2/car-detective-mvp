
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Calendar, DollarSign, Gauge, TrendingDown, TrendingUp } from "lucide-react";

interface ForecastSummaryProps {
  trend: "increasing" | "decreasing" | "stable";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            trend === "increasing" 
              ? "bg-green-100" 
              : trend === "decreasing" 
                ? "bg-red-100" 
                : "bg-blue-100"
          }`}>
            {trend === "increasing" ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : trend === "decreasing" ? (
              <TrendingDown className="h-5 w-5 text-red-600" />
            ) : (
              <ArrowUp className="h-5 w-5 text-blue-600" />
            )}
          </div>
          
          <div>
            <p className="text-sm text-slate-500">Value Trend</p>
            <div className="flex items-center gap-1">
              <p className="font-semibold">
                {trend === "increasing" 
                  ? "Increasing" 
                  : trend === "decreasing" 
                    ? "Decreasing" 
                    : "Stable"}
              </p>
              <span className={`text-sm font-medium ${
                percentageChange > 0 
                  ? "text-green-600" 
                  : percentageChange < 0 
                    ? "text-red-600" 
                    : "text-blue-600"
              }`}>
                {percentageChange > 0 ? "+" : ""}{percentageChange}%
              </span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100">
            <DollarSign className="h-5 w-5 text-amber-600" />
          </div>
          
          <div>
            <p className="text-sm text-slate-500">Best Time to Sell</p>
            <p className="font-semibold">{bestTimeToSell}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-blue-100">
            <Gauge className="h-5 w-5 text-blue-600" />
          </div>
          
          <div>
            <p className="text-sm text-slate-500">Confidence Score</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    confidenceScore >= 80 
                      ? "bg-green-500" 
                      : confidenceScore >= 60 
                        ? "bg-amber-500" 
                        : "bg-red-500"
                  }`} 
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
              <span className="font-medium text-sm">{confidenceScore}%</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-purple-100">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          
          <div>
            <p className="text-sm text-slate-500">Forecast Period</p>
            <p className="font-semibold">12 Months</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
