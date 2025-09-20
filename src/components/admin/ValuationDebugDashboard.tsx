// Debug Dashboard for Valuation Pipeline Monitoring
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Database, FileText, MessageSquare, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DebugStats {
  valuationRequestsCount: number;
  marketListingsCount: number;
  auditLogsCount: number;
  feedbackCount: number;
  lastValuation?: any;
  lastMarketListing?: any;
  lastAuditLog?: any;
  lastFeedback?: any;
}

export function ValuationDebugDashboard() {
  const [stats, setStats] = useState<DebugStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDebugStats = async () => {
    try {
      setRefreshing(true);
      
      // Fetch counts from all tables
      const [
        valuationRequestsResult,
        marketListingsResult,
        auditLogsResult,
        feedbackResult
      ] = await Promise.all([
        supabase.from('valuation_requests').select('*', { count: 'exact', head: true }),
        supabase.from('market_listings').select('*', { count: 'exact', head: true }),
        supabase.from('valuation_audit_logs').select('*', { count: 'exact', head: true }),
        supabase.from('user_valuation_feedback').select('*', { count: 'exact', head: true })
      ]);

      // Fetch latest records for debugging
      const [
        latestValuation,
        latestMarketListing,
        latestAuditLog,
        latestFeedback
      ] = await Promise.all([
        supabase.from('valuation_requests').select('*').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('market_listings').select('*').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('valuation_audit_logs').select('*').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('user_valuation_feedback').select('*').order('created_at', { ascending: false }).limit(1).single()
      ]);

      setStats({
        valuationRequestsCount: valuationRequestsResult.count || 0,
        marketListingsCount: marketListingsResult.count || 0,
        auditLogsCount: auditLogsResult.count || 0,
        feedbackCount: feedbackResult.count || 0,
        lastValuation: latestValuation.data,
        lastMarketListing: latestMarketListing.data,
        lastAuditLog: latestAuditLog.data,
        lastFeedback: latestFeedback.data
      });
    } catch (error) {
      console.error('Error fetching debug stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDebugStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading debug statistics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load debug statistics. Check console for errors.
        </AlertDescription>
      </Alert>
    );
  }

  const getHealthColor = (count: number) => {
    if (count > 10) return 'text-green-600';
    if (count > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (count: number) => {
    if (count > 10) return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
    if (count > 0) return <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>;
    return <Badge className="bg-red-100 text-red-800">Empty</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Valuation Pipeline Debug Dashboard
            <Button
              onClick={fetchDebugStats}
              disabled={refreshing}
              size="sm"
              variant="outline"
              className="ml-auto"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Valuation Requests */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Valuation Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getHealthColor(stats.valuationRequestsCount)}`}>
                  {stats.valuationRequestsCount}
                </span>
                {getHealthBadge(stats.valuationRequestsCount)}
              </div>
            </div>

            {/* Market Listings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Market Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getHealthColor(stats.marketListingsCount)}`}>
                  {stats.marketListingsCount}
                </span>
                {getHealthBadge(stats.marketListingsCount)}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Audit Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getHealthColor(stats.auditLogsCount)}`}>
                  {stats.auditLogsCount}
                </span>
                {getHealthBadge(stats.auditLogsCount)}
              </div>
            </div>

            {/* User Feedback */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">User Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getHealthColor(stats.feedbackCount)}`}>
                  {stats.feedbackCount}
                </span>
                {getHealthBadge(stats.feedbackCount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Records Preview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Latest Valuation Request */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Valuation Request</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lastValuation ? (
              <div className="space-y-2 text-sm">
                <div><strong>VIN:</strong> {stats.lastValuation.vin}</div>
                <div><strong>ZIP:</strong> {stats.lastValuation.zip_code}</div>
                <div><strong>Final Value:</strong> ${stats.lastValuation.final_value?.toLocaleString() || 'N/A'}</div>
                <div><strong>Confidence:</strong> {stats.lastValuation.confidence_score}%</div>
                <div><strong>Created:</strong> {new Date(stats.lastValuation.created_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No valuation requests found</p>
            )}
          </CardContent>
        </Card>

        {/* Latest Market Listing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Market Listing</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lastMarketListing ? (
              <div className="space-y-2 text-sm">
                <div><strong>VIN:</strong> {stats.lastMarketListing.vin || 'N/A'}</div>
                <div><strong>Price:</strong> ${stats.lastMarketListing.price?.toLocaleString() || 'N/A'}</div>
                <div><strong>Source:</strong> {stats.lastMarketListing.source}</div>
                <div><strong>ZIP:</strong> {stats.lastMarketListing.zip_code || 'N/A'}</div>
                <div><strong>Created:</strong> {new Date(stats.lastMarketListing.created_at || stats.lastMarketListing.fetched_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No market listings found</p>
            )}
          </CardContent>
        </Card>

        {/* Latest Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lastAuditLog ? (
              <div className="space-y-2 text-sm">
                <div><strong>VIN:</strong> {stats.lastAuditLog.vin}</div>
                <div><strong>Action:</strong> {stats.lastAuditLog.action}</div>
                <div><strong>Step:</strong> {stats.lastAuditLog.step}</div>
                <div><strong>Success:</strong> {stats.lastAuditLog.success ? '✅' : '❌'}</div>
                <div><strong>Created:</strong> {new Date(stats.lastAuditLog.created_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No audit logs found</p>
            )}
          </CardContent>
        </Card>

        {/* Latest Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest User Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lastFeedback ? (
              <div className="space-y-2 text-sm">
                <div><strong>Rating:</strong> {stats.lastFeedback.accuracy_rating}/5</div>
                <div><strong>Would Recommend:</strong> {stats.lastFeedback.would_recommend ? '✅' : '❌'}</div>
                <div><strong>Notes:</strong> {stats.lastFeedback.feedback_notes || 'None'}</div>
                <div><strong>Created:</strong> {new Date(stats.lastFeedback.created_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No user feedback found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Data Persistence Health</span>
              <Progress 
                value={Math.min(100, (stats.valuationRequestsCount + stats.marketListingsCount) * 2)} 
                className="w-1/2" 
              />
            </div>
            
            {stats.valuationRequestsCount === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No valuation requests found. Check if saveValuationRequest() is being called.
                </AlertDescription>
              </Alert>
            )}
            
            {stats.marketListingsCount === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No market listings found. Check if saveMarketListings() is being called after OpenAI search.
                </AlertDescription>
              </Alert>
            )}
            
            {stats.auditLogsCount === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No audit logs found. Check if logValuationAudit() is working properly.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}