import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/config';


import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Loader2, 
  Share2, 
  Copy, 
  Info, 
  Bot,
  MapPin,
  Gauge,
  Wrench,
  FileX,
  Shield
} from 'lucide-react';
import { AuditAndSourcesAccordion } from './AuditAndSourcesAccordion';
// Using generic result type since we removed the engine
import { valuationLogger } from '@/utils/valuationLogger';

interface ValuationResultCardProps {
  result: any; // Generic result type
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
  vin?: string;
}

export function ValuationResultCard({ result, onDownloadPdf, onShareReport, vin = 'unknown' }: ValuationResultCardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const {
    finalValue,
    priceRange,
    confidenceScore,
    marketListings,
    zipAdjustment,
    mileagePenalty,
    conditionDelta,
    titlePenalty,
    aiExplanation,
    sourcesUsed,
    adjustments,
    baseValue,
    explanation
  } = result;

  // Log results display
  React.useEffect(() => {
    valuationLogger.resultsDisplay(vin, 'display-results', {
      finalValue,
      confidenceScore,
      marketListingsCount: marketListings?.length || 0,
      sourcesUsed: sourcesUsed || [],
      usedOpenAIFallback: sourcesUsed?.includes('openai') || sourcesUsed?.includes('openai-web') || false
    }, true);
  }, [finalValue, confidenceScore, marketListings, sourcesUsed, vin]);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    try {
      valuationLogger.resultsDisplay(vin, 'pdf-download-start', { finalValue }, true);
      onDownloadPdf?.();
      valuationLogger.resultsDisplay(vin, 'pdf-download-success', {}, true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      valuationLogger.resultsDisplay(vin, 'pdf-download-error', { error: errorMessage }, false, errorMessage);
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

  const shareLink = `${window.location.origin}/results/shared`; // Placeholder

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      valuationLogger.resultsDisplay(vin, 'share-copy-success', { shareLink }, true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      valuationLogger.resultsDisplay(vin, 'share-copy-error', { error: errorMessage }, false, errorMessage);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Warning Banner for Data Quality Issues */}
        {(marketListings.length === 0 || confidenceScore < 65 || sourcesUsed?.some((source: any) => source.includes('openai') || source.includes('fallback'))) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Quality Warning:</strong>
              {marketListings.length === 0 && ' No market listings found. '}
              {confidenceScore < 65 && ' Low confidence score due to limited data. '}
              {sourcesUsed?.some((source: any) => source.includes('openai') || source.includes('fallback')) && ' AI-generated or fallback data used. '}
              Results may be less accurate than usual.
            </AlertDescription>
          </Alert>
        )}

        {/* Valuation Summary */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Valuation Summary
              </CardTitle>
              <Badge variant={confidenceScore >= 80 ? 'default' : confidenceScore >= 65 ? 'secondary' : 'destructive'}>
                {getConfidenceLabel(confidenceScore)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method-specific disclosure for fallback */}
            {sourcesUsed?.some((source: any) => source.includes('fallback') || source.includes('depreciation')) && (
              <Alert variant="default" className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Fallback Pricing Method:</strong> Model-based estimate (no verified local comps yet). 
                  Confidence is limited to {Math.min(confidenceScore, 60)}% when using fallback pricing.
                  Add photos or retry live market search to tighten the range.
                </AlertDescription>
              </Alert>
            )}

            {/* Final Value Display */}
            <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Estimated Market Value</h3>
              <p className="text-4xl font-bold text-primary">${finalValue.toLocaleString()}</p>
              {priceRange && priceRange.length === 2 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Market Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </p>
              )}
              {/* Show range percentage for fallback method */}
              {sourcesUsed?.some((source: any) => source.includes('fallback')) && (
                <p className="text-xs text-orange-600 mt-1">
                  ±15% range due to model-based pricing
                </p>
              )}
            </div>

            {/* Confidence Score with Visual Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className={`text-sm font-semibold ${getConfidenceColor(confidenceScore)}`}>
                  {confidenceScore}%
                </span>
              </div>
              <Progress value={confidenceScore} className="h-3" />
              <div className="text-xs text-muted-foreground">
                {confidenceScore > 75 ? '✅ Market Confidence: Excellent' : 
                 confidenceScore > 60 ? '⚠️ Moderate Confidence: Use Caution' : 
                 '❌ Low Confidence: Additional inspection recommended'}
              </div>
            </div>

            {/* Source Summary */}
            {sourcesUsed && sourcesUsed.length > 0 && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Data Sources Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sourcesUsed.map((source: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adjustments Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Value Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Base Value */}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">Base Market Value</span>
                <span className="font-bold">${baseValue.toLocaleString()}</span>
              </div>

              {/* ZIP Code Adjustment */}
              {zipAdjustment !== undefined && zipAdjustment !== 0 && (
                <div className="flex items-center justify-between py-2 border-l-4 border-blue-500 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">ZIP Code Market Adjustment</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Local market demand and supply factors</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {zipAdjustment > 0 ? 'High demand area premium' : 'Low demand area discount'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {zipAdjustment >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-bold ${zipAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {zipAdjustment >= 0 ? '+' : ''}${zipAdjustment.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Mileage Penalty */}
              {mileagePenalty !== undefined && mileagePenalty !== 0 && (
                <div className="flex items-center justify-between py-2 border-l-4 border-orange-500 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      <span className="font-medium">Mileage Adjustment</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Value adjustment based on vehicle mileage vs. average</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mileagePenalty < 0 ? 'Above average mileage' : 'Below average mileage'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {mileagePenalty >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-bold ${mileagePenalty >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {mileagePenalty >= 0 ? '+' : ''}${mileagePenalty.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Condition Delta */}
              {conditionDelta !== undefined && conditionDelta !== 0 && (
                <div className="flex items-center justify-between py-2 border-l-4 border-purple-500 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Condition Adjustment</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Value adjustment based on vehicle condition</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conditionDelta > 0 ? 'Above average condition' : 'Below average condition'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {conditionDelta >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-bold ${conditionDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {conditionDelta >= 0 ? '+' : ''}${conditionDelta.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Title Penalty */}
              {titlePenalty !== undefined && titlePenalty !== 0 && (
                <div className="flex items-center justify-between py-2 border-l-4 border-red-500 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileX className="w-4 h-4" />
                      <span className="font-medium">Title Status Penalty</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Value reduction due to title issues</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Non-clean title detected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-red-600">
                      -${Math.abs(titlePenalty).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Additional Adjustments */}
              {adjustments && adjustments.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  <h4 className="font-medium text-sm">Additional Factors</h4>
                  {adjustments.map((adj: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-1 text-sm">
                      <span>{adj.factor}</span>
                      <span className={`font-medium ${adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adj.impact >= 0 ? '+' : ''}${adj.impact.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Final Value */}
              <div className="flex items-center justify-between py-3 border-t-2 border-primary/20">
                <span className="text-lg font-bold">Final Estimated Value</span>
                <span className="text-lg font-bold text-primary">${finalValue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Listings */}
        {marketListings && marketListings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Listings ({marketListings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketListings.slice(0, 10).map((listing: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{listing.source}</TableCell>
                      <TableCell>${listing.price.toLocaleString()}</TableCell>
                      <TableCell>{listing.mileage.toLocaleString()} mi</TableCell>
                      <TableCell>
                        <Badge variant={listing.tier === 'Tier1' ? 'default' : listing.tier === 'Tier2' ? 'secondary' : 'outline'}>
                          {listing.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>{listing.location || 'N/A'}</TableCell>
                      <TableCell>
                        {listing.url ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={listing.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {marketListings.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Showing 10 of {marketListings.length} listings
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Explanation */}
        {(aiExplanation || explanation) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {aiExplanation || explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleDownloadPdf} 
                disabled={isGeneratingPdf}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download PDF
              </Button>

              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                {copySuccess ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </Button>

              <Button 
                onClick={onShareReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit & Sources Section */}
        {appConfig.AUDIT_ENABLED && (
          <div>
            <AuditAndSourcesAccordion result={result as any} />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}