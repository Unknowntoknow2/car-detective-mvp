import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Shield, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AICondition } from '@/types/photo';

interface UnifiedValuationHeaderProps {
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: string;
  };
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  displayMode?: 'compact' | 'full';
  aiCondition?: AICondition;
}

export const UnifiedValuationHeader: React.FC<UnifiedValuationHeaderProps> = ({
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  priceRange,
  displayMode = 'full',
  aiCondition,
}) => {
  const confidentScore = confidenceScore || 0;
  const aiConfidenceScore = aiCondition?.confidence || confidentScore;

  const renderStars = (score: number) => {
    const filledStars = Math.floor(score / 20);
    const remaining = score % 20;
    let stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />);
      } else if (i === filledStars && remaining > 0) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-500" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  if (displayMode === 'compact') {
    return (
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-semibold">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h3>
          <p className="text-sm text-muted-foreground">{vehicleInfo.mileage.toLocaleString()} miles</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{formatCurrency(estimatedValue)}</div>
          <Badge variant={aiConfidenceScore >= 90 ? 'default' : aiConfidenceScore >= 75 ? 'secondary' : 'destructive'}>
            {Math.round(aiConfidenceScore)}% confidence
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-gray-600">Estimated Value</div>
            <div className="text-3xl font-semibold text-primary">{formatCurrency(estimatedValue)}</div>
            <div className="text-sm text-muted-foreground">
              Based on {vehicleInfo.mileage.toLocaleString()} miles and {vehicleInfo.condition} condition
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Market Confidence
            </div>
            <div className="flex items-center gap-2">
              {renderStars(aiConfidenceScore)}
              <Badge variant={aiConfidenceScore >= 90 ? 'default' : aiConfidenceScore >= 75 ? 'secondary' : 'destructive'}>
                {Math.round(aiConfidenceScore)}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Our AI analysis indicates a {aiConfidenceScore >= 75 ? 'strong' : 'moderate'} confidence in this valuation.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
            <Shield className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Price Range</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
            <Clock className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">AI Condition Score</div>
              <div className="text-sm text-muted-foreground">
                {aiCondition?.condition || 'Good'} ({Math.round(aiConfidenceScore)}%)
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedValuationHeader;
