
import React from 'react';
import { useAuctionIntelligence } from '@/hooks/useAuctionIntelligence';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingDown, TrendingUp, AlertTriangle, DollarSign, RotateCcw, Shield } from 'lucide-react';
import { AuctionIntelligencePriceChart } from './AuctionIntelligencePriceChart';

interface AuctionIntelligenceCardProps {
  vin: string;
}

export function AuctionIntelligenceCard({ vin }: AuctionIntelligenceCardProps) {
  const { isPremium, isDealer, isLoading: roleLoading } = useUserRole();
  const { data, isLoading, error } = useAuctionIntelligence(vin);

  // Don't render anything while loading user role
  if (roleLoading) {
    return null;
  }

  // Show premium gate for non-premium users
  if (!isPremium && !isDealer) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Auction Intelligence</h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to Premium or Dealer access to unlock advanced auction intelligence and flip detection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auction Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auction Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Auction Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No auction intelligence data available for this VIN.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'default';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'upward':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'downward':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="mt-6 border-blue-200 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Auction Intelligence
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Advanced auction analysis and flip detection for this VIN
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score and Latest Sale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score</span>
              <Badge variant={getRiskColor(data.risk_score)}>
                {data.risk_score}/100 - {getRiskLabel(data.risk_score)}
              </Badge>
            </div>
            {data.latest_sale && (
              <div className="text-sm text-muted-foreground">
                Latest Sale: ${parseFloat(data.latest_sale.price || '0').toLocaleString()} 
                ({new Date(data.latest_sale.sold_date).toLocaleDateString()})
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getTrendIcon(data.price_trend.direction)}
              <span className="text-sm font-medium">Price Trend</span>
              <Badge variant="outline">
                {data.price_trend.direction.charAt(0).toUpperCase() + data.price_trend.direction.slice(1)}
              </Badge>
            </div>
            {data.price_trend.volatility > 0 && (
              <div className="text-sm text-muted-foreground">
                Volatility: {(data.price_trend.volatility * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Price Chart */}
        {data.price_trend.prices.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Price History</h4>
            <AuctionIntelligencePriceChart data={data.price_trend.prices} />
          </div>
        )}

        {/* Flip Detection */}
        {data.flip_flags.detected && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Flip Activity Detected</span>
                <Badge variant="destructive">{data.flip_flags.count} flips</Badge>
              </div>
              <div className="space-y-2">
                {data.flip_flags.alerts.map((alert, idx) => (
                  <Alert key={idx} className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      {alert.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Auction Conflicts */}
        {data.auction_conflict && (
          <>
            <Separator />
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Multiple auction sources reported conflicting data for this VIN. Verify details carefully.
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* AIN Summary */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <strong>AIN Insight:</strong> This vehicle has {data.flip_flags.count > 0 ? `been flipped ${data.flip_flags.count} time(s)` : 'no flip activity'}.
          {data.price_trend.direction === 'downward' && ' Price trend is declining.'}
          {data.risk_score >= 70 && ' High risk vehicle - investigate thoroughly before purchase.'}
          {data.risk_score < 40 && ' Low risk profile for auction activity.'}
        </div>
      </CardContent>
    </Card>
  );
}
