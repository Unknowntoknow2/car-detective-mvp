
import { Calendar, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TwelveMonthForecastTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    vin?: string;
  };
  valuationId?: string;
  estimatedValue?: number;
}

export function TwelveMonthForecastTab({ 
  vehicleData, 
  valuationId = "mock-id", 
  estimatedValue = 25000 
}: TwelveMonthForecastTabProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchForecast = async () => {
      if (!vehicleData) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the forecast function
        /*
        const { data, error: fnError } = await supabase.functions.invoke('valuation-forecast', {
          body: { valuationId }
        });
        
        if (fnError) throw new Error(fnError.message);
        if (!data) throw new Error('No forecast data returned');
        
        setForecastData(data);
        */
        
        // Mock forecast data for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data based on the vehicle make
        const makeLetter = (vehicleData.make || "").charAt(0).toLowerCase();
        const trend = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(makeLetter) 
          ? 'increasing' 
          : ['i', 'j', 'k', 'l', 'm', 'n', 'o'].includes(makeLetter)
          ? 'stable'
          : 'decreasing';
          
        const percentageChange = trend === 'increasing' 
          ? Math.random() * 5 + 2 
          : trend === 'decreasing' 
          ? -(Math.random() * 5 + 2)
          : Math.random() * 2 - 1;
          
        const months = [
          'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 
          'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'
        ];
        
        // Generate values with some random variation following the trend
        let currentValue = estimatedValue;
        const values = [currentValue];
        
        for (let i = 1; i < 13; i++) {
          const monthlyChange = trend === 'increasing' 
            ? (percentageChange / 12) * (1 + Math.random() * 0.5) 
            : trend === 'decreasing'
            ? (percentageChange / 12) * (1 + Math.random() * 0.5)
            : (Math.random() * 1 - 0.5);
          
          currentValue = currentValue * (1 + monthlyChange / 100);
          values.push(Math.round(currentValue));
        }
        
        const mockData = {
          months,
          values,
          trend,
          confidenceScore: Math.floor(Math.random() * 15) + 75,
          percentageChange: percentageChange.toFixed(1),
          bestTimeToSell: trend === 'decreasing' 
            ? 'As soon as possible' 
            : trend === 'increasing' 
            ? 'April 2026' 
            : 'Current market is stable'
        };
        
        setForecastData(mockData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate forecast';
        console.error('Forecast error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForecast();
  }, [vehicleData, valuationId, estimatedValue]);
  
  if (!user) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description="Forecast your vehicle's future value based on market trends and historical data"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to view forecasting data.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href="/auth">Sign In / Register</a>
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (!vehicleData) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description="Forecast your vehicle's future value based on market trends and historical data"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to generate a 12-month forecast.
          </p>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (isLoading) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description={`Value forecast for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-slate-600">Generating value forecast...</p>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (error || !forecastData) {
    return (
      <TabContentWrapper
        title="12-Month Value Forecast"
        description={`Value forecast for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Forecast Generation Failed</h3>
          <p className="text-red-700 mb-4">
            {error || "Unable to generate forecast data for this vehicle"}
          </p>
          <Button variant="destructive" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  const { months, values, trend, confidenceScore, percentageChange, bestTimeToSell } = forecastData;
  const currentValue = values[0];
  const futureValue = values[values.length - 1];
  const valueDifference = futureValue - currentValue;
  
  return (
    <TabContentWrapper
      title="12-Month Value Forecast"
      description={`Value forecast for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Projected Value Trend</CardTitle>
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
                <span>{trend === 'increasing' ? 'Appreciating' : trend === 'decreasing' ? 'Depreciating' : 'Stable'}</span>
              </div>
            </div>
            <CardDescription>
              Forecast based on {vehicleData.make} {vehicleData.model} historical pricing data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {/* Simplified chart visualization */}
              <div className="absolute inset-0 flex items-end">
                {values.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full mx-0.5 rounded-t ${
                        trend === 'increasing' 
                          ? 'bg-green-500' 
                          : trend === 'decreasing' 
                          ? 'bg-red-500' 
                          : 'bg-amber-500'
                      }`}
                      style={{ 
                        height: `${(value / Math.max(...values)) * 80}%`,
                        opacity: 0.7 + (index / values.length) * 0.3
                      }}
                    />
                    {index % 3 === 0 && (
                      <div className="text-xs mt-2 text-slate-600">{months[index]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-slate-600">Current Value</h4>
                <p className="text-2xl font-bold">${currentValue.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-600">Projected Value (12 mo)</h4>
                <p className={`text-2xl font-bold ${
                  valueDifference > 0 
                    ? 'text-green-600' 
                    : valueDifference < 0 
                    ? 'text-red-600' 
                    : ''
                }`}>
                  ${futureValue.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-slate-600">Projected Change</h4>
                <p className={`text-lg font-semibold ${
                  parseFloat(percentageChange) > 0 
                    ? 'text-green-600' 
                    : parseFloat(percentageChange) < 0 
                    ? 'text-red-600' 
                    : 'text-amber-600'
                }`}>
                  {parseFloat(percentageChange) > 0 ? '+' : ''}{percentageChange}%
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
        
        <div className="flex justify-end">
          <Button className="bg-primary">
            Download Forecast Report
          </Button>
        </div>
      </div>
    </TabContentWrapper>
  );
}
