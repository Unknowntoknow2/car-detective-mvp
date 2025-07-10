
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info, DollarSign } from 'lucide-react';

interface Adjustment {
  factor: string;
  impact: number;
  percentage: number;
  description: string;
}

interface ValueBreakdownProps {
  adjustments: Adjustment[];
  baseValue?: number;
  finalValue: number;
  confidenceScore: number;
  vehicleData?: {
    baseMSRP?: number;
    calculationMethod?: string;
    usedRealMSRP?: boolean;
  };
}

export function ValueBreakdown({ 
  adjustments, 
  baseValue, 
  finalValue, 
  confidenceScore,
  vehicleData 
}: ValueBreakdownProps) {
  const getAdjustmentIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (impact < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getAdjustmentColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + (adj.impact || 0), 0);
  const realBaseMSRP = vehicleData?.baseMSRP || baseValue;
  const usedRealMSRP = vehicleData?.usedRealMSRP || false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Value Breakdown</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              {confidenceScore}% Confidence
            </Badge>
            {usedRealMSRP && (
              <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                <DollarSign className="w-3 h-3" />
                Real MSRP
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {usedRealMSRP 
            ? 'Detailed breakdown using real manufacturer MSRP data'
            : 'Detailed breakdown of how we calculated your vehicle\'s value'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base MSRP Value */}
        {realBaseMSRP && (
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium flex items-center gap-2">
                {usedRealMSRP ? 'Original MSRP' : 'Base Market Value'}
                {usedRealMSRP && <DollarSign className="w-4 h-4 text-green-600" />}
              </div>
              <div className="text-sm text-muted-foreground">
                {usedRealMSRP 
                  ? 'Manufacturer\'s Suggested Retail Price from database'
                  : 'Starting valuation for your vehicle'
                }
              </div>
            </div>
            <div className="font-semibold">
              ${realBaseMSRP.toLocaleString()}
            </div>
          </div>
        )}

        {/* Adjustments */}
        {adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">MARKET ADJUSTMENTS</h4>
            {adjustments.map((adjustment, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div className="flex items-start gap-2 flex-1">
                  {getAdjustmentIcon(adjustment.impact)}
                  <div className="flex-1">
                    <div className="font-medium">{adjustment.factor}</div>
                    <div className="text-sm text-muted-foreground">
                      {adjustment.description}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${getAdjustmentColor(adjustment.impact)}`}>
                  {adjustment.impact >= 0 ? '+' : ''}${(adjustment.impact || 0).toLocaleString()}
                  <div className="text-xs text-muted-foreground">
                    ({(adjustment.percentage || 0) >= 0 ? '+' : ''}{(adjustment.percentage || 0).toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Adjustments */}
        {adjustments.length > 0 && (
          <div className="flex justify-between items-center py-2 border-t border-b font-medium">
            <div>Total Adjustments</div>
            <div className={getAdjustmentColor(totalAdjustments)}>
              {totalAdjustments >= 0 ? '+' : ''}${totalAdjustments.toLocaleString()}
            </div>
          </div>
        )}

        {/* Final Value */}
        <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3">
          <div>
            <div className="font-semibold text-green-800">Current Market Value</div>
            <div className="text-sm text-green-600">
              {usedRealMSRP ? 'Based on real MSRP data' : 'Final calculated value'}
            </div>
          </div>
          <div className="text-2xl font-bold text-green-700">
            ${finalValue.toLocaleString()}
          </div>
        </div>

        {/* Confidence Explanation */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <strong>Confidence Score: {confidenceScore}%</strong>
          <br />
          {usedRealMSRP && <span className="text-green-600">✓ Using real manufacturer MSRP data<br /></span>}
          Based on data completeness, market conditions, and valuation model accuracy.
          Higher scores indicate more reliable estimates.
        </div>
      </CardContent>
    </Card>
  );
}
