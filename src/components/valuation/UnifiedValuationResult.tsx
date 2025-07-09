
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
  // New props for truthful display
  dataSources?: string[];
  valuationNotes?: string[];
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
  onUpgrade,
  dataSources = [],
  valuationNotes = []
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
                  {confidenceScore && confidenceScore >= 50 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span className={`text-sm font-medium ${getConfidenceColor(confidenceScore)}`}>
                        {confidenceScore}% Data Quality
                      </span>
                      <div className="text-xs text-muted-foreground ml-1">
                        ({getConfidenceLevel(confidenceScore)} reliability)
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        Confidence score not available or too low to display
                      </span>
                      <div className="text-xs text-muted-foreground ml-1">
                        Add more vehicle info or upgrade to premium for higher accuracy
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${estimatedValue ? estimatedValue.toLocaleString() : "Unavailable"}
              </div>
              {dataSources.includes("fallback_msrp") && (
                <div className="text-sm text-amber-600 mt-1">
                  ⚠️ This value is based on an estimated MSRP. Real market data not available.
                </div>
              )}
              {priceRange && priceRange[0] > 0 && priceRange[1] > 0 ? (
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Market Range:</span> ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  <span className="text-xs text-green-600 ml-2">✓ Based on real comparables</span>
                </div>
              ) : (
                <div className="text-sm text-amber-600 mt-1">
                  <span className="font-medium italic">No market range available — not enough comparable listings</span>
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

      {/* AI Explanation Section */}
      {valuationNotes?.some(note => note.startsWith("🔍")) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Valuation Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-900 space-y-2">
              {valuationNotes
                .filter(note => note.startsWith("🔍"))
                .map((note, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {note.replace("🔍 ", "")}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Disclosure Section */}
      {valuationNotes && valuationNotes.filter(note => !note.startsWith("🔍")).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-700">Data Source Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-900 space-y-2">
              {valuationNotes
                .filter(note => !note.startsWith("🔍"))
                .map((note, idx) => (
                  <p key={idx}>⚠️ {note}</p>
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
