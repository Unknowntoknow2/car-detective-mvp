
import { Button } from "@/components/ui/button";
import { TabContentWrapper } from "./TabContentWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { ChartBar, Info } from "lucide-react";
import { MarketPriceRange } from "./market-analysis/MarketPriceRange";
import { MarketTrendCard } from "./market-analysis/MarketTrendCard";
import { LocalMarketCard } from "./market-analysis/LocalMarketCard";
import { PriceDistributionChart } from "./market-analysis/PriceDistributionChart";

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
    priceTrend: "decreasing" as const,
    trendPercentage: -2.3,
    similarVehiclesNearby: 14,
    demandScore: 7.5
  };
  
  return (
    <TabContentWrapper
      title="Market Analysis"
      description={`Market data for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MarketPriceRange 
            averagePrice={marketData.averagePrice}
            lowestPrice={marketData.lowestPrice}
            highestPrice={marketData.highestPrice}
          />
          
          <MarketTrendCard 
            trend={marketData.priceTrend}
            trendPercentage={marketData.trendPercentage}
            listingCount={marketData.listingCount}
            averageDaysOnMarket={marketData.averageDaysOnMarket}
          />
          
          <LocalMarketCard
            similarVehiclesNearby={marketData.similarVehiclesNearby}
            demandScore={marketData.demandScore}
          />
        </div>
        
        <PriceDistributionChart
          distribution={marketData.priceDistribution}
          listingCount={marketData.listingCount}
          vehicleInfo={vehicleData}
          priceRange={{
            lowest: marketData.lowestPrice,
            average: marketData.averagePrice,
            highest: marketData.highestPrice
          }}
        />
        
        <div className="flex justify-end">
          <Button className="bg-primary">
            Download Full Market Report
          </Button>
        </div>
      </div>
    </TabContentWrapper>
  );
}
