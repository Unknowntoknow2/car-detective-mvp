import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getAdjustmentBreakdownHeatmap, HeatmapData } from '@/services/supabase/heatmapService';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

type ViewType = 'condition' | 'fuel' | 'market';

interface AdjustmentCellProps {
  value: number;
  maxValue: number;
  minValue: number;
}

function AdjustmentCell({ value, maxValue, minValue }: AdjustmentCellProps) {
  const range = maxValue - minValue;
  const normalizedValue = range > 0 ? (value - minValue) / range : 0;
  
  const getColor = (normalized: number, val: number) => {
    if (val > 0) {
      // Positive adjustments (green scale)
      return `bg-green-${Math.min(900, 100 + Math.round(normalized * 500))}`;
    } else if (val < 0) {
      // Negative adjustments (red scale)  
      return `bg-red-${Math.min(900, 100 + Math.round(normalized * 500))}`;
    }
    return 'bg-gray-100';
  };

  return (
    <div className={`px-2 py-1 text-xs text-center rounded ${
      value > 0 ? 'bg-green-100 text-green-800' : 
      value < 0 ? 'bg-red-100 text-red-800' : 
      'bg-gray-100 text-gray-600'
    }`}>
      {value > 0 ? '+' : ''}{value.toFixed(0)}
    </div>
  );
}

export function AdjustmentHeatmap() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('condition');
  const { toast } = useToast();

  useEffect(() => {
    loadHeatmapData();
  }, []);

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      const heatmapData = await getAdjustmentBreakdownHeatmap();
      setData(heatmapData);
    } catch (error) {
      console.error('Error loading heatmap data:', error);
      toast({
        title: "Error",
        description: "Failed to load adjustment heatmap data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTopZipCodes = (limit = 25) => {
    const zipCounts = data.reduce((acc, item) => {
      acc[item.zip_code] = (acc[item.zip_code] || 0) + item.sample_count;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(zipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([zip]) => zip);
  };

  const getAdjustmentStats = (adjustmentType: keyof HeatmapData) => {
    const values = data.map(item => Number(item[adjustmentType])).filter(val => !isNaN(val));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  };

  const topZipCodes = getTopZipCodes();
  const conditionStats = getAdjustmentStats('average_condition_adj');
  const fuelStats = getAdjustmentStats('average_fuel_adj');
  const marketStats = getAdjustmentStats('average_market_adj');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Adjustment Breakdown Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderHeatmapTable = (adjustmentField: keyof HeatmapData, stats: { min: number; max: number; avg: number }) => {
    const filteredData = data.filter(item => topZipCodes.includes(item.zip_code));
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">ZIP Code</th>
              <th className="text-left p-2 font-medium">Fuel Type</th>
              <th className="text-left p-2 font-medium">Condition</th>
              <th className="text-center p-2 font-medium">Adjustment</th>
              <th className="text-center p-2 font-medium">Avg Value</th>
              <th className="text-center p-2 font-medium">Samples</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 50).map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Badge variant="outline">{item.zip_code}</Badge>
                </td>
                <td className="p-2 capitalize">{item.fuel_type}</td>
                <td className="p-2 capitalize">{item.condition}</td>
                <td className="p-2">
                  <AdjustmentCell 
                    value={Number(item[adjustmentField])} 
                    maxValue={stats.max}
                    minValue={stats.min}
                  />
                </td>
                <td className="p-2 text-center">
                  ${Number(item.final_value_avg).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <Badge variant="secondary">{item.sample_count}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Adjustment Breakdown Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Top ZIP codes showing average adjustment impacts across {data.length} valuation data points
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="condition">
              Condition Impact
            </TabsTrigger>
            <TabsTrigger value="fuel">
              Fuel Type Impact  
            </TabsTrigger>
            <TabsTrigger value="market">
              Market Impact
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="condition" className="mt-6">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Min Impact</span>
                </div>
                <div className="text-lg">${conditionStats.min.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Avg Impact</div>
                <div className="text-lg">${conditionStats.avg.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Max Impact</span>
                </div>
                <div className="text-lg">${conditionStats.max.toFixed(0)}</div>
              </div>
            </div>
            {renderHeatmapTable('average_condition_adj', conditionStats)}
          </TabsContent>
          
          <TabsContent value="fuel" className="mt-6">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Min Impact</span>
                </div>
                <div className="text-lg">${fuelStats.min.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Avg Impact</div>
                <div className="text-lg">${fuelStats.avg.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Max Impact</span>
                </div>
                <div className="text-lg">${fuelStats.max.toFixed(0)}</div>
              </div>
            </div>
            {renderHeatmapTable('average_fuel_adj', fuelStats)}
          </TabsContent>
          
          <TabsContent value="market" className="mt-6">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Min Impact</span>
                </div>
                <div className="text-lg">${marketStats.min.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Avg Impact</div>
                <div className="text-lg">${marketStats.avg.toFixed(0)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Max Impact</span>
                </div>
                <div className="text-lg">${marketStats.max.toFixed(0)}</div>
              </div>
            </div>
            {renderHeatmapTable('average_market_adj', marketStats)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}