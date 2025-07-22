import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { ValuationTransparency } from '@/components/valuation/result/ValuationTransparency';
import { MarketDataStatus } from '@/components/valuation/result/MarketDataStatus';
import { GoogleStyleListings } from '@/components/market/GoogleStyleListings';
import { calculateEnhancedValuation } from '@/services/enhancedValuationEngine';
import { EnhancedValuationResult } from '@/types/valuation';
import { FallbackMethodDisclosure } from '@/components/valuation/result/FallbackMethodDisclosure';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [valuation, setValuation] = useState<any>(null);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedValuationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No valuation ID provided');
      setLoading(false);
      return;
    }
    fetchValuation();
  }, [id]);

  const fetchValuation = async () => {
    try {
      console.log('🔍 Fetching valuation with ID:', id);
      
      // Fetch the original valuation
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', id)
        .single();

      if (valuationError) {
        console.error('❌ Error fetching valuation:', valuationError);
        setError('Valuation not found');
        return;
      }

      console.log('✅ Valuation found:', valuationData);
      setValuation(valuationData);

      // Run enhanced valuation calculation
      const enhancedInput = {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        zipCode: valuationData.state, // Using state as zipCode for now
        vin: valuationData.vin,
        condition: 'good' // Default condition
      };

      console.log('🚀 Running enhanced valuation with input:', enhancedInput);
      const enhancedResults = await calculateEnhancedValuation(enhancedInput);
      console.log('✅ Enhanced valuation complete:', enhancedResults);
      
      setEnhancedResult(enhancedResults);
      
    } catch (err) {
      console.error('❌ Error in fetchValuation:', err);
      setError('Failed to load valuation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!valuation || !enhancedResult) return;
    
    try {
      // PDF generation functionality will be implemented later
      toast.success('PDF download feature coming soon');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !valuation || !enhancedResult) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || 'Valuation not found'}
        </h1>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const vehicleInfo = {
    year: valuation.year,
    make: valuation.make,
    model: valuation.model,
    mileage: valuation.mileage,
    condition: 'good' // Default for now
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        
        <div className="flex gap-2">
          <Button onClick={handleDownloadPdf} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* CRITICAL: Fallback Method Disclosure - Must be prominent */}
      <FallbackMethodDisclosure
        isFallbackMethod={enhancedResult.isFallbackMethod || false}
        confidenceScore={enhancedResult.confidenceScore}
        marketListingsCount={enhancedResult.marketListings?.length || 0}
        estimatedValue={enhancedResult.estimatedValue}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Valuation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <ValuationSummary
                estimatedValue={enhancedResult.estimatedValue}
                confidenceScore={enhancedResult.confidenceScore}
                vehicleInfo={vehicleInfo}
                sources={enhancedResult.sources || []}
                explanation={enhancedResult.explanation}
                zipCode={enhancedResult.zipCode || valuation.state}
                marketAnchors={{
                  exactVinMatch: false,
                  listingsCount: enhancedResult.marketListings?.length || 0,
                  trustScore: (enhancedResult.isFallbackMethod || false) ? 0.3 : 0.8
                }}
              />
            </CardContent>
          </Card>

          {/* Market Data Status */}
          <MarketDataStatus
            marketListings={enhancedResult.marketListings || []}
            confidenceScore={enhancedResult.confidenceScore}
            zipCode={enhancedResult.zipCode || valuation.state}
          />

          {/* Market Listings Display - Only show if we have real data */}
          {enhancedResult.marketListings && enhancedResult.marketListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Market Listings ({enhancedResult.marketListings.length})
                  <Badge className="ml-2 text-xs">Live Data</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleStyleListings
                  listings={enhancedResult.marketListings}
                  vehicleInfo={{
                    year: vehicleInfo.year,
                    make: vehicleInfo.make,
                    model: vehicleInfo.model,
                    zipCode: enhancedResult.zipCode || valuation.state
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Transparency & Details */}
        <div className="space-y-6">
          {/* Valuation Transparency */}
          <ValuationTransparency
            marketListingsCount={enhancedResult.marketListings?.length || 0}
            confidenceScore={enhancedResult.confidenceScore}
            basePriceAnchor={typeof enhancedResult.basePriceAnchor === 'number' ? {
              source: 'market_median',
              amount: enhancedResult.basePriceAnchor,
              method: 'statistical_analysis'
            } : enhancedResult.basePriceAnchor}
            adjustments={[]}
            estimatedValue={enhancedResult.estimatedValue}
            sources={enhancedResult.sources || []}
            isFallbackMethod={enhancedResult.isFallbackMethod || false}
            zipCode={enhancedResult.zipCode || valuation.state}
            vin={enhancedResult.vin || valuation.vin}
          />

          {/* Market Intelligence - Only show with real data */}
          {enhancedResult.marketIntelligence && enhancedResult.marketIntelligence.medianPrice > 0 && !(enhancedResult.isFallbackMethod || false) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Market Intelligence</CardTitle>
                <Badge variant="outline" className="text-xs">
                  Market Data Available
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Market Median</p>
                    <p className="font-medium">${enhancedResult.marketIntelligence.medianPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="font-medium">{Math.round(enhancedResult.marketIntelligence.confidence)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
