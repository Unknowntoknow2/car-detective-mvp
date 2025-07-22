
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Car, DollarSign, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/formatters';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import VehicleDetailsCard from '@/components/result/VehicleDetailsCard';
import { fetchMarketData } from '@/services/valuation/marketDataService';
import { generateUnifiedConfidence } from '@/utils/unifiedConfidenceCalculator';

interface ValuationData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimated_value: number;
  confidence_score: number;
  vin: string;
  state: string;
  color?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  trim?: string;
  user_id?: string;
  created_at: string;
}

interface DecodedVehicle {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  fueltype?: string;
  transmission?: string;
}

interface FollowUpData {
  mileage?: number;
  condition?: string;
  features?: any[];
  accidents?: any;
  modifications?: any;
  serviceHistory?: any;
}

export default function ResultsPage() {
  const { id: vinOrId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [decodedVehicle, setDecodedVehicle] = useState<DecodedVehicle | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [marketListings, setMarketListings] = useState<any[]>([]);

  useEffect(() => {
    if (vinOrId) {
      fetchActualVehicleData(vinOrId);
    }
  }, [vinOrId]);

  const fetchActualVehicleData = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching valuation data for identifier:', identifier);

      // First, try to fetch by valuation ID
      let { data: valuationById, error: valuationByIdError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', identifier)
        .single();

      // If not found by ID, try by VIN
      if (valuationByIdError || !valuationById) {
        console.log('📍 Not found by ID, trying VIN lookup...');
        const { data: valuationByVin, error: valuationByVinError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', identifier)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (valuationByVinError || !valuationByVin) {
          console.error('❌ No valuation found for VIN or ID:', identifier);
          throw new Error('No valuation found for this vehicle');
        }

        valuationById = valuationByVin;
      }

      console.log('✅ Found valuation data:', valuationById);
      setValuationData(valuationById);

      // Fetch decoded vehicle data
      if (valuationById.vin) {
        const { data: decodedData, error: decodedError } = await supabase
          .from('decoded_vehicles')
          .select('*')
          .eq('vin', valuationById.vin)
          .single();

        if (!decodedError && decodedData) {
          console.log('✅ Found decoded vehicle data:', decodedData);
          setDecodedVehicle(decodedData);
        }

        // Fetch follow-up answers
        const { data: followUpAnswers, error: followUpError } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', valuationById.vin)
          .single();

        if (!followUpError && followUpAnswers) {
          console.log('✅ Found follow-up data:', followUpAnswers);
          setFollowUpData(followUpAnswers);
        }

        // Fetch market data for confidence calculation and display
        try {
          const marketData = await fetchMarketData({
            make: valuationById.make,
            model: valuationById.model,
            year: valuationById.year,
            vin: valuationById.vin,
            zipCode: valuationById.state || '95821'
          });
          
          console.log('✅ Market data fetched:', marketData);
          setMarketListings(marketData.listings || []);
        } catch (marketError) {
          console.warn('⚠️ Market data fetch failed:', marketError);
          setMarketListings([]);
        }
      }

    } catch (err) {
      console.error('❌ Error fetching vehicle data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading valuation results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !valuationData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'No valuation data found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate unified confidence score
  const confidenceInput = {
    exactVinMatch: !!valuationData.vin,
    marketListings: marketListings,
    sources: ['database_valuation'],
    trustScore: 0.8,
    mileagePenalty: 0.02,
    zipCode: valuationData.state || ''
  };

  const confidenceResult = generateUnifiedConfidence(
    valuationData.confidence_score || 45,
    confidenceInput
  );

  // Prepare vehicle info for display
  const vehicleInfo = {
    year: valuationData.year,
    make: valuationData.make,
    model: valuationData.model,
    mileage: followUpData?.mileage || valuationData.mileage,
    condition: followUpData?.condition || valuationData.condition || 'Good',
    vin: valuationData.vin,
    trim: decodedVehicle?.trim || valuationData.trim,
    bodyType: decodedVehicle?.bodyType || valuationData.body_type,
    fuelType: decodedVehicle?.fueltype || valuationData.fuel_type,
    transmission: decodedVehicle?.transmission || valuationData.transmission,
    color: valuationData.color,
    zipCode: valuationData.state
  };

  const marketAnchors = {
    exactVinMatch: !!valuationData.vin,
    listingsCount: marketListings.length,
    trustScore: confidenceInput.trustScore
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Valuation Report</h1>
        <p className="text-muted-foreground">
          Complete valuation analysis for your {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
        </p>
      </div>

      {/* Main Valuation Summary */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Valuation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ValuationSummary
            estimatedValue={valuationData.estimated_value}
            confidenceScore={confidenceResult.score}
            vehicleInfo={vehicleInfo}
            marketAnchors={marketAnchors}
            sources={confidenceInput.sources}
            explanation={confidenceResult.explanation}
          />
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <VehicleDetailsCard
        make={vehicleInfo.make}
        model={vehicleInfo.model}
        year={vehicleInfo.year}
        mileage={vehicleInfo.mileage}
        condition={vehicleInfo.condition}
        vin={vehicleInfo.vin}
        trim={vehicleInfo.trim}
        bodyType={vehicleInfo.bodyType}
        fuelType={vehicleInfo.fuelType}
        color={vehicleInfo.color}
        transmission={vehicleInfo.transmission}
        zipCode={vehicleInfo.zipCode}
      />

      {/* Market Analysis */}
      {marketListings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Similar Listings Found</span>
                <Badge variant="secondary">{marketListings.length} listings</Badge>
              </div>
              
              {marketListings.slice(0, 3).map((listing, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{listing.title || `${listing.year} ${listing.make} ${listing.model}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.mileage ? `${listing.mileage.toLocaleString()} miles` : 'Mileage not specified'} • {listing.source}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(listing.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Features */}
      {followUpData?.features && followUpData.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {followUpData.features.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Vehicle data from NHTSA VIN decoder and manufacturer specifications</p>
            <p>• Market analysis from {marketListings.length} similar vehicle listings</p>
            <p>• Condition assessment from user-provided information</p>
            <p>• Regional market adjustments for {vehicleInfo.zipCode}</p>
            <p>• Confidence score: {confidenceResult.score}% based on data quality and completeness</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
