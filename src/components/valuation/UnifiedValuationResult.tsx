<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Mail, TrendingUp, AlertCircle } from 'lucide-react';
import { ValuationScoreBar } from './ValuationScoreBar';
import { AdjustmentBreakdown } from '@/utils/rules/types';
import { AINSummary } from '@/components/premium/insights/AINSummary';
import { CarfaxSummary } from '@/components/premium/insights/CarfaxSummary';
=======
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Mail } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface UnifiedValuationResultProps {
  valuationId: string;
<<<<<<< HEAD
  displayMode?: 'compact' | 'full';
=======
  displayMode?: "summary" | "full";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: AdjustmentBreakdown[];
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    mileage?: number;
    condition?: string;
    vin?: string;
  };
  isPremium?: boolean;
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
  onUpgrade?: () => void;
}

export default function UnifiedValuationResult({
  valuationId,
<<<<<<< HEAD
  displayMode = 'full',
=======
  displayMode = "summary",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments = [],
<<<<<<< HEAD
  vehicleInfo,
  isPremium = false,
  onDownloadPdf,
  onEmailReport,
  onUpgrade
}: UnifiedValuationResultProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMarketTrend = () => {
    if (confidenceScore >= 80) return { label: 'Strong', color: 'text-green-600', icon: TrendingUp };
    if (confidenceScore >= 60) return { label: 'Moderate', color: 'text-yellow-600', icon: TrendingUp };
    return { label: 'Uncertain', color: 'text-red-600', icon: AlertCircle };
  };

  const marketTrend = getMarketTrend();

  return (
    <div className="space-y-6">
      {/* Main Valuation Summary */}
      <Card className="relative">
        {isPremium && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900">
              Premium
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Valuation Summary</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Vehicle Info */}
          {vehicleInfo && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </h3>
              <div className="flex gap-4 text-sm text-muted-foreground">
                {vehicleInfo.mileage && <span>{vehicleInfo.mileage.toLocaleString()} miles</span>}
                {vehicleInfo.condition && <span>Condition: {vehicleInfo.condition}</span>}
              </div>
=======
  vehicleInfo = {},
  onDownloadPdf, // Add this to destructuring
  onEmailReport, // Add this to destructuring
}) => {
  // Calculate price range if not provided
  const calculatedPriceRange = priceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05),
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Estimated Value</span>
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vehicle information */}
        {vehicleInfo && (
          <div className="mb-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold text-lg mb-2">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {vehicleInfo.mileage && (
                <div>
                  <span className="text-muted-foreground">Mileage:</span>{" "}
                  {vehicleInfo.mileage.toLocaleString()} mi
                </div>
              )}
              {vehicleInfo.condition && (
                <div>
                  <span className="text-muted-foreground">Condition:</span>{" "}
                  {vehicleInfo.condition}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price range and confidence */}
        <div className="space-y-3 mb-6">
          <div>
            <span className="text-muted-foreground">Price Range:</span>{" "}
            <span className="font-medium">
              {formatCurrency(calculatedPriceRange[0])} -{" "}
              {formatCurrency(calculatedPriceRange[1])}
            </span>
          </div>
          {confidenceScore && (
            <div>
              <span className="text-muted-foreground">Confidence Score:</span>
              {" "}
              <span className="font-medium">{confidenceScore}%</span>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            </div>
          )}

<<<<<<< HEAD
          {/* Price Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Price Range</p>
              <p className="text-lg font-semibold">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Market Confidence</p>
              <div className="flex items-center justify-center gap-2">
                <marketTrend.icon className={`h-4 w-4 ${marketTrend.color}`} />
                <span className={`font-semibold ${marketTrend.color}`}>
                  {marketTrend.label}
                </span>
              </div>
=======
        {/* Adjustments (only in full mode) */}
        {displayMode === "full" && adjustments && adjustments.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Value Adjustments</h3>
            <div className="space-y-2">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{adjustment.factor}</span>
                  <span
                    className={adjustment.impact >= 0
                      ? "text-green-600"
                      : "text-red-600"}
                  >
                    {adjustment.impact > 0 ? "+" : ""}
                    {formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            </div>
          </div>

<<<<<<< HEAD
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className="text-sm font-bold">{confidenceScore}%</span>
            </div>
            <ValuationScoreBar score={confidenceScore} />
          </div>

          {/* Adjustments Breakdown */}
          {displayMode === 'full' && adjustments.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Value Adjustments</h4>
              <div className="space-y-2">
                {adjustments.map((adjustment, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{adjustment.factor}</span>
                    <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {isPremium ? (
              <>
                <Button onClick={onDownloadPdf} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Premium PDF
                </Button>
                <Button variant="outline" onClick={onEmailReport} className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </Button>
              </>
            ) : (
              <Button onClick={onUpgrade} className="w-full">
                Upgrade to Premium for Detailed Report
=======
        {/* Action buttons */}
        {(onDownloadPdf || onEmailReport) && (
          <div className="flex gap-3 mt-6">
            {onDownloadPdf && (
              <Button
                variant="outline"
                onClick={onDownloadPdf}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}
            {onEmailReport && (
              <Button
                variant="outline"
                onClick={onEmailReport}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Report
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      {isPremium && vehicleInfo?.vin && (
        <>
          <AINSummary
            vin={vehicleInfo.vin}
            vehicleData={{
              year: vehicleInfo.year,
              make: vehicleInfo.make,
              model: vehicleInfo.model,
              mileage: vehicleInfo.mileage,
              estimatedValue: estimatedValue
            }}
          />
          
          <CarfaxSummary />
        </>
      )}
    </div>
  );
}
