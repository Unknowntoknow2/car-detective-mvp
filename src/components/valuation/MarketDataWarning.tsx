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
    return 'info';
  };

  const warningLevel = getWarningLevel();

  // Don't show warning if we have adequate real data
  if (realListingsCount >= 3) return null;

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
    if (realListingsCount === 0) return 'Limited Market Data';
    if (realListingsCount < 3) return 'Insufficient Market Data';
    return 'Market Data Notice';
  };

  const getDescription = () => {
    if (realListingsCount === 0) {
      return `This valuation is based on estimated values rather than actual market listings. 
              Confidence is limited to ${confidenceScore}% due to lack of comparable sales data.`;
    }
    
    if (realListingsCount < 3) {
      return `Only ${realListingsCount} real market listing(s) found. 
              More comparable listings would improve accuracy.`;
    }
    
    return 'Market data quality affects valuation confidence.';
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