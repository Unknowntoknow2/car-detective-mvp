
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ZipValidation } from '@/components/common/ZipValidation';
import { ChartLine, TrendingUp, TrendingDown, ChevronsUpDown } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';

interface MarketTrend {
  month: string;
  value: number;
}

export function MarketSnapshot() {
  const [zipCode, setZipCode] = useState('');
  const [isValidZip, setIsValidZip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<{
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    trends: MarketTrend[];
    forecast: number;
    current: number;
  }>({
    trend: 'up',
    percentage: 3.2,
    trends: [
      { month: 'Jan', value: 22100 },
      { month: 'Feb', value: 22300 },
      { month: 'Mar', value: 22150 },
      { month: 'Apr', value: 22400 },
      { month: 'May', value: 22800 },
      { month: 'Jun', value: 23100 }
    ],
    forecast: 23400,
    current: 23100
  });

  // Handle ZIP code change and fetch data
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZip = e.target.value.slice(0, 5);
    setZipCode(newZip);
  };

  // Fetch market data when zip is valid
  useEffect(() => {
    const fetchMarketData = async () => {
      if (!isValidZip) return;
      
      setIsLoading(true);
      
      try {
        // In a real implementation, this would call the Supabase function
        const response = await supabase.functions.invoke('fetch-market-listings', {
          body: { zipCode: zipCode, make: 'Toyota', model: 'Camry', year: 2020 }
        });
        
        // For now, simulate response data with random variations based on ZIP
        const zipSum = zipCode.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const trend = zipSum % 3 === 0 ? 'up' : zipSum % 3 === 1 ? 'down' : 'stable';
        const percentage = (1 + zipSum % 5) + Math.random();
        
        // Set timeout to simulate network delay
        setTimeout(() => {
          setMarketData({
            trend: trend as 'up' | 'down' | 'stable',
            percentage: parseFloat(percentage.toFixed(1)),
            trends: [
              { month: 'Jan', value: 22100 + (zipSum * 50) },
              { month: 'Feb', value: 22300 + (zipSum * 40) },
              { month: 'Mar', value: 22150 + (zipSum * 60) },
              { month: 'Apr', value: 22400 + (zipSum * 30) },
              { month: 'May', value: 22800 + (zipSum * 40) },
              { month: 'Jun', value: 23100 + (zipSum * 50) }
            ],
            forecast: 23400 + (zipSum * 70),
            current: 23100 + (zipSum * 50)
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setIsLoading(false);
      }
    };
    
    if (isValidZip) {
      fetchMarketData();
    }
  }, [isValidZip, zipCode]);

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="w-full shadow-md border-muted-foreground/20">
      <CardHeader className="bg-surface-light pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <ChartLine className="h-5 w-5 text-primary" />
          <span>Market Snapshot</span>
          <Badge variant="outline" className="ml-2 bg-primary-light/20">Local</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Local market trends impact your car's value
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <label htmlFor="zip-code" className="block text-sm font-medium mb-1">
            Enter ZIP Code for Local Pricing
          </label>
          <div className="relative">
            <Input
              id="zip-code"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={handleZipChange}
              className="pr-12"
            />
            {zipCode.length === 5 && (
              <ZipValidation
                zip={zipCode}
                onValidChange={setIsValidZip}
                compact
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              />
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isValidZip ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-xs text-muted-foreground mb-1">Current Average</p>
                <p className="text-xl font-semibold">{formatCurrency(marketData.current)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {marketData.trend === 'up' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">+{marketData.percentage}% past 3mo</span>
                    </>
                  )}
                  {marketData.trend === 'down' && (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">-{marketData.percentage}% past 3mo</span>
                    </>
                  )}
                  {marketData.trend === 'stable' && (
                    <>
                      <ChevronsUpDown className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600">±{marketData.percentage}% past 3mo</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-xs text-muted-foreground mb-1">12-Month Forecast</p>
                <p className="text-xl font-semibold">{formatCurrency(marketData.forecast)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {marketData.forecast > marketData.current ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{((marketData.forecast - marketData.current) / marketData.current * 100).toFixed(1)}% projected
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">
                        {((marketData.forecast - marketData.current) / marketData.current * 100).toFixed(1)}% projected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-xs font-medium mb-2">6-Month Price Trend</p>
              <div className="h-24 flex items-end justify-between gap-1">
                {marketData.trends.map((point, index) => {
                  const minValue = Math.min(...marketData.trends.map(t => t.value));
                  const maxValue = Math.max(...marketData.trends.map(t => t.value));
                  const range = maxValue - minValue;
                  const normalizedHeight = ((point.value - minValue) / (range || 1)) * 100;
                  const heightPercent = 30 + (normalizedHeight * 0.6); // Min 30%, max 90%
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full rounded-t-sm ${index === marketData.trends.length - 1 ? 'bg-primary' : 'bg-primary/60'}`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      <p className="text-xs mt-1 text-muted-foreground">{point.month}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/20 rounded-md p-4 text-center h-40 flex flex-col items-center justify-center">
            <ChartLine className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm text-muted-foreground">Enter your ZIP code to see local market trends</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Prices can vary by up to 15% based on location</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
