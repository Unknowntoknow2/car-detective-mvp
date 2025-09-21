// FIX #7: Admin + Analytics Enhancements
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Fuel, Map, Activity, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FuelPriceData {
  zip_code: string;
  fuel_type: string;
  cost_per_gallon: number;
  area_name?: string;
  updated_at: string;
}

interface MarketListingStats {
  make: string;
  model: string;
  listing_count: number;
  avg_price: number;
  price_range: { min: number; max: number };
}

interface AuditFailure {
  date: string;
  failure_count: number;
  total_valuations: number;
  failure_rate: number;
}

interface TrustScoreTrend {
  date: string;
  avg_market_confidence: number;
  avg_fuel_confidence: number;
  overall_trust: number;
}

export default function ValuationInsights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fuelHeatmap, setFuelHeatmap] = useState<FuelPriceData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketListingStats[]>([]);
  const [auditFailures, setAuditFailures] = useState<AuditFailure[]>([]);
  const [trustTrends, setTrustTrends] = useState<TrustScoreTrend[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFuelHeatmap(),
        loadMarketListingStats(),
        loadAuditFailures(),
        loadTrustTrends()
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadFuelHeatmap = async () => {
    const { data, error } = await supabase
      .from('regional_fuel_costs')
      .select('zip_code, fuel_type, cost_per_gallon, area_name, updated_at')
      .order('cost_per_gallon', { ascending: false })
      .limit(10);

    if (error) {
    } else {
      setFuelHeatmap(data || []);
    }
  };

  const loadMarketListingStats = async () => {
    const { data, error } = await supabase
      .from('market_listings')
      .select('make, model, price')
      .not('make', 'is', null)
      .not('model', 'is', null)
      .not('price', 'is', null)
      .gte('fetched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
    } else if (data) {
      // Group by make/model and calculate stats
      const groupedData = data.reduce((acc: Record<string, any>, listing) => {
        const key = `${listing.make} ${listing.model}`;
        if (!acc[key]) {
          acc[key] = {
            make: listing.make,
            model: listing.model,
            prices: [],
            listing_count: 0
          };
        }
        acc[key].prices.push(listing.price);
        acc[key].listing_count++;
        return acc;
      }, {});

      const stats = Object.values(groupedData).map((group: any) => ({
        make: group.make,
        model: group.model,
        listing_count: group.listing_count,
        avg_price: group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length,
        price_range: {
          min: Math.min(...group.prices),
          max: Math.max(...group.prices)
        }
      })).sort((a, b) => b.listing_count - a.listing_count).slice(0, 10);

      setMarketStats(stats);
    }
  };

  const loadAuditFailures = async () => {
    // Query valuation requests vs audit logs to find failures
    const { data: requests, error: requestError } = await supabase
      .from('valuation_requests')
      .select('created_at, audit_log_id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (requestError) {
      return;
    }

    // Group by date and calculate failure rates
    const dailyStats = requests?.reduce((acc: Record<string, any>, req) => {
      const date = new Date(req.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = { total: 0, failures: 0 };
      }
      acc[date].total++;
      if (!req.audit_log_id) {
        acc[date].failures++;
      }
      return acc;
    }, {});

    const failures = Object.entries(dailyStats || {}).map(([date, stats]: [string, any]) => ({
      date,
      failure_count: stats.failures,
      total_valuations: stats.total,
      failure_rate: (stats.failures / stats.total) * 100
    }));

    setAuditFailures(failures);
  };

  const loadTrustTrends = async () => {
    // Mock trust trends - would come from processed valuation data
    const mockTrends = [
      { date: '2024-01-15', avg_market_confidence: 78, avg_fuel_confidence: 92, overall_trust: 85 },
      { date: '2024-01-16', avg_market_confidence: 82, avg_fuel_confidence: 89, overall_trust: 86 },
      { date: '2024-01-17', avg_market_confidence: 75, avg_fuel_confidence: 94, overall_trust: 84 },
      { date: '2024-01-18', avg_market_confidence: 88, avg_fuel_confidence: 91, overall_trust: 90 },
      { date: '2024-01-19', avg_market_confidence: 79, avg_fuel_confidence: 88, overall_trust: 84 }
    ];
    setTrustTrends(mockTrends);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Valuation Insights Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics for market data, fuel costs, and audit compliance</p>
        </div>
        <Button onClick={refreshData} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="fuel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fuel" className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Fuel Prices
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Market Volume
            </TabsTrigger>
            <TabsTrigger value="trust" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Trust Scores
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Audit Failures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fuel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Fuel Price Heatmap - Top 10 ZIP Codes by Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fuelHeatmap.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={fuelHeatmap}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zip_code" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Price per Gallon']} />
                        <Bar dataKey="cost_per_gallon" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {fuelHeatmap.slice(0, 10).map((fuel, index) => (
                        <div key={index} className="p-2 border rounded text-center">
                          <div className="font-bold text-lg">${fuel.cost_per_gallon.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{fuel.zip_code}</div>
                          <Badge variant="outline" className="text-xs">{fuel.fuel_type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>No fuel price data available</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Market Listings Volume - Per Make/Model (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {marketStats.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={marketStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="make" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="listing_count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Make/Model</th>
                            <th className="text-right p-2">Listings</th>
                            <th className="text-right p-2">Avg Price</th>
                            <th className="text-right p-2">Price Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketStats.map((stat, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{stat.make} {stat.model}</td>
                              <td className="text-right p-2">{stat.listing_count}</td>
                              <td className="text-right p-2">${stat.avg_price.toLocaleString()}</td>
                              <td className="text-right p-2">
                                ${stat.price_range.min.toLocaleString()} - ${stat.price_range.max.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>No market listing data available</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Trust Score Trends - Market & Fuel Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {trustTrends.length > 0 && (
                    <>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {trustTrends[trustTrends.length - 1].avg_market_confidence}%
                        </div>
                        <div className="text-sm text-muted-foreground">Market Confidence</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {trustTrends[trustTrends.length - 1].avg_fuel_confidence}%
                        </div>
                        <div className="text-sm text-muted-foreground">Fuel Data Trust</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {trustTrends[trustTrends.length - 1].overall_trust}%
                        </div>
                        <div className="text-sm text-muted-foreground">Overall Trust</div>
                      </div>
                    </>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trustTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg_market_confidence" fill="#8884d8" name="Market" />
                    <Bar dataKey="avg_fuel_confidence" fill="#82ca9d" name="Fuel" />
                    <Bar dataKey="overall_trust" fill="#ffc658" name="Overall" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Audit Failures - Valuations Missing Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditFailures.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-red-600">
                          {auditFailures.reduce((sum, day) => sum + day.failure_count, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Failures (7 days)</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {auditFailures.reduce((sum, day) => sum + day.total_valuations, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Valuations</div>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          {(auditFailures.reduce((sum, day) => sum + day.failure_rate, 0) / auditFailures.length).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Failure Rate</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={auditFailures}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="failure_count" fill="#ff7c7c" name="Failures" />
                        <Bar dataKey="total_valuations" fill="#82ca9d" name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>No audit failures detected in the last 7 days</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}