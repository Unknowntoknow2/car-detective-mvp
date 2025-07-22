import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Database } from 'lucide-react';

interface MarketDataStatusProps {
  totalListings: number;
  searchMethod: 'openai' | 'database' | 'fallback';
  trustScore: number;
}

export function MarketDataStatus({ totalListings, searchMethod, trustScore }: MarketDataStatusProps) {
  const getStatusIcon = () => {
    if (totalListings > 3) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (totalListings > 0) return <Database className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-orange-600" />;
  };

  const getStatusMessage = () => {
    if (totalListings > 3) return `Found ${totalListings} current market listings`;
    if (totalListings > 0) return `Found ${totalListings} market listings (limited data)`;
    return 'No current market listings found - using fallback pricing';
  };

  const getSearchMethodLabel = () => {
    switch (searchMethod) {
      case 'openai': return 'AI Web Search';
      case 'database': return 'Database Search';
      case 'fallback': return 'Fallback Method';
      default: return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Market Data Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span>{getStatusMessage()}</span>
          <Badge variant={totalListings > 0 ? 'default' : 'secondary'}>
            {getSearchMethodLabel()}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Data Trust Score</span>
          <span className="font-medium">{Math.round(trustScore * 100)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}