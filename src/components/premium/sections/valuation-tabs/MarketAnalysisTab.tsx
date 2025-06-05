
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";

interface MarketAnalysisTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
}

export function MarketAnalysisTab({ vehicleData }: MarketAnalysisTabProps) {
  // Mock market data - in real app this would come from API
  const marketData = {
    averagePrice: 24500,
    priceRange: { min: 22000, max: 27000 },
    marketTrend: "up",
    trendPercentage: 3.2,
    comparableListings: 45,
    averageDaysOnMarket: 28,
    regionalData: [
      { region: "Local Market", avgPrice: 24500, listings: 12 },
      { region: "State Average", avgPrice: 24200, listings: 156 },
      { region: "National Average", avgPrice: 24800, listings: 1200 }
    ]
  };

  return (
    <TabContentWrapper
      title="Market Analysis"
      description="Real-time market insights and pricing trends for your vehicle"
    >
      <div className="space-y-6">
        {!vehicleData ? (
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Vehicle Information Required</h3>
              <p className="text-muted-foreground">
                Please enter vehicle details first to see market analysis.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Market Overview
                </CardTitle>
                <CardDescription>
                  Current market analysis for {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${marketData.averagePrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Average Market Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      ${marketData.priceRange.min.toLocaleString()} - ${marketData.priceRange.max.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Price Range</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {marketData.marketTrend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-2xl font-bold">
                        {marketData.trendPercentage}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Price Trend (30 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Listings</span>
                    <Badge variant="secondary">{marketData.comparableListings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Days on Market</span>
                    <Badge variant="secondary">{marketData.averageDaysOnMarket} days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Velocity</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Fast</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData.regionalData.map((region, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{region.region}</p>
                          <p className="text-sm text-muted-foreground">{region.listings} listings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${region.avgPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </TabContentWrapper>
  );
}
