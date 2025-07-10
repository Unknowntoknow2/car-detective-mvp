import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Download, Loader2 } from 'lucide-react';
import type { ValuationResult } from '@/utils/valuation/unifiedValuationEngine';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';

interface ValuationResultCardProps {
  result: ValuationResult;
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
}

export function ValuationResultCard({ result, onDownloadPdf, onShareReport }: ValuationResultCardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const {
    vehicle,
    finalValue,
    confidenceScore,
    adjustments,
    aiExplanation,
    listingRange,
    listingCount,
    marketSearchStatus,
    sources
  } = result;

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    try {
      await downloadValuationPdf(result);
      // Call the optional callback if provided
      onDownloadPdf?.();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Could add toast notification here
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Confidence indicator color
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 65) return 'Moderate Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && <span className="text-muted-foreground ml-2">{vehicle.trim}</span>}
            </CardTitle>
            <Badge variant={confidenceScore >= 80 ? 'default' : confidenceScore >= 65 ? 'secondary' : 'destructive'}>
              {getConfidenceLabel(confidenceScore)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estimated Value */}
          <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Estimated Market Value</h3>
            <p className="text-4xl font-bold text-primary">${finalValue.toLocaleString()}</p>
            {listingRange && (
              <p className="text-sm text-muted-foreground mt-2">
                Market Range: ${listingRange.min.toLocaleString()} - ${listingRange.max.toLocaleString()}
              </p>
            )}
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className={`text-sm font-bold ${getConfidenceColor(confidenceScore)}`}>
                {confidenceScore}%
              </span>
            </div>
            <Progress value={confidenceScore} className="h-2" />
            {confidenceScore < 65 && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This valuation has lower confidence due to limited data availability. Consider providing more vehicle details for improved accuracy.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Market Data Status */}
          {marketSearchStatus !== 'success' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Market listings unavailable. Valuation based on depreciation model and regional adjustments.
              </AlertDescription>
            </Alert>
          )}

          {marketSearchStatus === 'success' && listingCount > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Valuation enhanced with {listingCount} live market listings for improved accuracy.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Value Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Value Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adjustments.map((adjustment, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <span className="font-medium">{adjustment.label}</span>
                  <p className="text-sm text-muted-foreground">{adjustment.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  {adjustment.amount >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-bold ${adjustment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.amount >= 0 ? '+' : ''}${adjustment.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">{aiExplanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {source.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Valuation completed at {new Date(result.timestamp).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleDownloadPdf} 
          className="flex-1" 
          variant="outline"
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}
        </Button>
        <Button onClick={onShareReport} className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          Share Report
        </Button>
      </div>
    </div>
  );
}

export default ValuationResultCard;