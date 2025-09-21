import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  RefreshCw, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
  Monitor
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DataSource {
  id: string;
  source_name: string;
  source_type: string;
  base_url: string;
  is_active: boolean;
  last_scraped: string | null;
  success_rate: number;
  rate_limit_per_hour: number;
}

interface AggregationStats {
  total_records: number;
  records_today: number;
  active_sources: number;
  avg_success_rate: number;
  last_24h_scrapes: number;
}

export function DataAggregationDashboard() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [stats, setStats] = useState<AggregationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testVehicle, setTestVehicle] = useState({
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    trim: '',
    zipCode: '90210'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load data sources
      const { data: sources, error: sourcesError } = await supabase
        .from('data_sources')
        .select('*')
        .order('source_name');

      if (sourcesError) throw sourcesError;

      // Load aggregation stats (tables removed)
      const pricingCount = 0;
      const todayCount = 0;

      setDataSources(sources || []);
      setStats({
        total_records: pricingCount || 0,
        records_today: todayCount || 0,
        active_sources: sources?.filter(s => s.is_active).length || 0,
        avg_success_rate: sources?.reduce((acc, s) => acc + s.success_rate, 0) / (sources?.length || 1) || 0,
        last_24h_scrapes: 0 // Would calculate from actual scraping logs
      });

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSourceStatus = async (sourceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('data_sources')
        .update({ is_active: !isActive })
        .eq('id', sourceId);

      if (error) throw error;

      toast.success(`Source ${!isActive ? 'activated' : 'deactivated'}`);
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update source status');
    }
  };

  const runTestAggregation = async () => {
    toast.info('Test aggregation feature has been removed');
  };

  const getSourceTypeColor = (sourceType: string) => {
    const colors: Record<string, string> = {
      'big_box_retailer': 'bg-blue-500',
      'marketplace_aggregator': 'bg-green-500',
      'franchise_mega_group': 'bg-purple-500',
      'rental_remarketing': 'bg-orange-500',
      'auction_wholesale': 'bg-red-500',
      'cpo_dealer': 'bg-indigo-500',
      'enthusiast_specialty': 'bg-pink-500'
    };
    return colors[sourceType] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading aggregation dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.total_records.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.records_today.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Today's Records</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{stats.active_sources}</div>
              <div className="text-sm text-muted-foreground">Active Sources</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats.avg_success_rate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Monitor className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.last_24h_scrapes}</div>
              <div className="text-sm text-muted-foreground">24h Scrapes</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Data Source Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <div className="font-medium">{source.source_name}</div>
                        <div className="text-sm text-muted-foreground">{source.base_url}</div>
                      </div>
                      <Badge className={getSourceTypeColor(source.source_type)}>
                        {source.source_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div>Success: {source.success_rate}%</div>
                        <div className="text-muted-foreground">
                          Rate: {source.rate_limit_per_hour}/hr
                        </div>
                      </div>
                      
                      <Button
                        variant={source.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleSourceStatus(source.id, source.is_active)}
                      >
                        {source.is_active ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Aggregation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Run a test aggregation to verify all sources are working correctly
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={testVehicle.year}
                    onChange={(e) => setTestVehicle(prev => ({ ...prev, year: parseInt(e.target.value) || 2022 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Make</label>
                  <Input
                    value={testVehicle.make}
                    onChange={(e) => setTestVehicle(prev => ({ ...prev, make: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    value={testVehicle.model}
                    onChange={(e) => setTestVehicle(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Trim</label>
                  <Input
                    value={testVehicle.trim}
                    onChange={(e) => setTestVehicle(prev => ({ ...prev, trim: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    value={testVehicle.zipCode}
                    onChange={(e) => setTestVehicle(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={runTestAggregation} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Test Aggregation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Aggregation Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics and performance metrics would be displayed here, including:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                <li>Source performance over time</li>
                <li>Success/failure rates by source</li>
                <li>Data freshness metrics</li>
                <li>Price trend analysis</li>
                <li>Coverage analysis by vehicle type</li>
                <li>Rate limiting and throttling stats</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}