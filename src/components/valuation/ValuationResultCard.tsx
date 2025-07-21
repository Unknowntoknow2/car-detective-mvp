import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { ExternalLink, FileText, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Download, Loader2, QrCode, Share2, Lock, Copy, Twitter, MessageCircle, Mail, ThumbsUp, ThumbsDown, Scale, Info, Bot } from 'lucide-react';
import type { UnifiedValuationResult } from '@/types/valuation';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { submitValuationFeedback } from '@/services/supabase/feedbackService';
import { useAuth } from '@/hooks/useAuth';
import { useUserPlan } from '@/hooks/useUserPlan';
import { UpgradeCTA } from '@/components/ui/UpgradeCTA';

interface ValuationResultCardProps {
  result: UnifiedValuationResult;
  onDownloadPdf?: () => void;
  onShareReport?: () => void;
}

export function ValuationResultCard({ result, onDownloadPdf, onShareReport }: ValuationResultCardProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const { user } = useAuth();
  const { isPremium, hasFeature } = useUserPlan();
  
  const {
    vehicle,
    finalValue,
    confidenceScore,
    adjustments,
    aiExplanation,
    listingRange,
    listingCount,
    marketSearchStatus,
    sources,
    titleStatus,
    recalls
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

  const copyToClipboard = async () => {
    const shareLink = (result as any).shareLink; // Handle optional property
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const shareOnTwitter = () => {
    const shareLink = (result as any).shareLink; // Handle optional property
    if (shareLink) {
      const text = `Check out this ${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} valuation: $${result.finalValue.toLocaleString()}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
      window.open(url, '_blank', 'width=550,height=420');
    }
  };

  const shareOnWhatsApp = () => {
    const shareLink = (result as any).shareLink; // Handle optional property
    if (shareLink) {
      const text = `Check out this ${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} valuation: $${result.finalValue.toLocaleString()} - ${shareLink}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const shareViaEmail = () => {
    const shareLink = (result as any).shareLink; // Handle optional property
    if (shareLink) {
      const subject = `Vehicle Valuation: ${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}`;
      const body = `I wanted to share this vehicle valuation with you:\n\n${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}\nEstimated Value: $${result.finalValue.toLocaleString()}\nConfidence Score: ${result.confidenceScore}%\n\nView the full report: ${shareLink}`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url);
    }
  };

  const handleFeedbackSubmit = async (rating: 1 | 2 | 3 | 4 | 5) => {
    if (!user || submittingFeedback || feedbackSubmitted) return;
    
    setSubmittingFeedback(true);
    try {
      await submitValuationFeedback({
        userId: user.id,
        accuracyRating: rating,
        wouldRecommend: rating >= 4,
        timestamp: Date.now()
      });
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <TooltipProvider>
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

          {/* Enhanced Confidence Score with Progress Bar */}
          {confidenceScore && (
            <div className="mt-2">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Confidence: {confidenceScore}%
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Exact VIN Match Badge */}
          {sources?.includes('exact_vin_match') && (
            <div className="mt-2 inline-flex items-center text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              🎯 Exact VIN Match Anchored
            </div>
          )}

          {/* Market Listing Preview */}
          {(() => {
            const exactVinMatch = result.listings?.find(listing => listing.vin === result.vin);
            return exactVinMatch && (
              <div className="mt-4 border rounded-lg p-3 bg-muted">
                <div className="text-sm font-semibold text-primary mb-1">
                  Verified Listing:
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Dealer: {exactVinMatch.dealer_name}</div>
                  <div>Price: ${exactVinMatch.price?.toLocaleString()}</div>
                  <div className="text-xs italic text-muted">Source: {exactVinMatch.source}</div>
                </div>
              </div>
            );
          })()}
          {confidenceScore < 65 && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This valuation has lower confidence due to limited data availability. Consider providing more vehicle details for improved accuracy.
              </AlertDescription>
            </Alert>
          )}

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

          {/* Title Status Section */}
          {titleStatus && (
            <div className="rounded-xl border p-4 mt-4 bg-muted/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🔍 Title Status
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {titleStatus === 'clean'
                  ? '✅ Clean title — no penalties applied.'
                  : `⚠️ ${titleStatus} title — value reduced due to risk.`}
              </p>
            </div>
          )}

          {/* Open Recalls Section */}
          {recalls && recalls.length > 0 && (
            <div className="rounded-xl border p-4 mt-4 bg-muted/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🚨 Open Recalls
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {recalls.map((recall, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{recall}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Valuation Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Valuation Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing Steps</span>
                <span className="text-sm text-muted-foreground">
                  {result.confidenceScore}% Complete
                </span>
              </div>
              <Progress value={result.confidenceScore} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>VIN Decoded</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Depreciation Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Mileage Adjusted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Condition Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Fuel Cost Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-3 h-3 ${result.marketSearchStatus === 'success' ? 'text-green-600' : 'text-yellow-600'}`} />
                <span>Market Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>AI Analysis</span>
              </div>
              {hasFeature('pdf_download') && (result as any).pdfUrl && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>PDF Generated</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Breakdown with Tooltips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Value Breakdown
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Each factor that influenced your vehicle's final valuation</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adjustments.map((adjustment, index) => {
              // Define tooltip text for each adjustment type
              const getTooltipText = (label: string) => {
                switch (label.toLowerCase()) {
                  case 'depreciation':
                    return 'Based on vehicle age and standard depreciation curves.';
                  case 'fuel type impact':
                  case 'fuel cost impact':
                    return 'Adjusts for current fuel prices in your ZIP code.';
                  case 'market anchoring':
                    return 'Real-time prices from vehicles like yours, found online.';
                  case 'mileage':
                    return 'Higher mileage typically reduces value due to wear and tear.';
                  case 'condition':
                    return 'Vehicle condition affects value - better condition = higher value.';
                  default:
                    return 'This factor affected your vehicle\'s valuation.';
                }
              };

              return (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{adjustment.label}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getTooltipText(adjustment.label)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>AI Valuation Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation">
              <AccordionTrigger className="text-left">
                🔍 See Detailed AI Valuation Breakdown
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer className="mt-4">
                  {aiExplanation || 'No explanation available'}
                </MarkdownRenderer>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* FIX #6: Enhanced Data Sources with Traceability */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Audit Trail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Live Market Listings Display with VIN Match Detection */}
          {result.listings && result.listings.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Market Listings ({result.listingCount})</h4>
                {/* Check for exact VIN match indicator */}
                {result.listings.some(listing => listing.vin === result.vin) && (
                  <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Exact VIN Match
                  </Badge>
                )}
              </div>
              <div className="grid gap-2 max-h-48 overflow-y-auto">
                {result.listings.slice(0, 5).map((listing, index) => {
                  const isExactVinMatch = listing.vin === result.vin;
                  return (
                    <div key={index} className={`flex justify-between items-center p-2 rounded text-sm ${
                      isExactVinMatch ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${listing.price?.toLocaleString() || 'N/A'}</span>
                          <span className="text-muted-foreground">
                            {listing.mileage ? `${listing.mileage.toLocaleString()} mi` : 'Unknown mi'}
                          </span>
                          {isExactVinMatch && (
                            <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                              <Scale className="w-3 h-3 mr-1" />
                              Price Anchor
                            </Badge>
                          )}
                        </div>
                        {listing.dealer_name && (
                          <div className="text-xs text-muted-foreground">{listing.dealer_name}</div>
                        )}
                        {isExactVinMatch && (
                          <div className="text-xs text-green-700 font-medium">
                            VIN: {listing.vin} • Anchored with 80% weight
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">{listing.source || 'Web'}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No live market listings found. Valuation based on depreciation model and regional adjustments.
              </AlertDescription>
            </Alert>
          )}

          {/* Source Traceability with Tooltips */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Source Traceability</h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => {
                 const getSourceTooltip = (src: string) => {
                   switch (src) {
                     case 'eia_fuel_costs': return 'Fuel pricing from U.S. Energy Information Administration';
                     case 'openai_market_search': return 'Live market listings via AI web search';
                     case 'msrp_db_lookup': return 'MSRP from verified database';
                     case 'estimated_msrp': return 'Estimated MSRP based on vehicle class';
                     case 'exact_vin_match': return 'Exact VIN match found - price anchored with 80% weight for maximum accuracy';
                     default: return `Data source: ${src.replace(/_/g, ' ')}`;
                   }
                 };

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <Badge variant="outline" className="capitalize cursor-help">
                        {source.replace(/_/g, ' ')}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getSourceTooltip(source)}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Inline Audit Trail */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Process Audit Trail</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>VIN Decoded ✓</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>MSRP {sources.includes('msrp_db_lookup') ? 'DB Lookup' : 'Estimated'} ✓</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Fuel Cost {sources.includes('eia_fuel_costs') ? 'EIA Live' : 'Fallback'} ✓</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className={`w-3 h-3 ${result.marketSearchStatus === 'success' ? 'text-green-600' : 'text-yellow-600'}`} />
                <span>Market {result.marketSearchStatus === 'success' ? 'Live Data' : 'Fallback'} {result.marketSearchStatus === 'success' ? '✓' : '⚠'}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Confidence {result.confidenceScore}% ✓</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>AI Explanation ✓</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Valuation completed at {new Date(result.timestamp).toLocaleString()}
            {isPremium && ' • Premium Analysis'}
          </p>
        </CardContent>
      </Card>

      {/* Valuation Actions */}
      <Card className="mt-6 p-4 border shadow-sm">
        <h3 className="text-lg font-semibold mb-2">📊 Valuation Actions</h3>
        
        {/* PDF Download - Premium Gated */}
        {hasFeature('pdf_download') && (result as any).pdfUrl && (
          <Button asChild className="w-full mt-2">
            <a
              href={(result as any).pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Download Full PDF Report
            </a>
          </Button>
        )}

        {!hasFeature('pdf_download') && (
          <UpgradeCTA feature="PDF reports" className="mt-4" />
        )}

        {/* Share Link + Copy Button */}
        {(result as any).shareLink && (
          <div className="mt-4">
            <Label className="text-sm">🔗 Share this valuation:</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={(result as any).shareLink}
                readOnly
                className="text-xs flex-grow"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            {copySuccess && (
              <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>
            )}
            
            {/* Social Share Buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={shareOnTwitter}
                className="flex items-center gap-1"
              >
                <Twitter className="w-3 h-3" />
                X
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={shareOnWhatsApp}
                className="flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={shareViaEmail}
                className="flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                Email
              </Button>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {(result as any).qrCode && (
          <div className="mt-4">
            <Label className="text-sm">📱 Scan to view valuation:</Label>
            <div className="flex items-start gap-4 mt-2">
              <img
                src={(result as any).qrCode}
                alt="QR Code for sharing valuation"
                className="h-28 border rounded-lg"
              />
              <div className="flex-1 text-xs text-muted-foreground">
                <p className="mb-2">Scan this QR code with any smartphone camera to instantly access the valuation report.</p>
                {result.timestamp && (
                  <p className="text-xs text-muted-foreground">
                    Generated: {new Date(result.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confidence Progress Bar */}
        <div className="mt-6">
          <Label className="text-sm">Confidence Score</Label>
          <Progress value={result.confidenceScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Based on VIN accuracy, fuel cost match, and market data injection
          </p>
        </div>
      </Card>

      {/* User Feedback Section */}
      {user && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💬 Help Us Improve This Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!feedbackSubmitted ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Was this valuation accurate and fair based on your vehicle's condition and the current market?
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleFeedbackSubmit(5)}
                    disabled={submittingFeedback}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes, seems accurate
                  </Button>
                  
                  <Button
                    onClick={() => handleFeedbackSubmit(3)}
                    disabled={submittingFeedback}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    Somewhat off
                  </Button>
                  
                  <Button
                    onClick={() => handleFeedbackSubmit(1)}
                    disabled={submittingFeedback}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    No, far off
                  </Button>
                </div>
                
                {submittingFeedback && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting feedback...
                  </div>
                )}
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ Thank you! Your feedback helps us improve our valuation accuracy.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    </TooltipProvider>
  );
}

export default ValuationResultCard;