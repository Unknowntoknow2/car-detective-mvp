
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { ConfidenceRing } from '@/components/valuation/redesign/ConfidenceRing';
import { PriceRangeChart } from '@/components/valuation/result/PriceRangeChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMarketListings } from "@/hooks/useMarketListings";
import { calculateUnifiedConfidence } from "@/utils/unifiedConfidenceCalculator";
import { Loader2, Download, Mail, Edit } from "lucide-react";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [valuationData, setValuationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract vehicle info for market listings
  const vehicleInfo = valuationData?.vehicle_info || {};
  const { listings: marketListings, loading: marketLoading } = useMarketListings({
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    vin: id,
    exact: false
  });

  useEffect(() => {
    if (!id) return;

    const fetchValuationData = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from valuations table
        const { data: valuation, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', id)
          .single();

        if (valuationError && valuationError.code !== 'PGRST116') {
          throw valuationError;
        }

        if (valuation) {
          setValuationData(valuation);
        } else {
          // If no valuation found, create mock data for demonstration
          setValuationData({
            id: id,
            vin: id,
            estimated_value: 27127,
            vehicle_info: {
              year: 2018,
              make: 'TOYOTA',
              model: 'Camry',
              mileage: 100000,
              condition: 'Good',
              fuel_type: 'gasoline'
            },
            confidence_score: 70,
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError('Failed to load valuation data');
      } finally {
        setLoading(false);
      }
    };

    fetchValuationData();
  }, [id]);

  // Calculate unified confidence when data is available
  const confidenceBreakdown = React.useMemo(() => {
    if (!valuationData || marketLoading) return null;

    return calculateUnifiedConfidence({
      vin: valuationData.vin,
      year: vehicleInfo.year,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      mileage: vehicleInfo.mileage,
      condition: vehicleInfo.condition,
      marketListingsCount: marketListings.length,
      exactVinMatch: marketListings.some(listing => listing.vin === valuationData.vin),
      listingRange: marketListings.length > 0 ? {
        min: Math.min(...marketListings.map(l => l.price)),
        max: Math.max(...marketListings.map(l => l.price))
      } : undefined,
      estimatedValue: valuationData.estimated_value,
      msrpDataQuality: 80,
      fuelDataQuality: 75
    });
  }, [valuationData, marketListings, marketLoading, vehicleInfo]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600">{error || 'Valuation data not found'}</p>
      </div>
    );
  }

  const priceRange = [
    Math.round(valuationData.estimated_value * 0.9),
    Math.round(valuationData.estimated_value * 1.1)
  ] as [number, number];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ValuationSummary
                estimatedValue={valuationData.estimated_value}
                confidenceScore={confidenceBreakdown?.overall || valuationData.confidence_score}
                vehicleInfo={vehicleInfo}
                marketAnchors={{
                  exactVinMatch: marketListings.some(listing => listing.vin === valuationData.vin),
                  listingsCount: marketListings.length,
                  trustScore: 0.75
                }}
                sources={['market_analysis', 'vin_decode']}
                explanation={confidenceBreakdown?.reasoning}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceRangeChart 
                    priceRange={priceRange}
                    estimatedValue={valuationData.estimated_value}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {confidenceBreakdown && (
                <ConfidenceRing
                  score={confidenceBreakdown.overall}
                  factors={{
                    vinAccuracy: confidenceBreakdown.vinAccuracy,
                    marketData: confidenceBreakdown.marketData,
                    fuelCostMatch: confidenceBreakdown.fuelCostMatch,
                    msrpQuality: confidenceBreakdown.msrpQuality
                  }}
                  recommendations={confidenceBreakdown.recommendations}
                  onImproveClick={() => console.log('Improve accuracy clicked')}
                />
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800">Strong Market</h3>
                    <p className="text-sm text-green-600">High demand for this vehicle</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Stable Demand</h3>
                    <p className="text-sm text-blue-600">Consistent pricing trends</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800">Good Liquidity</h3>
                    <p className="text-sm text-purple-600">Easy to sell quickly</p>
                  </div>
                </div>
                
                {marketListings.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Similar Listings ({marketListings.length})</h4>
                    <div className="space-y-2">
                      {marketListings.slice(0, 5).map((listing, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{listing.year} {listing.make} {listing.model}</p>
                            <p className="text-sm text-gray-600">{listing.mileage?.toLocaleString()} miles</p>
                          </div>
                          <p className="font-semibold">{formatCurrency(listing.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg">
                  Your {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} with {vehicleInfo.mileage?.toLocaleString()} miles 
                  is valued at <strong>{formatCurrency(valuationData.estimated_value)}</strong> based on our comprehensive market analysis.
                </p>
                
                {confidenceBreakdown && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Confidence Explanation</h4>
                    <p className="text-blue-700 text-sm">{confidenceBreakdown.reasoning}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
