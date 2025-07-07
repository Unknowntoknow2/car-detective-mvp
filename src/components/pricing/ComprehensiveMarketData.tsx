import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  ExternalLink, 
  RefreshCw, 
  Clock,
  DollarSign,
  MapPin,
  Car,
  Building,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface VehicleData {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  zipCode?: string;
}

interface PricingData {
  id: string;
  vin?: string;
  price: number;
  mileage?: number;
  location?: string;
  dealer_name?: string;
  source_name: string;
  source_type: string;
  listing_url?: string;
  cpo_status: boolean;
  vehicle_condition?: string;
  date_listed?: string;
  date_scraped: string;
  offer_type: string;
  markdown_notes?: string;
  incentives?: string;
}

interface PricingAnalytics {
  avg_price: number;
  median_price: number;
  min_price: number;
  max_price: number;
  sample_size: number;
  price_trend?: number;
  last_updated: string;
}

interface ComprehensiveMarketDataProps {
  vehicleData: VehicleData;
  className?: string;
}

export function ComprehensiveMarketData({ vehicleData, className }: ComprehensiveMarketDataProps) {
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [analytics, setAnalytics] = useState<PricingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAggregating, setIsAggregating] = useState(false);
  const [aggregationProgress, setAggregationProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load existing data
  useEffect(() => {
    loadExistingData();
  }, [vehicleData]);

  const loadExistingData = async () => {
    setIsLoading(true);
    try {
      // Load pricing data
      const { data: pricing, error: pricingError } = await supabase
        .from('vehicle_pricing_data')
        .select('*')
        .eq('year', vehicleData.year)
        .eq('make', vehicleData.make.toUpperCase())
        .eq('model', vehicleData.model.toUpperCase())
        .eq('is_active', true)
        .order('date_scraped', { ascending: false })
        .limit(100);

      if (pricingError) throw pricingError;

      // Load analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('pricing_analytics')
        .select('*')
        .eq('year', vehicleData.year)
        .eq('make', vehicleData.make.toUpperCase())
        .eq('model', vehicleData.model.toUpperCase())
        .eq('analysis_period', 'weekly')
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (analyticsError) throw analyticsError;

      setPricingData(pricing || []);
      setAnalytics(analyticsData);
      setLastUpdated(pricing?.[0]?.date_scraped ? new Date(pricing[0].date_scraped) : null);

    } catch (error) {
      console.error('Error loading market data:', error);
      toast.error('Failed to load market data');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDataAggregation = async () => {
    setIsAggregating(true);
    setAggregationProgress(0);

    try {
      console.log('🚀 Triggering AIN Market Orchestration...');
      
      // Enhanced logging for debugging
      console.log('Vehicle data:', vehicleData);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAggregationProgress(prev => Math.min(prev + 15, 90));
      }, 2000);

      // Create valuation request
      const { data: request, error: requestError } = await supabase
        .from('valuation_requests')
        .insert({
          vehicle_params: {
            year: vehicleData.year,
            make: vehicleData.make,
            model: vehicleData.model,
            trim: vehicleData.trim,
            vin: vehicleData.vin,
            zip_code: vehicleData.zipCode
          },
          user_id: (await supabase.auth.getUser()).data.user?.id || null
        })
        .select()
        .single();

      if (requestError) {
        throw requestError;
      }

      // Invoke the AIN full market orchestrator with enhanced logging
      console.log('📡 Invoking edge function with payload:', {
        request_id: request.id,
        vehicle_params: {
          year: vehicleData.year,
          make: vehicleData.make,
          model: vehicleData.model,
          trim: vehicleData.trim,
          vin: vehicleData.vin,
          zip_code: vehicleData.zipCode
        }
      });

      const response = await supabase.functions.invoke('ain-full-market-orchestrator', {
        body: {
          request_id: request.id,
          vehicle_params: {
            year: vehicleData.year,
            make: vehicleData.make,
            model: vehicleData.model,
            trim: vehicleData.trim,
            vin: vehicleData.vin,
            zip_code: vehicleData.zipCode
          }
        }
      });

      console.log('📨 Edge function response:', response);

      clearInterval(progressInterval);
      setAggregationProgress(100);

      if (response.error) {
        console.error('❌ Edge function error:', response.error);
        
        // Check if it's an OpenAI API key issue
        if (response.error.message?.includes('OpenAI API key')) {
          toast.error('OpenAI API key not configured. Please configure it in Supabase Edge Functions secrets.');
          return;
        }
        
        throw new Error(response.error.message);
      }

      const result = response.data;
      console.log('✅ AIN Market Orchestration completed:', result);

      if (result && result.total_comps !== undefined) {
        toast.success(
          `Market orchestration completed! Found ${result.total_comps} listings from ${result.sources_processed} sources with AI-powered web search.`
        );
      } else {
        toast.warning('Market orchestration completed, but no data was returned. Check edge function logs.');
      }

      // Load the new market data
      await loadMarketComps(request.id);

    } catch (error: any) {
      console.error('❌ Market orchestration error:', error);
      toast.error(
        error.message?.includes('OpenAI API key') 
          ? 'OpenAI API key not configured. Please configure it in Supabase Edge Functions secrets.'
          : 'Market orchestration failed. AI search may be temporarily unavailable.'
      );
    } finally {
      setIsAggregating(false);
      setAggregationProgress(0);
    }
  };

  const loadMarketComps = async (requestId: string) => {
    try {
      const { data: comps, error } = await supabase
        .from('market_comps')
        .select('*')
        .eq('valuation_request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform market comps to match the expected PricingData structure
      const transformedComps: PricingData[] = (comps || []).map(comp => ({
        id: comp.id,
        vin: comp.vin || undefined,
        price: Number(comp.price),
        mileage: comp.mileage || undefined,
        location: comp.location || undefined,
        dealer_name: comp.dealer_name || undefined,
        source_name: comp.source,
        source_type: comp.source_type,
        listing_url: comp.listing_url || undefined,
        cpo_status: comp.is_cpo || false,
        vehicle_condition: comp.condition || undefined,
        date_listed: undefined,
        date_scraped: comp.created_at,
        offer_type: 'listing',
        markdown_notes: undefined,
        incentives: comp.incentives || undefined
      }));

      setPricingData(transformedComps);

      // Calculate basic analytics
      if (transformedComps.length > 0) {
        const prices = transformedComps.map(c => c.price).sort((a, b) => a - b);
        const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const median = prices[Math.floor(prices.length / 2)];
        
        setAnalytics({
          avg_price: avg,
          median_price: median,
          min_price: Math.min(...prices),
          max_price: Math.max(...prices),
          sample_size: prices.length,
          last_updated: new Date().toISOString()
        });
      }

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error loading market comps:', error);
      toast.error('Failed to load market comparison data');
    }
  };

  const groupedBySource = pricingData.reduce((acc, item) => {
    const sourceType = item.source_type;
    if (!acc[sourceType]) acc[sourceType] = [];
    acc[sourceType].push(item);
    return acc;
  }, {} as Record<string, PricingData[]>);

  const sourceTypeLabels: Record<string, string> = {
    'big_box_retailer': 'Big Box Retailers',
    'marketplace_aggregator': 'Marketplace Aggregators',
    'franchise_mega_group': 'Franchise Mega Groups',
    'rental_remarketing': 'Rental Remarketing',
    'auction_wholesale': 'Auctions & Wholesale',
    'cpo_dealer': 'CPO & Dealers',
    'enthusiast_specialty': 'Enthusiast & Specialty'
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading comprehensive market data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-6 h-6" />
                FANG-Level Market Intelligence
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive pricing data from {Object.keys(sourceTypeLabels).length} source categories
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Updated {lastUpdated.toLocaleDateString()}
                </div>
              )}
              <Button 
                onClick={triggerDataAggregation}
                disabled={isAggregating}
                className="flex items-center gap-2"
              >
                {isAggregating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Aggregating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Run Live Aggregation
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAggregating && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Scraping all major sources...</span>
                <span>{aggregationProgress}%</span>
              </div>
              <Progress value={aggregationProgress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Analytics Overview */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Market Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(analytics.avg_price)}
                </div>
                <div className="text-sm text-muted-foreground">Average Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(analytics.median_price)}
                </div>
                <div className="text-sm text-muted-foreground">Median Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(analytics.min_price)}
                </div>
                <div className="text-sm text-muted-foreground">Lowest Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(analytics.max_price)}
                </div>
                <div className="text-sm text-muted-foreground">Highest Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {analytics.sample_size}
                </div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
            </div>
            
            {analytics.price_trend && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {analytics.price_trend > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-medium ${
                  analytics.price_trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics.price_trend > 0 ? '+' : ''}{analytics.price_trend.toFixed(1)}% trend
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Source Data */}
      <Card>
        <CardHeader>
          <CardTitle>Source Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {pricingData.length} listings from {Object.keys(groupedBySource).length} source categories
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedBySource)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
              {Object.entries(groupedBySource).map(([sourceType, items]) => (
                <TabsTrigger key={sourceType} value={sourceType} className="text-xs">
                  {sourceTypeLabels[sourceType] || sourceType}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {items.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedBySource).map(([sourceType, items]) => (
              <TabsContent key={sourceType} value={sourceType} className="space-y-4">
                <div className="grid gap-4">
                  {items.slice(0, 10).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.source_name}</Badge>
                            {item.cpo_status && <Badge variant="secondary">CPO</Badge>}
                            {item.offer_type !== 'listing' && (
                              <Badge variant="secondary">{item.offer_type}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {item.mileage && (
                              <span className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                {item.mileage.toLocaleString()} miles
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {item.location}
                              </span>
                            )}
                            {item.dealer_name && (
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {item.dealer_name}
                              </span>
                            )}
                          </div>

                          {(item.incentives || item.markdown_notes) && (
                            <div className="text-sm">
                              {item.incentives && (
                                <div className="text-green-600">💰 {item.incentives}</div>
                              )}
                              {item.markdown_notes && (
                                <div className="text-orange-600">🔥 {item.markdown_notes}</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold flex items-center gap-1">
                            <DollarSign className="w-5 h-5" />
                            {formatCurrency(item.price)}
                          </div>
                          {item.listing_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => window.open(item.listing_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Listing
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {items.length > 10 && (
                  <div className="text-center">
                    <Button variant="outline">
                      Show All {items.length} Listings
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {pricingData.length === 0 && !isAggregating && (
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Market Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Click "Run Live Aggregation" to fetch comprehensive pricing data from all major sources.
            </p>
            <Button onClick={triggerDataAggregation} className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Start Data Aggregation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}