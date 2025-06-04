<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketTrendCard } from '@/components/premium/sections/valuation-tabs/market-analysis/MarketTrendCard';
import { LocalMarketCard } from '@/components/premium/sections/valuation-tabs/market-analysis/LocalMarketCard';
import { PriceComparisonChart } from '@/components/premium/sections/valuation-tabs/market-analysis/PriceComparisonChart';
import { ComparableListingsTable } from '@/components/premium/sections/valuation-tabs/market-analysis/ComparableListingsTable';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
=======
import { Button } from "@/components/ui/button";
import { TabContentWrapper } from "./TabContentWrapper";
import { useAuth } from "@/components/auth/AuthContext";
import { ChartBar, Info } from "lucide-react";
import { MarketPriceRange } from "./market-analysis/MarketPriceRange";
import { MarketTrendCard } from "./market-analysis/MarketTrendCard";
import { LocalMarketCard } from "./market-analysis/LocalMarketCard";
import { PriceDistributionChart } from "./market-analysis/PriceDistributionChart";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface MarketAnalysisTabProps {
  valuationId?: string;
  isPremium?: boolean;
  zipCode?: string;
  make?: string;
  model?: string;
  year?: number;
  onUpgrade?: () => void;
  vehicleData?: {
    make?: string;
    model?: string;
    year?: number;
    trim?: string;
  };
}

<<<<<<< HEAD
export function MarketAnalysisTab({
  valuationId = '',
  isPremium = false,
  zipCode = '90210',
  make = 'Unknown',
  model = 'Vehicle',
  year = new Date().getFullYear(),
  onUpgrade,
  vehicleData
}: MarketAnalysisTabProps) {
  // If vehicleData is provided, use its values instead
  const vehicleMake = vehicleData?.make || make;
  const vehicleModel = vehicleData?.model || model;
  const vehicleYear = vehicleData?.year || year;
  
  // If not premium, show the lock component
  if (!isPremium) {
    return (
      <PremiumFeatureLock
        valuationId={valuationId}
        feature="market analysis"
        ctaText="Unlock Market Analysis"
        returnUrl={`/valuation/${valuationId}`}
      />
    );
  }
  
  // Mock data for demo purposes
  const mockData = {
    trend: 'increasing' as 'increasing' | 'decreasing' | 'stable',
    trendPercentage: 2.5,
    listingCount: 27,
    averageDaysOnMarket: 45,
    similarVehiclesNearby: 18,
    demandScore: 7,
    comparableListings: [
      {
        id: 'cl1',
        title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        price: 24500,
        mileage: 35000,
        condition: 'Good',
        location: 'Beverly Hills, CA',
        daysListed: 14,
        source: 'Autotrader'
      },
      {
        id: 'cl2',
        title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        price: 25900,
        mileage: 28000,
        condition: 'Excellent',
        location: 'Santa Monica, CA',
        daysListed: 7,
        source: 'Cars.com'
      },
      {
        id: 'cl3',
        title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        price: 23200,
        mileage: 41000,
        condition: 'Good',
        location: 'Los Angeles, CA',
        daysListed: 21,
        source: 'Carvana'
      }
    ],
    // Add mock data for PriceComparisonChart
    averagePrices: {
      retail: 25500,
      auction: 21200,
      private: 23800,
      overall: 24000
    },
    priceRange: {
      min: 21000,
      max: 27000
    },
    estimatedValue: 24000,
    normalizedValue: 24500
  };
  
  // For demo purposes, show a decreasing trend if the year is older
  if (vehicleYear < new Date().getFullYear() - 3) {
    mockData.trend = 'decreasing';
    mockData.trendPercentage = -1.8;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="trends">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="listings">Comparable Listings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketTrendCard 
                trend={mockData.trend}
                trendPercentage={mockData.trendPercentage}
                listingCount={mockData.listingCount}
                averageDaysOnMarket={mockData.averageDaysOnMarket}
              />
              
              <LocalMarketCard
                similarVehiclesNearby={mockData.similarVehiclesNearby}
                demandScore={mockData.demandScore}
              />
            </div>
            
            <PriceComparisonChart
              vehicleData={{
                make: vehicleMake,
                model: vehicleModel,
                year: vehicleYear,
                zipCode: zipCode || '90210'
              }}
              averagePrices={mockData.averagePrices}
              priceRange={mockData.priceRange}
              estimatedValue={mockData.estimatedValue}
              normalizedValue={mockData.normalizedValue}
            />
          </TabsContent>
          
          <TabsContent value="listings" className="pt-4">
            <ComparableListingsTable listings={mockData.comparableListings} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
=======
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
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Authentication Required
          </h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to view market analysis data.
          </p>
          <Button
            asChild
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
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
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Vehicle Information Required
          </h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual
            entry to generate a market analysis.
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
    demandScore: 7.5,
  };

  return (
    <TabContentWrapper
      title="Market Analysis"
      description={`Market data for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${
        vehicleData.trim || ""
      }`}
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
            highest: marketData.highestPrice,
          }}
        />

        <div className="flex justify-end">
          <Button className="bg-primary">
            Download Full Market Report
          </Button>
        </div>
      </div>
    </TabContentWrapper>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
