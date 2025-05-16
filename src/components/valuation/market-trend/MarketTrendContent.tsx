
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendIndicator } from './TrendIndicator';
import { MarketTrendChart } from './MarketTrendChart';
import { AnalysisSection } from './AnalysisSection';

interface MarketTrendContentProps {
  trend: {
    direction: 'up' | 'down' | 'neutral';
    percentage: string;
  };
  forecastData: {
    forecast: Array<{ month: string; value: number }>;
    analysis?: string;
  };
  year: number;
  make: string;
  model: string;
}

export function MarketTrendContent({ trend, forecastData, year, make, model }: MarketTrendContentProps) {
  return (
    <Card>
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Market Trends & Future Value</span>
          <TrendIndicator direction={trend.direction} percentage={trend.percentage} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <MarketTrendChart data={forecastData.forecast} />
        <AnalysisSection 
          analysis={forecastData.analysis || ''} 
          fallbackAnalysis={`Based on market data, your ${year} ${make} ${model} is projected to 
            ${trend.direction === 'up' ? 'increase' : trend.direction === 'down' ? 'decrease' : 'maintain'} 
            in value by approximately ${trend.percentage}% over the next 12 months. 
            ${trend.direction === 'up' ? 'This indicates strong market demand for your vehicle.' : 
              trend.direction === 'down' ? 'Consider selling sooner rather than later to maximize value.' : 
              'This indicates a stable market for your vehicle type.'}`
          }
        />
      </CardContent>
    </Card>
  );
}
