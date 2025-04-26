
import { ChartBar, Banknote, TrendingUp, TrendingDown, Info } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <TabContentWrapper
        title="Market Analysis"
        description="Compare your vehicle to similar listings with detailed market insights"
      >
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
      </TabContentWrapper>
    );
  }
  
  if (!vehicleData) {
    return (
      <TabContentWrapper
        title="Market Analysis"
        description="Compare your vehicle to similar listings with detailed market insights"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Info className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to generate a market analysis.
          </p>
        </div>
      </TabContentWrapper>
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
    priceTrend: "decreasing", // "increasing", "stable", "decreasing"
    trendPercentage: -2.3,
    similarVehiclesNearby: 14,
    demandScore: 7.5 // 1-10 scale
  };
  
  return (
    <TabContentWrapper
      title="Market Analysis"
      description={`Market data for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Banknote className="mr-2 h-5 w-5 text-primary" />
                Price Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average</span>
                  <span className="font-bold">${marketData.averagePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lowest</span>
                  <span className="text-green-600">${marketData.lowestPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Highest</span>
                  <span className="text-red-600">${marketData.highestPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {marketData.priceTrend === "increasing" ? (
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                ) : marketData.priceTrend === "decreasing" ? (
                  <TrendingDown className="mr-2 h-5 w-5 text-red-600" />
                ) : (
                  <ChartBar className="mr-2 h-5 w-5 text-orange-500" />
                )}
                Market Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">30-Day Trend</span>
                  <span className={`font-bold ${marketData.priceTrend === "increasing" ? "text-green-600" : marketData.priceTrend === "decreasing" ? "text-red-600" : "text-orange-500"}`}>
                    {marketData.priceTrend === "stable" ? "Stable" : (marketData.trendPercentage > 0 ? "+" : "") + marketData.trendPercentage + "%"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Listings</span>
                  <span>{marketData.listingCount} vehicles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Days Listed</span>
                  <span>{marketData.averageDaysOnMarket} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ChartBar className="mr-2 h-5 w-5 text-primary" />
                Local Market
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nearby Listings</span>
                  <span>{marketData.similarVehiclesNearby} vehicles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Demand Score</span>
                  <span className="font-bold">{marketData.demandScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market Status</span>
                  <span className={marketData.demandScore > 7 ? "text-green-600" : marketData.demandScore > 4 ? "text-orange-500" : "text-red-600"}>
                    {marketData.demandScore > 7 ? "High Demand" : marketData.demandScore > 4 ? "Moderate" : "Low Demand"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>
              Distribution of {marketData.listingCount} similar {vehicleData.year} {vehicleData.make} {vehicleData.model} listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-between gap-1">
              {marketData.priceDistribution.map((count, index) => (
                <div 
                  key={index} 
                  className="bg-primary/80 rounded-t w-full"
                  style={{ 
                    height: `${(count / Math.max(...marketData.priceDistribution)) * 100}%`,
                    opacity: index === 3 || index === 4 ? 1 : 0.7 // Highlight the middle bars
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>${Math.round(marketData.lowestPrice / 1000)}k</span>
              <span>${Math.round(marketData.averagePrice / 1000) - 2}k</span>
              <span>${Math.round(marketData.averagePrice / 1000)}k</span>
              <span>${Math.round(marketData.averagePrice / 1000) + 2}k</span>
              <span>${Math.round(marketData.highestPrice / 1000)}k</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button className="bg-primary">
            Download Full Market Report
          </Button>
        </div>
      </div>
    </TabContentWrapper>
  );
}
