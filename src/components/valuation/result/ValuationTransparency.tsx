
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { AdjustmentTransparency } from './AdjustmentTransparency';
import { formatCurrency } from '@/utils/formatters';
import { ValidatedAdjustment } from '@/types/adjustments';

interface ValuationTransparencyProps {
  marketListingsCount: number;
  confidenceScore: number;
  basePriceAnchor?: {
    source: string;
    amount: number;
    method: string;
  };
  adjustments: ValidatedAdjustment[];
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Valuation Transparency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Data Status - HONEST REPORTING */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Data Sources Used</h4>
          <div className="flex items-center gap-2">
            {marketListingsCount > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{marketListingsCount} real market listings analyzed</span>
                <Badge variant="default" className="text-xs">Live Market Data</Badge>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm">No current market listings found</span>
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                  Synthetic Model
                </Badge>
              </>
            )}
          </div>
          
          {/* CRITICAL: Honest fallback explanation */}
          {isFallbackMethod && marketListingsCount === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>⚠️ Fallback Pricing Method Active:</strong> No recent market listings were available for this specific vehicle. 
                This valuation uses an MSRP-adjusted model with industry-standard depreciation curves and regional factors.
                <br/><br/>
                <strong>Confidence Impact:</strong> Maximum confidence limited to {confidenceScore}% due to lack of real market validation.
                For transactions over $20,000, consider getting a professional appraisal.
              </p>
            </div>
          )}
        </div>

        {/* Base Price Calculation - HONEST SOURCE IDENTIFICATION */}
        {basePriceAnchor && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Price Foundation</h4>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {basePriceAnchor.source}
                </p>
                <p className="text-xs text-gray-600">
                  {basePriceAnchor.method}
                </p>
                {isFallbackMethod && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Synthetic calculation - not derived from current market sales
                  </p>
                )}
              </div>
              <p className="font-semibold">{formatCurrency(basePriceAnchor.amount)}</p>
            </div>
          </div>
        )}

        {/* Value Adjustments - HONEST TRANSPARENCY */}
        <AdjustmentTransparency
          adjustments={adjustments}
          isFallbackMethod={isFallbackMethod}
          marketListingsCount={marketListingsCount}
        />

        {/* Final Calculation */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-semibold text-green-800">Final Estimated Value</p>
              <p className="text-xs text-green-600">
                {isFallbackMethod 
                  ? `Synthetic model result (confidence: ${confidenceScore}%)` 
                  : `Market-based analysis of ${marketListingsCount} listing${marketListingsCount > 1 ? 's' : ''}`
                }
              </p>
            </div>
            <p className="text-xl font-bold text-green-700">{formatCurrency(estimatedValue)}</p>
          </div>
        </div>

        {/* Data Sources - HONEST REPORTING */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Technical Sources</h4>
          <div className="flex flex-wrap gap-1">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source.replace('_', ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
          
          {/* Location and VIN Info */}
          {zipCode && (
            <p className="text-xs text-gray-600 mt-2">
              Regional analysis: {zipCode}
              {vin && ` • VIN: ${vin.substring(0, 8)}...`}
            </p>
          )}

          {/* CRITICAL: Data quality disclaimer for fallback */}
          {isFallbackMethod && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <p className="text-red-700">
                <strong>Data Quality Notice:</strong> 
                For high-value decisions, obtain multiple valuations or professional appraisal.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
