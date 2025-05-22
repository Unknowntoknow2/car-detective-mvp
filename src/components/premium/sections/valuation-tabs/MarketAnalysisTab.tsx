
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar, Info, Users, TrendingUp, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/formatters';

interface MarketAnalysisTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
}

export function MarketAnalysisTab({ vehicleData }: MarketAnalysisTabProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Compare your vehicle to similar listings with detailed market insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <ChartBar className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
            <p className="text-amber-700 mb-4">
              You need to be logged in to view market analysis data.
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
              <a href="/auth">Sign In / Register</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!vehicleData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Compare your vehicle to similar listings with detailed market insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <Info className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
            <p className="text-amber-700 mb-4">
              Please first look up a vehicle using VIN, license plate, or manual entry
              to generate a market analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Mock data for market analysis
  const marketData = {
    averagePrice: 24500,
    lowestPrice: 21800,
    highestPrice: 27200,
    priceDistribution: [3, 8, 14, 22, 18, 10, 5, 2],
    listingCount: 82,
    averageDaysOnMarket: 28,
    priceTrend: "decreasing" as const,
    trendPercentage: -2.3,
    similarVehiclesNearby: 14,
    demandScore: 7.5
  };
  
  const renderTrendIcon = () => {
    if (marketData.priceTrend === "increasing") {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else {
      return <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>{vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.trim || ""}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Market Price Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Lowest Price</p>
                      <p className="text-xl font-bold">{formatCurrency(marketData.lowestPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Price</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(marketData.averagePrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Highest Price</p>
                      <p className="text-xl font-bold">{formatCurrency(marketData.highestPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Market Trends Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Market Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {renderTrendIcon()}
                    <div>
                      <h4 className="font-medium">Price Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        Prices are {marketData.priceTrend} by {Math.abs(marketData.trendPercentage)}% in your area
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Market Activity</h4>
                      <p className="text-sm text-muted-foreground">
                        {marketData.listingCount} listings with avg. {marketData.averageDaysOnMarket} days on market
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Local Market Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Local Market</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Regional Demand</h4>
                    <p className="text-sm text-muted-foreground">
                      {marketData.similarVehiclesNearby} similar vehicles listed nearby
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Demand Score</span>
                    <span className="text-sm font-medium">{marketData.demandScore}/10</span>
                  </div>
                  <Progress value={marketData.demandScore * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {marketData.demandScore >= 7 
                      ? "High demand in your area. Good time to sell."
                      : marketData.demandScore >= 5
                      ? "Moderate demand in your area. Average selling conditions."
                      : "Low demand in your area. Expect longer selling times."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button className="w-full sm:w-auto">
            Download Full Market Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
