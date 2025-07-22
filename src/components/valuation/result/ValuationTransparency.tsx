
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ValuationTransparencyProps {
  marketListingsCount: number;
  confidenceScore: number;
  basePriceAnchor?: {
    source: string;
    amount: number;
    method: string;
  };
  adjustments: Array<{
    factor: string;
    amount: number;
    description: string;
  }>;
  estimatedValue: number;
  sources: string[];
  isFallbackMethod: boolean;
}

export const ValuationTransparency: React.FC<ValuationTransparencyProps> = ({
  marketListingsCount,
  confidenceScore,
  basePriceAnchor,
  adjustments,
  estimatedValue,
  sources,
  isFallbackMethod
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          How We Calculated This Value
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Data Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Market Data Used</h4>
          <div className="flex items-center gap-2">
            {marketListingsCount > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{marketListingsCount} comparable market listings found</span>
                <Badge variant="default" className="text-xs">Live Data</Badge>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm">0 market listings found</span>
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                  Fallback Method
                </Badge>
              </>
            )}
          </div>
          
          {isFallbackMethod && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>⚠️ Fallback Pricing Model:</strong> No recent market listings were available for this specific vehicle. 
                Valuation is based on MSRP-adjusted model with mileage, condition, and regional factors applied.
              </p>
            </div>
          )}
        </div>

        {/* Base Price Anchor */}
        {basePriceAnchor && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Base Price Calculation</h4>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{basePriceAnchor.source}</p>
                <p className="text-xs text-gray-600">{basePriceAnchor.method}</p>
              </div>
              <p className="font-semibold">{formatCurrency(basePriceAnchor.amount)}</p>
            </div>
          </div>
        )}

        {/* Value Adjustments */}
        {adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Market Adjustments Applied</h4>
            <div className="space-y-2">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {getAdjustmentIcon(adjustment.amount)}
                    <div>
                      <p className="text-sm font-medium">{adjustment.factor}</p>
                      <p className="text-xs text-gray-600">{adjustment.description}</p>
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

        {/* Final Calculation */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-semibold text-green-800">Final Market Value</p>
              <p className="text-xs text-green-600">
                {isFallbackMethod ? 'Based on synthetic pricing model' : 'Based on market analysis'}
              </p>
            </div>
            <p className="text-xl font-bold text-green-700">{formatCurrency(estimatedValue)}</p>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Data Sources</h4>
          <div className="flex flex-wrap gap-1">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source.replace('_', ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
