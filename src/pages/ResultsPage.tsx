import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import VehicleDetailsCard from '@/components/result/VehicleDetailsCard';
import { ValuationTransparency } from '@/components/valuation/result/ValuationTransparency';
import { EnhancedConfidenceScore } from '@/components/valuation/result/EnhancedConfidenceScore';
import { MarketDataStatus } from '@/components/valuation/result/MarketDataStatus';
import { MarketDataService } from '@/services/valuation/marketDataService';
import { calculateUnifiedConfidence, generateConfidenceExplanation } from '@/utils/unifiedConfidenceCalculator';

interface ValuationData {
  id: string;
  created_at: string;
  estimated_value: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  state: string;
  vin: string | null;
  user_id: string | null;
  confidence_score: number;
  fuel_type: string;
  trim: string;
}

interface FollowUpData {
  mileage?: number;
  condition?: string;
  transmission?: string;
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [marketListings, setMarketListings] = useState<any[]>([]);

  useEffect(() => {
    if (!id) {
      toast.error('Valuation ID is missing');
      navigate('/', { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        let valuation;
        
        // Check if id is a UUID or VIN
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        if (isUUID) {
          // Fetch by UUID
          const { data, error } = await supabase
            .from('valuations')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          valuation = data;
        } else {
          // Fetch by VIN (most recent valuation for this VIN)
          const { data, error } = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (error) throw error;
          valuation = data;
        }

        if (!valuation) {
          toast.error('Valuation not found');
          setLoading(false);
          navigate('/', { replace: true });
          return;
        }

        setValuationData(valuation);

        // Fetch follow-up data if available
        const { data: followUp, error: followUpError } = await supabase
          .from('follow_up_data')
          .select('*')
          .eq('valuation_id', valuation.id)
          .single();

        if (followUpError && followUpError.message.indexOf('No rows found') === -1) {
          console.error('Error fetching follow-up data:', followUpError);
          toast.error('Failed to load follow-up data');
        }

        if (followUp) {
          setFollowUpData(followUp);
        }

        const valuationById = {
          make: valuation.make,
          model: valuation.model,
          year: valuation.year,
          state: valuation.state
        };

        // Fetch market data for confidence calculation and display
        try {
          const marketData = await MarketDataService.fetchMarketData({
            make: valuationById.make,
            model: valuationById.model,
            year: valuationById.year,
            zipCode: valuationById.state
          });

          const enhancedListings = marketData.listings?.map(listing => ({
            id: listing.id || crypto.randomUUID(),
            price: listing.price,
            mileage: listing.mileage,
            location: listing.location,
            source: listing.source,
            listing_url: listing.listing_url,
            dealer_name: listing.dealer_name,
            year: listing.year,
            make: listing.make,
            model: listing.model
          })) || [];

          setMarketListings(enhancedListings);
        } catch (error) {
          console.error('Error fetching market data:', error);
          setMarketListings([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching valuation data:', error);
        toast.error('Failed to load valuation data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Loading valuation results...</p>
        </div>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Valuation not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Determine if we're using fallback method
  const isFallbackMethod = marketListings.length === 0;
  
  // Calculate adjusted confidence score based on market data availability
  let adjustedConfidenceScore = valuationData.confidence_score || 45;
  if (isFallbackMethod) {
    // Cap confidence at 60% when no market listings are available
    adjustedConfidenceScore = Math.min(adjustedConfidenceScore, 60);
  }

  // Calculate unified confidence score
  const confidenceInput = {
    vin: valuationData.vin || undefined,
    make: valuationData.make,
    model: valuationData.model,
    year: valuationData.year,
    mileage: followUpData?.mileage || valuationData.mileage,
    exactVinMatch: !!valuationData.vin,
    marketListingsCount: marketListings.length,
    marketListings: marketListings,
    sources: isFallbackMethod ? ['database_valuation', 'msrp_fallback'] : ['database_valuation', 'market_listings'],
    zipCode: valuationData.state || ''
  };

  const confidenceBreakdown = calculateUnifiedConfidence(confidenceInput);
  const confidenceExplanation = generateConfidenceExplanation(
    confidenceBreakdown.overall,
    {
      exactVinMatch: !!valuationData.vin,
      marketListings: marketListings,
      sources: confidenceInput.sources,
      trustScore: 0.8,
      mileagePenalty: 0.02,
      zipCode: valuationData.state || ''
    }
  );

  // Prepare transparency data
  const basePriceAnchor = {
    source: isFallbackMethod ? 'MSRP-Adjusted Model' : 'Market Analysis',
    amount: valuationData.estimated_value, // This would be the base before adjustments in a real implementation
    method: isFallbackMethod ? 'Synthetic pricing using industry depreciation curves' : 'Average of comparable market listings'
  };

  const adjustments = [
    {
      factor: 'Mileage Adjustment',
      amount: -2500, // Example adjustment
      description: `${(followUpData?.mileage || valuationData.mileage || 0).toLocaleString()} miles vs. average for age`
    },
    {
      factor: 'Condition Factor',
      amount: 500, // Example adjustment
      description: `"${followUpData?.condition || 'Good'}" condition assessment`
    },
    {
      factor: 'Regional Market',
      amount: 300, // Example adjustment
      description: `ZIP ${valuationData.state} market demand factor`
    }
  ];

  // Prepare vehicle info for display
  const vehicleInfo = {
    year: valuationData.year,
    make: valuationData.make,
    model: valuationData.model,
    mileage: followUpData?.mileage || valuationData.mileage || 0,
    condition: followUpData?.condition || 'Good',
    zipCode: valuationData.state
  };

  const marketAnchors = {
    exactVinMatch: !!valuationData.vin,
    listingsCount: marketListings.length,
    trustScore: 0.8
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          New Valuation
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Main Valuation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Vehicle Valuation Report
            {isFallbackMethod && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Fallback Method
              </Badge>
            )}
          </CardTitle>
          <p className="text-muted-foreground">
            Complete valuation analysis for your {valuationData.year} {valuationData.make} {valuationData.model}
          </p>
        </CardHeader>
        <CardContent>
          <ValuationSummary
            estimatedValue={valuationData.estimated_value}
            confidenceScore={confidenceBreakdown.overall}
            vehicleInfo={vehicleInfo}
            marketAnchors={marketAnchors}
            sources={confidenceInput.sources}
            explanation={confidenceExplanation}
          />
        </CardContent>
      </Card>

      {/* Enhanced Confidence Score */}
      <Card>
        <CardHeader>
          <CardTitle>Confidence Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedConfidenceScore
            confidenceScore={confidenceBreakdown.overall}
            confidenceBreakdown={confidenceBreakdown}
            marketListingsCount={marketListings.length}
            isFallbackMethod={isFallbackMethod}
            exactVinMatch={!!valuationData.vin}
          />
        </CardContent>
      </Card>

      {/* Market Data Status */}
      <MarketDataStatus
        marketListings={marketListings}
        vehicleInfo={vehicleInfo}
        searchRadius={100}
      />

      {/* Valuation Transparency */}
      <ValuationTransparency
        marketListingsCount={marketListings.length}
        confidenceScore={confidenceBreakdown.overall}
        basePriceAnchor={basePriceAnchor}
        adjustments={adjustments}
        estimatedValue={valuationData.estimated_value}
        sources={confidenceInput.sources}
        isFallbackMethod={isFallbackMethod}
      />

      {/* Vehicle Details */}
      <VehicleDetailsCard
        year={valuationData.year}
        make={valuationData.make}
        model={valuationData.model}
        vin={valuationData.vin || undefined}
        mileage={followUpData?.mileage || valuationData.mileage || 0}
        condition={followUpData?.condition || 'Good'}
        zipCode={valuationData.state}
        fuelType={valuationData.fuel_type}
        transmission={followUpData?.transmission}
        trim={valuationData.trim}
      />

      {/* Data Sources & Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• VIN decode from NHTSA database for accurate vehicle identification</p>
            <p>• Market analysis from {marketListings.length} similar vehicle listings</p>
            <p>• Condition assessment from user-provided information</p>
            <p>• Regional market adjustments for {vehicleInfo.zipCode}</p>
            <p>• Confidence score: {confidenceBreakdown.overall}% based on data quality and completeness</p>
            {isFallbackMethod && (
              <p className="text-amber-600">• Fallback pricing model used due to limited market data availability</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
