
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Car, MapPin, Gauge, TrendingUp } from 'lucide-react';
import { EnterpriseValuationPanel } from '@/components/valuation/enterprise/EnterpriseValuationPanel';

interface UnifiedValuationResultProps {
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number | null;
    condition: string;
    vin?: string;
  };
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
    source?: string;
    timestamp?: string;
  }>;
  zipCode?: string;
  isPremium?: boolean;
  onEmailReport?: () => void;
  onUpgrade?: () => void;
}

export const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments = [],
  zipCode,
  isPremium = false,
  onEmailReport,
  onUpgrade
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Main Valuation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Car className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                  {vehicleInfo.trim && ` ${vehicleInfo.trim}`}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant={isPremium ? "default" : "secondary"}>
                    {isPremium ? 'Premium' : 'Free'} Valuation
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span className={`text-sm font-medium ${getConfidenceColor(confidenceScore)}`}>
                      {confidenceScore}% Data Quality
                    </span>
                    <div className="text-xs text-muted-foreground ml-1">
                      ({getConfidenceLevel(confidenceScore)} reliability)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${estimatedValue.toLocaleString()}
              </div>
              {priceRange && priceRange[0] > 0 && priceRange[1] > 0 ? (
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Market Range:</span> ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <span className="text-xs text-green-600 ml-2">✓ Based on real comparables</span>
                </div>
              ) : (
                <div className="text-sm text-amber-600 mt-1">
                  <span className="font-medium">⚠️ No market range available</span>
                  <div className="text-xs text-muted-foreground">Need 3+ comparable listings for range calculation</div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicleInfo.mileage && vehicleInfo.mileage > 0 && (
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span className="text-sm font-medium">Mileage:</span>
                <span className="text-sm text-muted-foreground">
                  {vehicleInfo.mileage.toLocaleString()} miles
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Condition:</span>
              <Badge variant="secondary">{vehicleInfo.condition}</Badge>
            </div>
            {zipCode && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm text-muted-foreground">{zipCode}</span>
              </div>
            )}
            {vehicleInfo.vin && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">VIN:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {vehicleInfo.vin.slice(-8)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adjustments with data source attribution */}
      {adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Value Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{adjustment.factor}</span>
                    <span className={`text-sm font-medium ${
                      adjustment.impact > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {adjustment.impact > 0 ? '+' : ''}${adjustment.impact.toLocaleString()}
                    </span>
                  </div>
                  {adjustment.description && (
                    <p className="text-xs text-muted-foreground">{adjustment.description}</p>
                  )}
                  {adjustment.source && (
                    <p className="text-xs text-blue-600">Source: {adjustment.source}</p>
                  )}
                  {adjustment.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(adjustment.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {onEmailReport && (
          <Button onClick={onEmailReport}>
            Email Report
          </Button>
        )}
        {!isPremium && onUpgrade && (
          <Button variant="outline" onClick={onUpgrade}>
            Upgrade to Premium
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedValuationResult;
