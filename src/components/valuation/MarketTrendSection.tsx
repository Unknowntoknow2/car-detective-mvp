import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketTrendSectionProps {
  valuationId: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function MarketTrendSection({
  valuationId,
  make,
  model,
  year,
  estimatedValue,
  isPremium,
  onUpgrade
}: MarketTrendSectionProps) {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!isPremium) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fixed: Call the valuation-forecast edge function with a single object parameter
        const { data, error } = await supabase.functions.invoke('valuation-forecast', {
          body: {
            make,
            model,
            year,
            currentValue: estimatedValue,
            months: 12,
            valuationId
          }
        });
        
        if (error) throw error;
        setForecastData(data);
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError('Failed to load market trend data');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [valuationId, make, model, year, estimatedValue, isPremium]);

  // Calculate market trend direction and percentage
  const calculatedTrend = () => {
    if (!forecastData || !forecastData.forecast || forecastData.forecast.length < 2) {
      return { direction: 'neutral', percentage: 0 };
    }
    
    const startValue = forecastData.forecast[0].value;
    const endValue = forecastData.forecast[forecastData.forecast.length - 1].value;
    const percentage = ((endValue - startValue) / startValue) * 100;
    
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage).toFixed(1)
    };
  };

  const trend = calculatedTrend();

  if (!isPremium) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/20">
          <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
        </CardHeader>
        <CardContent className="relative py-16">
          <div className="absolute inset-0 backdrop-blur-sm bg-background/80 flex flex-col items-center justify-center p-6 text-center">
            <Lock className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Unlock Market Trends</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Upgrade to premium to see detailed market forecasts, future value predictions and seasonal trends for your vehicle.
            </p>
            <Button onClick={onUpgrade}>
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="bg-muted/20">
          <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !forecastData) {
    return (
      <Card>
        <CardHeader className="bg-muted/20">
          <CardTitle className="text-lg">Market Trends & Future Value</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-8">
            <p>{error || "Unable to load market forecast data"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Market Trends & Future Value</span>
          <div className="flex items-center">
            {trend.direction === 'up' ? (
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+{trend.percentage}% Projected</span>
              </div>
            ) : trend.direction === 'down' ? (
              <div className="flex items-center text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">-{trend.percentage}% Projected</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-600">
                <span className="text-sm font-medium">Stable</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData.forecast}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { notation: 'compact' })}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                activeDot={{ r: 8 }} 
                name="Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-muted/30 rounded-md">
          <h4 className="font-medium mb-2">Analysis</h4>
          <p className="text-sm text-muted-foreground">
            {forecastData.analysis || 
              `Based on market data, your ${year} ${make} ${model} is projected to 
              ${trend.direction === 'up' ? 'increase' : trend.direction === 'down' ? 'decrease' : 'maintain'} 
              in value by approximately ${trend.percentage}% over the next 12 months. 
              ${trend.direction === 'up' ? 'This indicates strong market demand for your vehicle.' : 
                trend.direction === 'down' ? 'Consider selling sooner rather than later to maximize value.' : 
                'This indicates a stable market for your vehicle type.'}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketTrendSection;
