import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Database, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValuationRequest {
  id: string;
  vin?: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  mileage?: number;
  zip_code?: string;
}

interface EnterpriseValuationPanelProps {
  vehicleData: ValuationRequest;
}

import { MarketListing } from '@/types/marketListing';

interface AuditLog {
  id: string;
  event: string;
  source?: string;
  execution_time_ms?: number;
  created_at: string;
  error_message?: string;
}

interface ValuationResult {
  estimated_value: number;
  confidence_score: number;
  comp_count: number;
  price_range_low: number;
  price_range_high: number;
  source_breakdown: Record<string, any>;
}

export const EnterpriseValuationPanel = ({ vehicleData }: EnterpriseValuationPanelProps) => {
  const [status, setStatus] = useState<'idle' | 'creating' | 'aggregating' | 'completed' | 'error'>('idle');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartAggregation = async () => {
    try {
      setStatus('creating');
      setError(null);

      // Step 1: Create valuation request
      const { data: requestData, error: requestError } = await supabase.functions.invoke('valuation-request', {
        body: vehicleData
      });

      if (requestError) throw requestError;
      if (!requestData.success) throw new Error(requestData.error);

      const newRequestId = requestData.request_id;
      setRequestId(newRequestId);
      setStatus('aggregating');

      toast({
        title: "Enterprise Aggregation Started",
        description: `Request ${newRequestId.slice(0, 8)}... created. Starting FANG-level market search.`,
      });

      // Step 2: Start market aggregation
      const { data: aggregateData, error: aggregateError } = await supabase.functions.invoke('valuation-aggregate', {
        body: { request_id: newRequestId }
      });

      if (aggregateError) throw aggregateError;
      if (!aggregateData.success) throw new Error(aggregateData.error);

      // Step 3: Get final results
      await loadResults(newRequestId);
      setStatus('completed');

      toast({
        title: "Aggregation Complete",
        description: `Found ${aggregateData.comps_found} market comps from ${aggregateData.sources_processed} sources.`,
      });

    } catch (err: any) {
      console.error('Enterprise aggregation error:', err);
      setError(err.message);
      setStatus('error');
      toast({
        title: "Aggregation Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const loadResults = async (id: string) => {
    try {
      // Use direct fetch to the valuation-result function with path parameter
      const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation-result/${id}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY`,
          'Content-Type': 'application/json'
        }
      });

      const resultData = await response.json();

      if (!resultData.success) throw new Error(resultData.error);

      setResult(resultData.valuation_result);
      setMarketListings(resultData.market_listings || []);
      setAuditLogs(resultData.audit_logs || []);

    } catch (err: any) {
      console.error('Error loading results:', err);
      setError(err.message);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'creating':
      case 'aggregating':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'creating': return 'Creating valuation request...';
      case 'aggregating': return 'Aggregating market data from 15+ sources...';
      case 'completed': return 'Enterprise aggregation complete';
      case 'error': return 'Aggregation failed';
      default: return 'Ready to start FANG-level aggregation';
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enterprise Market Aggregation
          </CardTitle>
          <CardDescription>
            FANG-grade data collection from 15+ market sources including franchise dealers, 
            big box retailers, auctions, and book values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-muted-foreground">{getStatusText()}</span>
              {requestId && (
                <Badge variant="outline" className="ml-2">
                  ID: {requestId.slice(0, 8)}...
                </Badge>
              )}
            </div>
            <Button 
              onClick={handleStartAggregation}
              disabled={status === 'creating' || status === 'aggregating'}
              size="sm"
            >
              {status === 'creating' || status === 'aggregating' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                'Start Enterprise Aggregation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="comps">Market Comps ({marketListings.length})</TabsTrigger>
            <TabsTrigger value="breakdown">Source Breakdown</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estimated Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(result.estimated_value)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {result.comp_count} market comps
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg">
                    {formatCurrency(result.price_range_low)} - {formatCurrency(result.price_range_high)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Market spread: {Math.round((result.price_range_high - result.price_range_low) / result.estimated_value * 100)}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Confidence Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {result.confidence_score}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence_score >= 85 ? 'High' : result.confidence_score >= 70 ? 'Medium' : 'Low'} confidence
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comps" className="space-y-4">
            <div className="grid gap-4">
              {marketListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{listing.source}</Badge>
                          <Badge variant="secondary">{listing.source_type || listing.sourceType || 'unknown'}</Badge>
                          {(listing.is_cpo || listing.isCpo) && <Badge>CPO</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {(listing.dealer_name || listing.dealerName || listing.dealer) && `${listing.dealer_name || listing.dealerName || listing.dealer} • `}
                          {listing.location && `${listing.location} • `}
                          {listing.mileage && `${listing.mileage.toLocaleString()} miles`}
                        </p>
                        {listing.condition && (
                          <p className="text-sm">Condition: {listing.condition}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatCurrency(listing.price)}</div>
                        <a 
                          href={listing.listing_url || listing.listingUrl || listing.link || listing.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Listing →
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            {result.source_breakdown && Object.entries(result.source_breakdown).map(([type, data]: [string, any]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{type.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Count</p>
                      <p className="text-lg font-semibold">{data.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Price</p>
                      <p className="text-lg font-semibold">{formatCurrency(data.avg)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price Range</p>
                      <p className="text-sm">
                        {formatCurrency(Math.min(...data.prices))} - {formatCurrency(Math.max(...data.prices))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={log.error_message ? "destructive" : "outline"}>
                            {log.event.replace('_', ' ')}
                          </Badge>
                          {log.source && <Badge variant="secondary">{log.source}</Badge>}
                        </div>
                        {log.error_message && (
                          <p className="text-sm text-red-600">{log.error_message}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                        {log.execution_time_ms && (
                          <div>{log.execution_time_ms}ms</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};