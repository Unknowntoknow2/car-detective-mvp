import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface AdjustmentItem {
  factor: string;
  amount: number;
  description: string;
  source?: 'market' | 'synthetic';
  synthetic?: boolean;
}

interface AdjustmentTransparencyProps {
  adjustments: AdjustmentItem[];
  isFallbackMethod?: boolean;
  marketListingsCount?: number;
  className?: string;
}

export const AdjustmentTransparency: React.FC<AdjustmentTransparencyProps> = ({
  adjustments,
  isFallbackMethod = false,
  marketListingsCount = 0,
  className = ''
}) => {
  const getAdjustmentIcon = (amount: number) => {
    if (amount > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (amount < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getAdjustmentColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Categorize adjustments
  const realAdjustments = adjustments.filter(adj => !adj.synthetic && adj.source !== 'synthetic');
  const syntheticAdjustments = adjustments.filter(adj => adj.synthetic || adj.source === 'synthetic');
  const hasRealAdjustments = realAdjustments.length > 0;
  const hasSyntheticAdjustments = syntheticAdjustments.length > 0;

  if (adjustments.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        <h4 className="font-medium text-sm">Value Adjustments</h4>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-700">
            {isFallbackMethod 
              ? "⚠️ No market-based adjustments applied. Synthetic model includes built-in depreciation and mileage factors."
              : "✅ No significant adjustments needed based on market analysis."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Real Market-Based Adjustments */}
      {hasRealAdjustments && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">Market-Based Adjustments</h4>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Live Data
            </Badge>
          </div>
          
          <div className="space-y-2">
            {realAdjustments.map((adjustment, index) => (
              <div key={`real-${index}`} className="flex justify-between items-center p-3 border border-green-200 rounded bg-green-50">
                <div className="flex items-center gap-2">
                  {getAdjustmentIcon(adjustment.amount)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{adjustment.factor}</p>
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        Market-Based
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{adjustment.description}</p>
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Derived from {marketListingsCount} market listing{marketListingsCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold text-sm ${getAdjustmentColor(adjustment.amount)}`}>
                  {adjustment.amount >= 0 ? '+' : ''}{formatCurrency(adjustment.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synthetic Adjustments (with warnings) */}
      {hasSyntheticAdjustments && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">Synthetic Adjustments</h4>
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
              Estimated
            </Badge>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700">
                  <strong>⚠️ Synthetic Adjustments Warning:</strong> The adjustments below are estimates based on 
                  standard industry factors, not derived from real market transactions. These should be considered 
                  approximations only and may not reflect actual market conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {syntheticAdjustments.map((adjustment, index) => (
              <div key={`synthetic-${index}`} className="flex justify-between items-center p-2 border border-amber-200 rounded bg-amber-25">
                <div className="flex items-center gap-2">
                  {getAdjustmentIcon(adjustment.amount)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{adjustment.factor}</p>
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                        Synthetic
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{adjustment.description}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Estimated value - not market-derived
                    </p>
                  </div>
                </div>
                <p className={`font-semibold text-sm ${getAdjustmentColor(adjustment.amount)}`}>
                  {adjustment.amount >= 0 ? '+' : ''}{formatCurrency(adjustment.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Warning for Fallback Methods */}
      {isFallbackMethod && (adjustments.length > 0) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-red-700">
                <strong>Fallback Method Active:</strong> This valuation uses synthetic pricing models due to lack of 
                current market data. All adjustments should be considered estimates only. For transactions over $20,000, 
                we recommend obtaining professional appraisal or multiple valuations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};