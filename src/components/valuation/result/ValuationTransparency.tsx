
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
  zipCode?: string;
  vin?: string;
}

export const ValuationTransparency: React.FC<ValuationTransparencyProps> = ({
  marketListingsCount,
  confidenceScore,
  basePriceAnchor,
  adjustments,
  estimatedValue,
  sources,
  isFallbackMethod,
  zipCode,
  vin
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

  // TRUTH CHECK: Are these real adjustments or synthetic?
  const hasRealAdjustments = adjustments.length > 0 && !isFallbackMethod;
  const hasSyntheticAdjustments = adjustments.length > 0 && isFallbackMethod;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          How We Calculated This Value
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Data Status - HONEST REPORTING */}
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
          
          {/* HONEST FALLBACK EXPLANATION */}
          {isFallbackMethod && marketListingsCount === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>⚠️ Fallback Pricing Model:</strong> No recent market listings were available for this specific vehicle. 
                Valuation is based on MSRP-adjusted model with standard depreciation curves, mileage, condition, and regional factors applied.
                <br/><br/>
                <strong>Impact:</strong> Confidence reduced to {confidenceScore}% due to lack of real market validation.
              </p>
            </div>
          )}
        </div>

        {/* Base Price Anchor - HONEST SOURCE IDENTIFICATION */}
        {basePriceAnchor && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Base Price Calculation</h4>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {marketListingsCount > 0 ? basePriceAnchor.source : 'MSRP-Adjusted Model'}
                </p>
                <p className="text-xs text-gray-600">
                  {marketListingsCount > 0 
                    ? basePriceAnchor.method 
                    : 'Synthetic pricing using industry depreciation curves'
                  }
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(basePriceAnchor.amount)}</p>
            </div>
          </div>
        )}

        {/* Value Adjustments - HONEST SYNTHETIC VS REAL */}
        {adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {hasRealAdjustments ? 'Market Adjustments Applied' : 'Model Adjustments Applied'}
            </h4>
            
            {hasSyntheticAdjustments && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Note:</strong> These adjustments are calculated using industry-standard depreciation models, 
                not derived from actual market transactions.
              </div>
            )}
            
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
                {isFallbackMethod 
                  ? 'Based on synthetic pricing model' 
                  : `Based on ${marketListingsCount} market listing${marketListingsCount > 1 ? 's' : ''}`
                }
              </p>
            </div>
            <p className="text-xl font-bold text-green-700">{formatCurrency(estimatedValue)}</p>
          </div>
        </div>

        {/* Data Sources - HONEST REPORTING */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Data Sources</h4>
          <div className="flex flex-wrap gap-1">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source.replace('_', ' ').toUpperCase()}
              </Badge>
            ))}
            {marketListingsCount === 0 && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                MSRP FALLBACK
              </Badge>
            )}
          </div>
          
          {/* Regional Data Fix */}
          {zipCode && (
            <p className="text-xs text-gray-600 mt-2">
              Regional adjustments applied for ZIP code: {zipCode}
              {vin && ` • VIN: ${vin.substring(0, 8)}...`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
