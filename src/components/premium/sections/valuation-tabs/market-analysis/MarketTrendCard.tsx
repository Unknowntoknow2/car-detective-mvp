<<<<<<< HEAD

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
=======
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface MarketTrendCardProps {
  trend: "increasing" | "decreasing" | "stable";
  trendPercentage: number;
  listingCount: number;
  averageDaysOnMarket: number;
}

export function MarketTrendCard({
  trend,
  trendPercentage,
  listingCount,
  averageDaysOnMarket,
}: MarketTrendCardProps) {
<<<<<<< HEAD
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
=======
  const isIncreasing = trend === "increasing";
  const trendColor = isIncreasing ? "text-green-600" : "text-red-600";
  const trendBgColor = isIncreasing ? "bg-green-100" : "bg-red-100";
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
            {isIncreasing ? "+" : ""}
            {Math.abs(trendPercentage)}%
          </div>
          <div
            className={`text-sm px-2 py-0.5 rounded ${trendBgColor} ${trendColor}`}
          >
            {isIncreasing ? "Rising" : "Falling"}
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">30-day price trend</p>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <div className="text-sm font-medium">{listingCount}</div>
            <div className="text-xs text-slate-500">Comparable listings</div>
          </div>
          <div>
            <div className="text-sm font-medium">
              {averageDaysOnMarket} days
            </div>
            <div className="text-xs text-slate-500">Average time on market</div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
