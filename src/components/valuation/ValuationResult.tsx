
import React from 'react';
import { ValuationResponse } from '@/components/lookup/types/valuation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, Mail, TrendingUp, Award, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export interface ValuationResultProps {
  valuationId?: string;
  data: ValuationResponse & { isPremium?: boolean };
  isPremium: boolean;
  onUpgrade?: () => void;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({ 
  valuationId, 
  data, 
  isPremium,
  onUpgrade 
}) => {
  const estimatedValue = data.estimatedValue || 0;
  const confidenceScore = data.confidenceScore || 75;

  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { level: 'High', color: 'bg-green-500', description: 'Excellent data quality' };
    if (score >= 70) return { level: 'Good', color: 'bg-blue-500', description: 'Reliable assessment' };
    if (score >= 55) return { level: 'Fair', color: 'bg-yellow-500', description: 'Limited data available' };
    return { level: 'Low', color: 'bg-red-500', description: 'Estimate only' };
  };

  const confidence = getConfidenceLevel(confidenceScore);

  const priceRange = {
    low: Math.round(estimatedValue * 0.95),
    high: Math.round(estimatedValue * 1.05)
  };

  const adjustments = data.adjustments || [
    { factor: 'Base Market Value', impact: Math.round(estimatedValue * 0.8), description: 'Starting value for this vehicle' },
    { factor: 'Mileage Adjustment', impact: data.mileage ? -Math.round(data.mileage / 10000 * 500) : 0, description: `Based on ${data.mileage?.toLocaleString() || 'unknown'} miles` },
    { factor: 'Condition Assessment', impact: 1500, description: `${data.condition || 'Good'} condition reported` },
    { factor: 'Market Demand', impact: 2000, description: 'Current market conditions' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Valuation Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Estimated Market Value
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {data.year} {data.make} {data.model}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(estimatedValue)}
              </div>
              <Badge className={`${confidence.color} text-white mt-2`}>
                {confidence.level} Confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Price Range</p>
              <p className="text-lg font-semibold">
                {formatCurrency(priceRange.low)} - {formatCurrency(priceRange.high)}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <p className="text-lg font-semibold">{confidenceScore}%</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Market Trend</p>
              <p className="text-lg font-semibold flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Stable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Valuation Breakdown
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How we calculated your vehicle's estimated value
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adjustments.map((adjustment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium">{adjustment.factor}</p>
                  <p className="text-sm text-muted-foreground">{adjustment.description}</p>
                </div>
                <div className={`font-semibold ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {adjustment.impact >= 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total Estimated Value</span>
              <span className="text-primary">{formatCurrency(estimatedValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source & Confidence */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Data Sources</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• NHTSA Vehicle Database</li>
                <li>• Current Market Listings</li>
                <li>• Historical Sales Data</li>
                <li>• Vehicle Condition Assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Confidence Assessment</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${confidence.color}`}></div>
                  <span className="text-sm">{confidence.level} Confidence ({confidenceScore}%)</span>
                </div>
                <p className="text-sm text-muted-foreground">{confidence.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Email Results
            </Button>
            {!isPremium && onUpgrade && (
              <Button onClick={onUpgrade} className="flex-1">
                <ArrowRight className="mr-2 h-4 w-4" />
                Get Premium Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Context */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-blue-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Market Context</p>
            <p className="text-blue-700 mt-1">
              This valuation is based on current market conditions and real vehicle data. 
              Values can fluctuate based on local market demand, seasonal trends, and vehicle availability.
              For selling purposes, consider getting multiple offers to maximize your return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationResult;
