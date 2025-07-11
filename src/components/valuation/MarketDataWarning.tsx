import React from 'react';
import { AlertTriangle, Info, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface MarketDataWarningProps {
  marketListingsCount: number;
  realListingsCount: number;
  confidenceScore: number;
  dataSource: string;
  notes?: string[];
}

export const MarketDataWarning: React.FC<MarketDataWarningProps> = ({
  marketListingsCount,
  realListingsCount,
  confidenceScore,
  dataSource,
  notes = []
}) => {
  // Determine warning level based on real listings
  const getWarningLevel = () => {
    if (realListingsCount === 0) return 'critical';
    if (realListingsCount < 3) return 'warning';
    if (realListingsCount < 5) return 'info';
    return 'none';
  };

  const warningLevel = getWarningLevel();

  // Don't show warning if we have adequate real data
  if (warningLevel === 'none' || (warningLevel === 'info' && confidenceScore >= 70)) {
    return null; // Don't show warning for good data
  }

  const getIcon = () => {
    switch (warningLevel) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <TrendingDown className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getVariant = () => {
    switch (warningLevel) {
      case 'critical':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const getTitle = () => {
    if (realListingsCount === 0) return 'No Real Market Data Found';
    if (realListingsCount === 1) return 'Very Limited Market Data';
    if (realListingsCount < 3) return 'Limited Market Coverage';
    if (realListingsCount < 5) return 'Moderate Market Coverage';
    return 'Good Market Coverage';
  };

  const getDescription = () => {
    if (realListingsCount === 0) {
      return `⚠️ FALLBACK MODE: This valuation is based purely on MSRP depreciation models. 
              No current market listings were found. The actual market value may differ significantly. 
              Consider manually checking AutoNation, CarMax, or local dealers for current pricing.`;
    }
    
    if (realListingsCount === 1) {
      return `⚠️ LIMITED DATA: Only 1 real market listing was found. This valuation has reduced accuracy. 
              Consider checking additional sources like major dealer websites or expanding your search radius.`;
    }
    
    if (realListingsCount < 3) {
      return `⚠️ INSUFFICIENT DATA: Only ${realListingsCount} real market listing(s) found. 
              Reliable valuations typically require 3+ comparable listings. Current estimate may not reflect actual market conditions.`;
    }
    
    if (realListingsCount < 5) {
      return `✓ MODERATE DATA: Found ${realListingsCount} real market listings. 
              Valuation accuracy is good but could be improved with additional market data.`;
    }
    
    return `✅ GOOD DATA: Found ${realListingsCount} real market listings with reliable data quality.`;
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{getTitle()}</span>
            <Badge variant={warningLevel === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
              {realListingsCount} Real • {marketListingsCount - realListingsCount} Estimated
            </Badge>
          </div>
          <AlertDescription className="text-sm">
            {getDescription()}
          </AlertDescription>
          
          {/* Show additional notes from market search */}
          {notes.length > 0 && (
            <div className="mt-2 space-y-1">
              {notes.map((note, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {note}
                </div>
              ))}
            </div>
          )}
          
          {/* Data source transparency */}
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">Data Source:</span> {dataSource}
          </div>
        </div>
      </div>
    </Alert>
  );
};