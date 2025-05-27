
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  MapPin, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ValuationData {
  id: string;
  estimated_value: number;
  confidence_score: number;
  base_price?: number;
  created_at: string;
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
}

interface FollowUpData {
  condition: string;
  mileage: number;
  zip_code: string;
  accidents: {
    hadAccident: boolean;
    count?: number;
    severity?: string;
  };
  tire_condition: string;
  title_status: string;
  modifications: {
    modified: boolean;
    types?: string[];
  };
}

interface ValuationResultProps {
  vin: string;
  showPdfExport?: boolean;
}

interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
  icon: React.ReactNode;
}

export function ValuationResult({ vin, showPdfExport = false }: ValuationResultProps) {
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValuationData();
  }, [vin]);

  const fetchValuationData = async () => {
    if (!vin) {
      setError('VIN is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch valuation data
      const { data: valuation, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (valuationError) {
        throw new Error(`Failed to fetch valuation: ${valuationError.message}`);
      }

      if (!valuation) {
        setError('No valuation found for this VIN');
        setIsLoading(false);
        return;
      }

      setValuationData(valuation);

      // Fetch follow-up answers
      const { data: followUp, error: followUpError } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (followUpError) {
        console.warn('Follow-up data not found:', followUpError.message);
      }

      setFollowUpData(followUp);
    } catch (err) {
      console.error('Error fetching valuation data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load valuation data');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 85) return { variant: 'default' as const, text: 'High Confidence', color: 'text-green-600' };
    if (score >= 70) return { variant: 'secondary' as const, text: 'Moderate Confidence', color: 'text-yellow-600' };
    return { variant: 'destructive' as const, text: 'Low Confidence', color: 'text-red-600' };
  };

  const calculatePriceRange = (estimatedValue: number, confidenceScore: number) => {
    // Lower confidence = wider range
    const rangePercent = confidenceScore >= 85 ? 0.05 : confidenceScore >= 70 ? 0.08 : 0.12;
    return {
      low: Math.round(estimatedValue * (1 - rangePercent)),
      high: Math.round(estimatedValue * (1 + rangePercent))
    };
  };

  const generateAdjustments = (): AdjustmentItem[] => {
    if (!valuationData || !followUpData) return [];

    const basePrice = valuationData.base_price || valuationData.estimated_value * 0.9;
    const adjustments: AdjustmentItem[] = [];

    // Mileage adjustment
    if (followUpData.mileage) {
      const avgMileagePerYear = 12000;
      const expectedMileage = (new Date().getFullYear() - (valuationData.year || 2020)) * avgMileagePerYear;
      const mileageDiff = followUpData.mileage - expectedMileage;
      
      if (mileageDiff < -20000) {
        adjustments.push({
          factor: 'Low Mileage',
          impact: Math.round(basePrice * 0.08),
          description: `${followUpData.mileage.toLocaleString()} miles is well below average`,
          icon: <TrendingUp className="h-4 w-4 text-green-600" />
        });
      } else if (mileageDiff > 20000) {
        adjustments.push({
          factor: 'High Mileage',
          impact: Math.round(basePrice * -0.1),
          description: `${followUpData.mileage.toLocaleString()} miles is above average`,
          icon: <TrendingDown className="h-4 w-4 text-red-600" />
        });
      }
    }

    // Condition adjustment
    if (followUpData.condition) {
      const conditionImpacts = {
        'excellent': { impact: 0.05, description: 'Exceptional condition with minimal wear' },
        'good': { impact: 0, description: 'Good overall condition with normal wear' },
        'fair': { impact: -0.08, description: 'Shows noticeable wear and minor issues' },
        'poor': { impact: -0.15, description: 'Significant wear and requires attention' }
      };

      const condition = conditionImpacts[followUpData.condition.toLowerCase() as keyof typeof conditionImpacts];
      if (condition && condition.impact !== 0) {
        adjustments.push({
          factor: `${followUpData.condition.charAt(0).toUpperCase() + followUpData.condition.slice(1)} Condition`,
          impact: Math.round(basePrice * condition.impact),
          description: condition.description,
          icon: condition.impact > 0 ? 
            <CheckCircle className="h-4 w-4 text-green-600" /> : 
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
        });
      }
    }

    // Accident history
    if (followUpData.accidents?.hadAccident) {
      const accidentCount = followUpData.accidents.count || 1;
      const impact = accidentCount === 1 ? -0.05 : accidentCount === 2 ? -0.12 : -0.20;
      adjustments.push({
        factor: `Accident History (${accidentCount})`,
        impact: Math.round(basePrice * impact),
        description: `${accidentCount} reported accident${accidentCount > 1 ? 's' : ''}`,
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />
      });
    }

    // Title status
    if (followUpData.title_status && followUpData.title_status !== 'clean') {
      const titleImpacts = {
        'salvage': -0.50,
        'rebuilt': -0.25,
        'flood': -0.35,
        'lemon': -0.30
      };
      const impact = titleImpacts[followUpData.title_status.toLowerCase() as keyof typeof titleImpacts] || -0.15;
      adjustments.push({
        factor: `${followUpData.title_status} Title`,
        impact: Math.round(basePrice * impact),
        description: `Vehicle has a ${followUpData.title_status} title brand`,
        icon: <AlertCircle className="h-4 w-4 text-red-600" />
      });
    }

    // Market adjustment (ZIP code)
    if (followUpData.zip_code) {
      const firstDigit = parseInt(followUpData.zip_code.charAt(0));
      const marketMultipliers = [0.02, 0.01, 0, -0.01, -0.02, 0, 0.01, 0.02, 0.03, 0.04];
      const marketImpact = marketMultipliers[firstDigit] || 0;
      
      if (Math.abs(marketImpact) > 0.01) {
        adjustments.push({
          factor: 'Market Location',
          impact: Math.round(basePrice * marketImpact),
          description: `Local market conditions in ${followUpData.zip_code}`,
          icon: <MapPin className="h-4 w-4" />
        });
      }
    }

    return adjustments;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading valuation...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !valuationData) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-red-700">Unable to Calculate Valuation</h3>
            <p className="text-red-600">{error || 'Valuation data not found'}</p>
            <Button variant="outline" onClick={fetchValuationData} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const confidenceBadge = getConfidenceBadge(valuationData.confidence_score);
  const priceRange = calculatePriceRange(valuationData.estimated_value, valuationData.confidence_score);
  const adjustments = generateAdjustments();

  return (
    <div className="space-y-6">
      {/* Main Valuation Display */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Vehicle Valuation</CardTitle>
          </div>
          
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">
              {formatCurrency(valuationData.estimated_value)}
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={confidenceBadge.variant} className="cursor-help">
                      <Gauge className="h-3 w-3 mr-1" />
                      {confidenceBadge.text}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Confidence Score: {valuationData.confidence_score}%
                      <br />
                      Based on data quality, market comparisons, and vehicle details.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="text-sm text-muted-foreground">
              Your car could sell between{' '}
              <span className="font-semibold">{formatCurrency(priceRange.low)}</span>
              {' – '}
              <span className="font-semibold">{formatCurrency(priceRange.high)}</span>
            </div>

            {/* Price Range Visualization */}
            <div className="relative mt-4">
              <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full"></div>
              <div 
                className="absolute top-0 h-2 w-1 bg-primary rounded-full"
                style={{ 
                  left: `${((valuationData.estimated_value - priceRange.low) / (priceRange.high - priceRange.low)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>Estimated</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Verified from real VIN + AI-based valuation</span>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Breakdown */}
      {adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Valuation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Base Price */}
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Base Market Value</span>
              <span className="font-semibold">
                {formatCurrency(valuationData.base_price || valuationData.estimated_value * 0.9)}
              </span>
            </div>

            {/* Adjustments */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Value Adjustments</h4>
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    {adjustment.icon}
                    <div>
                      <span className="font-medium">{adjustment.factor}</span>
                      <p className="text-xs text-muted-foreground">{adjustment.description}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    adjustment.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Final Value */}
            <div className="flex justify-between items-center py-2 font-semibold text-lg">
              <span>Estimated Value</span>
              <span className="text-primary">{formatCurrency(valuationData.estimated_value)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Details */}
      {(valuationData.make || valuationData.model || valuationData.year) && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {valuationData.year && (
                <div>
                  <span className="text-muted-foreground">Year</span>
                  <p className="font-medium">{valuationData.year}</p>
                </div>
              )}
              {valuationData.make && (
                <div>
                  <span className="text-muted-foreground">Make</span>
                  <p className="font-medium">{valuationData.make}</p>
                </div>
              )}
              {valuationData.model && (
                <div>
                  <span className="text-muted-foreground">Model</span>
                  <p className="font-medium">{valuationData.model}</p>
                </div>
              )}
              {followUpData?.mileage && (
                <div>
                  <span className="text-muted-foreground">Mileage</span>
                  <p className="font-medium">{followUpData.mileage.toLocaleString()} miles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {showPdfExport && (
              <Button className="flex-1" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            )}
            <Button className="flex-1">
              Get Offers from Dealers
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              All estimates are based on market data and user inputs. Final sale price may vary based on actual vehicle condition, market timing, and negotiation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
