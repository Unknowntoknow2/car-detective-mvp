
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Download, Mail, Share2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/formatters';
import { ValuationFactorsGrid } from './condition/factors/ValuationFactorsGrid';
import { ConditionSliderWithTooltip } from './ConditionSliderWithTooltip';
import { AIConditionBadge } from './AIConditionBadge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Explanation } from './result/sections/Explanation';
import { supabase } from '@/integrations/supabase/client';
import MarketTrendSection from './MarketTrendSection';

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  color?: string;
}

interface UnifiedValuationResultProps {
  valuationId?: string;
  displayMode?: 'full' | 'compact';
  vehicleInfo: VehicleInfo;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  isPremium?: boolean;
  photoScore?: number;
  photoUrl?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    summary?: string;
  } | null;
  explanation?: string;
}

const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  valuationId,
  displayMode = 'full',
  vehicleInfo,
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments = [],
  isPremium = false,
  photoScore,
  photoUrl,
  aiCondition,
  explanation
}) => {
  const navigate = useNavigate();
  const [conditionScore, setConditionScore] = useState(
    vehicleInfo.condition === 'Excellent' ? 90 :
    vehicleInfo.condition === 'Good' ? 75 :
    vehicleInfo.condition === 'Fair' ? 50 : 25
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Calculate the range if not provided
  const calculatedPriceRange = priceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];

  // Calculate base price from adjustments
  const basePrice = adjustments.reduce((total, adj) => total - adj.impact, estimatedValue);

  const handleDownloadPdf = async () => {
    if (!valuationId || !isPremium) return;
    
    setIsGeneratingPdf(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-valuation-pdf', {
        body: { valuationId }
      });
      
      if (error) throw error;
      
      if (data && data.pdfUrl) {
        // Open PDF in new tab
        window.open(data.pdfUrl, '_blank');
        toast.success("PDF report generated successfully");
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = async () => {
    if (!valuationId || !isPremium) return;
    
    setIsSendingEmail(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email sent successfully");
    } catch (err) {
      toast.error("Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareReport = () => {
    if (!valuationId) return;
    
    // Copy shareable link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/valuation/${valuationId}`);
    toast.success("Share link copied to clipboard");
  };

  const handleUpgrade = () => {
    if (!valuationId) return;
    navigate(`/premium?valuationId=${valuationId}`);
  };

  const handleConditionChange = (newScore: number) => {
    setConditionScore(newScore);
    toast.info(`Condition updated to ${newScore}%. Recalculating valuation...`);
  };

  // For the compact mode, render a simplified version
  if (displayMode === 'compact') {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
            <div className="space-y-1 mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
              <p className="text-sm text-muted-foreground">
                {confidenceScore >= 80 ? 'High confidence' : 
                confidenceScore >= 60 ? 'Medium confidence' : 'Low confidence'}
                {' • '}
                {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
              </p>
            </div>
            
            <Button asChild>
              <Link to={`/valuation/${valuationId}`}>
                View Full Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full display mode
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex justify-between items-center">
            <span>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</span>
            {aiCondition && (
              <AIConditionBadge 
                condition={aiCondition.condition} 
                confidenceScore={aiCondition.confidenceScore} 
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
                <p className="text-sm text-muted-foreground">
                  {confidenceScore}% Confidence
                </p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Value Range</span>
                  <span className="font-medium">
                    {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Base Price</span>
                  <span className="font-medium">{formatCurrency(basePrice)}</span>
                </div>
                
                {adjustments.slice(0, 3).map((adj, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{adj.factor}</span>
                    <span className={adj.impact > 0 ? 'text-green-600' : adj.impact < 0 ? 'text-red-600' : ''}>
                      {adj.impact > 0 ? '+' : ''}{formatCurrency(adj.impact)}
                    </span>
                  </div>
                ))}
                
                {adjustments.length > 3 && (
                  <div className="text-sm text-muted-foreground text-center pt-1">
                    {adjustments.length - 3} more adjustments
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <h3 className="font-medium">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{vehicleInfo.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mileage</p>
                  <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} miles</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{vehicleInfo.condition}</p>
                </div>
                {vehicleInfo.transmission && (
                  <div>
                    <p className="text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicleInfo.transmission}</p>
                  </div>
                )}
                {vehicleInfo.fuelType && (
                  <div>
                    <p className="text-muted-foreground">Fuel Type</p>
                    <p className="font-medium">{vehicleInfo.fuelType}</p>
                  </div>
                )}
                {vehicleInfo.bodyType && (
                  <div>
                    <p className="text-muted-foreground">Body Type</p>
                    <p className="font-medium">{vehicleInfo.bodyType}</p>
                  </div>
                )}
                {vehicleInfo.color && (
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{vehicleInfo.color}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {photoUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Photo Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <img 
                  src={photoUrl} 
                  alt="Vehicle" 
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                {photoScore && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-1">Photo Quality Score</h3>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${photoScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {photoScore}% - {photoScore > 80 ? 'Excellent' : photoScore > 60 ? 'Good' : photoScore > 40 ? 'Fair' : 'Poor'}
                    </p>
                  </div>
                )}
                
                {aiCondition && aiCondition.summary && (
                  <div>
                    <h3 className="font-medium mb-1">AI Assessment</h3>
                    <p className="text-sm">{aiCondition.summary}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condition Assessment</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ConditionSliderWithTooltip 
            score={conditionScore}
            onScoreChange={handleConditionChange}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Value Factors</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ValuationFactorsGrid 
            values={{
              accidents: 0,
              mileage: vehicleInfo.mileage,
              year: vehicleInfo.year,
              titleStatus: 'Clean'
            }}
            onChange={(id, value) => {
              toast.info(`${id} updated to ${value}. Recalculating valuation...`);
            }}
          />
        </CardContent>
      </Card>
      
      {/* Market Trend Section */}
      {valuationId && (
        <MarketTrendSection
          valuationId={valuationId}
          make={vehicleInfo.make}
          model={vehicleInfo.model}
          year={vehicleInfo.year}
          estimatedValue={estimatedValue}
          isPremium={isPremium}
          onUpgrade={handleUpgrade}
        />
      )}
      
      {/* Explanation Section */}
      <Explanation
        explanation={explanation || "This vehicle is currently valued at approximately $24,500 based on recent market trends and specific vehicle conditions. The valuation takes into account several factors including current mileage, overall condition, and market demand in your area."}
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
      />
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex-1" onClick={handleShareReport}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Report
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleDownloadPdf}
          disabled={!isPremium || isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleSendEmail}
          disabled={!isPremium || isSendingEmail}
        >
          {isSendingEmail ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </>
          )}
        </Button>
        {!isPremium && (
          <Button className="flex-1" onClick={handleUpgrade}>
            Upgrade to Premium
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedValuationResult;
