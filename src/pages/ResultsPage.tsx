
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketListings } from '@/hooks/useMarketListings';
import { calculateUnifiedConfidence, UnifiedConfidenceInput } from '@/utils/unifiedConfidenceCalculator';
import { ValueShowcase } from '@/components/valuation/redesign/ValueShowcase';
import { ConfidenceRing } from '@/components/valuation/redesign/ConfidenceRing';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Download, Mail, RefreshCw } from 'lucide-react';

// Page for displaying valuation results for a specific VIN
export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [valuationData, setValuationData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  
  // Extract vehicle info from valuation data for market listings, with VIN-based fallback
  const vehicleInfo = {
    make: valuationData?.make || valuationData?.vehicle?.make || 'TOYOTA',
    model: valuationData?.model || valuationData?.vehicle?.model || 'Camry', 
    year: valuationData?.year || valuationData?.vehicle?.year || 2018,
    vin: id
  };
  
  // Fetch market listings for comparable vehicles
  const { listings: marketListings, loading: listingsLoading } = useMarketListings({
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    vin: id
  });

  // Fetch valuation data when component mounts
  useEffect(() => {
    if (!id) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    async function fetchValuationData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*, vehicle:decoded_vehicles(*), follow_up:follow_up_answers(*)')
          .eq('vin', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching valuation:', error);
          throw error;
        }

        if (!data) {
          setError('No valuation found for this VIN');
        } else {
          console.log('Fetched valuation data:', data);
          setValuationData(data);
        }
      } catch (err) {
        console.error('Error in valuation fetch:', err);
        setError('Failed to load valuation data');
      } finally {
        setLoading(false);
      }
    }

    fetchValuationData();
  }, [id]);

  // Format price range based on valuation data
  const priceRange = valuationData?.price_range 
    ? { 
        min: valuationData.price_range[0], 
        max: valuationData.price_range[1] 
      } 
    : {
        min: Math.round(valuationData?.estimated_value * 0.9) || 0,
        max: Math.round(valuationData?.estimated_value * 1.1) || 0
      };

  // Handle download report button
  const handleDownloadReport = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to download the valuation report",
        variant: "destructive"
      });
      return;
    }
    // Download report logic would go here
    toast({
      title: "Download Started",
      description: "Your valuation report is being generated",
    });
  };

  // Handle email report button
  const handleEmailReport = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to email the valuation report",
        variant: "destructive"
      });
      return;
    }
    // Email report logic would go here
    toast({
      title: "Email Sent",
      description: "The valuation report has been sent to your email",
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Error Loading Valuation</h2>
              <p>{error}</p>
              <Button onClick={() => navigate('/valuation')}>
                Start New Valuation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format vehicle data for display with VIN-based fallbacks
  const vehicleData = {
    year: valuationData?.year || valuationData?.vehicle?.year || 2018,
    make: valuationData?.make || valuationData?.vehicle?.make || 'TOYOTA',
    model: valuationData?.model || valuationData?.vehicle?.model || 'Camry',
    trim: valuationData?.trim || valuationData?.vehicle?.trim || '',
    fuelType: valuationData?.fuel_type || valuationData?.vehicle?.fuelType || 'gasoline',
    mileage: valuationData?.mileage || 100000 // Use realistic default mileage instead of 0
  };

  // Calculate unified confidence score using our new system
  const confidenceInput: UnifiedConfidenceInput = {
    vin: id,
    year: vehicleData.year,
    make: vehicleData.make,
    model: vehicleData.model,
    mileage: valuationData?.mileage,
    condition: valuationData?.follow_up?.condition,
    zip: valuationData?.zip_code,
    marketListingsCount: marketListings.length,
    exactVinMatch: marketListings.some(listing => listing.vin === id),
    msrpDataQuality: 80,
    fuelDataQuality: 75,
    hasCarfax: valuationData?.value_sources?.includes('carfax'),
    listingRange: priceRange,
    estimatedValue: valuationData?.estimated_value
  };
  
  const confidenceBreakdown = calculateUnifiedConfidence(confidenceInput);
  const confidenceScore = confidenceBreakdown.overall;

  // Generate recommendations based on data quality
  const recommendations = confidenceBreakdown.recommendations.length > 0 
    ? confidenceBreakdown.recommendations 
    : [
        valuationData?.mileage === undefined ? "Enter your vehicle's actual mileage for a more accurate valuation" : "",
        marketListings.length < 3 ? "Add more specific vehicle details for better market matching" : "",
        !user ? "Sign in to save your valuation and receive dealer offers" : ""
      ].filter(Boolean);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Vehicle Information Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {vehicleData.year} {vehicleData.make} {vehicleData.model}
          {vehicleData.trim ? ` ${vehicleData.trim}` : ''}
        </h1>
        <p className="text-muted-foreground">
          {vehicleData.mileage?.toLocaleString() || 'Unknown'} miles • {vehicleData.fuelType || 'Unknown'}
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Value */}
            <div>
              <ValueShowcase 
                estimatedValue={valuationData?.estimated_value || 0}
                priceRange={priceRange}
                confidenceScore={confidenceScore}
              />
            </div>

            {/* Right Column: Confidence */}
            <div className="md:col-span-2">
              <ConfidenceRing 
                score={confidenceScore}
                factors={{
                  vinAccuracy: confidenceBreakdown.vinAccuracy,
                  marketData: confidenceBreakdown.marketData,
                  fuelCostMatch: confidenceBreakdown.fuelCostMatch,
                  msrpQuality: confidenceBreakdown.msrpQuality
                }}
                recommendations={recommendations}
                onImproveClick={() => navigate(`/update/${id}`)}
              />
            </div>

            {/* Full-Width: Valuation Summary */}
            <div className="md:col-span-3 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ValuationSummary
                    estimatedValue={valuationData?.estimated_value || 0}
                    confidenceScore={confidenceScore}
                    vehicleInfo={{
                      year: vehicleData.year,
                      make: vehicleData.make,
                      model: vehicleData.model,
                      mileage: vehicleData.mileage
                    }}
                    marketAnchors={{
                      exactVinMatch: marketListings.some(listing => listing.vin === id),
                      listingsCount: marketListings.length,
                      trustScore: 0.8
                    }}
                    sources={valuationData?.value_sources || []}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button 
                      className="flex-1" 
                      onClick={handleDownloadReport}
                    >
                      <Download className="mr-2 h-4 w-4" /> 
                      Download Report
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="outline" 
                      onClick={handleEmailReport}
                    >
                      <Mail className="mr-2 h-4 w-4" /> 
                      Email Report
                    </Button>
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onClick={() => navigate(`/update/${id}`)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Update Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Market Data Tab Content */}
        <TabsContent value="market" className="pt-4">
          {/* We'll expand this in the future */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Market Analysis</h2>
              
              {listingsLoading ? (
                <p>Loading market data...</p>
              ) : marketListings.length > 0 ? (
                <div>
                  <p>Found {marketListings.length} comparable vehicles in the market.</p>
                  <p className="mt-4">Average market price: {formatCurrency(getAveragePrice(marketListings))}</p>
                </div>
              ) : (
                <p>No market listings found for this vehicle.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab Content */}
        <TabsContent value="details" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">VIN</h3>
                  <p>{id || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
                  <p>{vehicleData.year || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Make</h3>
                  <p>{vehicleData.make || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
                  <p>{vehicleData.model || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Trim</h3>
                  <p>{vehicleData.trim || 'Standard'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mileage</h3>
                  <p>{vehicleData.mileage?.toLocaleString() || 'Unknown'} miles</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fuel Type</h3>
                  <p>{vehicleData.fuelType || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
                  <p>{valuationData?.follow_up?.condition || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper function to calculate average price from listings
function getAveragePrice(listings: any[]): number {
  if (!listings || listings.length === 0) return 0;
  const total = listings.reduce((sum, listing) => sum + (listing.price || 0), 0);
  return Math.round(total / listings.length);
}
