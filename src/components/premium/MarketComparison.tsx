/**
 * Market Comparison Component
 * Premium visualization of market position and insights
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, MapPin, Clock, Users } from 'lucide-react';
import { MarketInsights } from '@/valuation/types/core';
import { formatCurrency } from '@/utils/formatCurrency';

interface MarketComparisonProps {
  marketInsights: MarketInsights;
}

export function MarketComparison({ marketInsights }: MarketComparisonProps) {
  const competitiveBadgeColor = {
    'below_market': 'bg-green-100 text-green-800 border-green-200',
    'at_market': 'bg-blue-100 text-blue-800 border-blue-200',
    'above_market': 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const demandLevel = (() => {
    if (marketInsights.demandIndex >= 80) return { level: 'High', color: 'text-green-600' };
    if (marketInsights.demandIndex >= 60) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  })();

  const marketVelocity = (() => {
    if (marketInsights.timeOnMarket <= 20) return { level: 'Fast', color: 'text-green-600', icon: TrendingUp };
    if (marketInsights.timeOnMarket <= 40) return { level: 'Average', color: 'text-yellow-600', icon: TrendingUp };
    return { level: 'Slow', color: 'text-red-600', icon: TrendingUp };
  })();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>Market Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Position */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Market Position</span>
            <Badge className={competitiveBadgeColor[marketInsights.competitivePosition]}>
              {marketInsights.competitivePosition.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              {marketInsights.priceRecommendation}
            </p>
          </div>
        </div>

        {/* Market Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Average Market Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Market Average
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(marketInsights.avgMarketplacePrice)}
            </div>
          </div>

          {/* Listing Count */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 text-purple-500" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Available Listings
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {marketInsights.listingCount}
            </div>
          </div>

          {/* Time on Market */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Avg. Time on Market
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {marketInsights.timeOnMarket} days
              </span>
              <Badge variant="outline" className={marketVelocity.color}>
                {marketVelocity.level}
              </Badge>
            </div>
          </div>

          {/* Price Variance */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Price Variance
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {(marketInsights.priceVariance * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Demand Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Market Demand</span>
            <span className={`text-sm font-semibold ${demandLevel.color}`}>
              {demandLevel.level}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Demand Index</span>
              <span className="font-medium text-gray-900">
                {marketInsights.demandIndex}/100
              </span>
            </div>
            <Progress value={marketInsights.demandIndex} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded ${marketInsights.demandIndex < 40 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}>
              Low
            </div>
            <div className={`p-2 rounded ${marketInsights.demandIndex >= 40 && marketInsights.demandIndex < 70 ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>
              Moderate
            </div>
            <div className={`p-2 rounded ${marketInsights.demandIndex >= 70 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
              High
            </div>
          </div>
        </div>

        {/* Market Insights Summary */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Market Insights</h4>
          <div className="space-y-2">
            {marketInsights.demandIndex > 75 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Strong buyer demand supports pricing</span>
              </div>
            )}
            
            {marketInsights.timeOnMarket < 25 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Fast-moving market with quick sales</span>
              </div>
            )}
            
            {marketInsights.listingCount < 10 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Limited inventory may support higher prices</span>
              </div>
            )}
            
            {marketInsights.priceVariance > 0.2 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">High price variance indicates diverse market conditions</span>
              </div>
            )}
            
            {marketInsights.competitivePosition === 'below_market' && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Competitively priced for quick sale</span>
              </div>
            )}
          </div>
        </div>

        {/* Market Health Indicator */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Market Health Score</span>
            <span className="text-lg font-bold text-blue-600">
              {Math.round((marketInsights.demandIndex + (100 - marketInsights.timeOnMarket) + Math.min(marketInsights.listingCount * 2, 100)) / 3)}%
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Composite score based on demand, velocity, and inventory levels
          </p>
        </div>
      </CardContent>
    </Card>
  );
}