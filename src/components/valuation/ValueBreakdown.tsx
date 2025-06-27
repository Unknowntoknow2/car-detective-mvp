
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

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
}

export function ValueBreakdown({ 
  adjustments, 
  baseValue, 
  finalValue, 
  confidenceScore 
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

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.impact, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Value Breakdown</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            {confidenceScore}% Confidence
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of how we calculated your vehicle's value
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Value */}
        {baseValue && (
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-medium">Base Market Value</div>
              <div className="text-sm text-muted-foreground">Starting valuation for your vehicle</div>
            </div>
            <div className="font-semibold">
              ${baseValue.toLocaleString()}
            </div>
          </div>
        )}

        {/* Adjustments */}
        {adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">ADJUSTMENTS</h4>
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
                  {adjustment.impact >= 0 ? '+' : ''}${adjustment.impact.toLocaleString()}
                  <div className="text-xs text-muted-foreground">
                    ({adjustment.percentage >= 0 ? '+' : ''}{adjustment.percentage.toFixed(1)}%)
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
            <div className="font-semibold text-green-800">Estimated Market Value</div>
            <div className="text-sm text-green-600">Final calculated value</div>
          </div>
          <div className="text-2xl font-bold text-green-700">
            ${finalValue.toLocaleString()}
          </div>
        </div>

        {/* Confidence Explanation */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
          <strong>Confidence Score: {confidenceScore}%</strong>
          <br />
          Based on data completeness, market conditions, and valuation model accuracy.
          Higher scores indicate more reliable estimates.
        </div>
      </CardContent>
    </Card>
  );
}
