import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ValuationSummary } from '@/components/valuation/result/ValuationSummary';
import { MarketDataStatus } from '@/components/valuation/result/MarketDataStatus';
import { FallbackMethodDisclosure } from '@/components/valuation/result/FallbackMethodDisclosure';
import { ValuationActions } from '@/components/valuation/result/ValuationActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedConfidenceScore } from '@/components/valuation/result/EnhancedConfidenceScore';
import { toast } from 'sonner';
import { calculateEnhancedValuation } from '@/services/valuation/enhancedValuationEngine';

interface ValuationData {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  zipCode: string;
  marketListings: any[];
  adjustments: any[];
  valuationMethod: string;
  isUsingFallbackMethod: boolean;
  basePriceAnchor: number;
  confidenceBreakdown?: any;
}

const ResultsPage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeListing = (listing: any) => ({
    id: listing.id,
    source: listing.source,
    source_type: listing.source_type,
    price: listing.price,
    year: listing.year,
    make: listing.make,
    model: listing.model,
    trim: listing.trim,
    vin: listing.vin,
    mileage: listing.mileage,
    condition: listing.condition,
    dealer_name: listing.dealer_name,
    location: listing.location,
    listing_url: listing.listing_url,
    is_cpo: listing.is_cpo,
    fetched_at: listing.fetched_at,
    confidence_score: listing.confidence_score
  });

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!identifier) {
        setError('No identifier provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if identifier is a UUID or VIN
        const isUUID = identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        
        if (isUUID) {
          // UUID-based lookup
          const { data: uuidValuation, error: uuidError } = await supabase
            .from('valuations')
            .select('*')
            .eq('id', identifier)
            .maybeSingle();

          if (uuidError) {
            console.error('Error fetching UUID valuation:', uuidError);
            throw new Error('Failed to fetch valuation data');
          }

          if (!uuidValuation) {
            throw new Error('Valuation not found');
          }

          // For UUID lookups, re-run enhanced valuation if we have vehicle data
          if (uuidValuation.vin) {
            console.log('🔄 UUID valuation found, re-running enhanced engine for:', uuidValuation.vin);
            
            const { data: decodedVehicle } = await supabase
              .from('decoded_vehicles')
              .select('*')
              .eq('vin', uuidValuation.vin)
              .maybeSingle();

            if (decodedVehicle) {
              const enhancedResult = await calculateEnhancedValuation({
                vin: uuidValuation.vin,
                make: decodedVehicle.make || 'Unknown',
                model: decodedVehicle.model || 'Unknown',
                year: decodedVehicle.year || new Date().getFullYear(),
                mileage: uuidValuation.mileage || 50000,
                condition: uuidValuation.condition || 'good',
                zipCode: uuidValuation.zip_code || '90210'
              });

              const normalizedListings = enhancedResult.marketListings.map(normalizeListing);
              
              valuationData = {
                id: uuidValuation.id,
                vin: uuidValuation.vin,
                make: decodedVehicle.make || 'Unknown',
                model: decodedVehicle.model || 'Unknown',
                year: decodedVehicle.year || new Date().getFullYear(),
                mileage: enhancedResult.mileage,
                condition: enhancedResult.condition,
                estimatedValue: enhancedResult.estimatedValue,
                confidenceScore: enhancedResult.confidenceScore,
                zipCode: enhancedResult.zipCode,
                marketListings: normalizedListings,
                adjustments: enhancedResult.adjustments,
                valuationMethod: 'enhanced_fresh',
                isUsingFallbackMethod: enhancedResult.isUsingFallbackMethod,
                basePriceAnchor: enhancedResult.basePriceAnchor,
                confidenceBreakdown: enhancedResult.confidenceBreakdown
              };
            } else {
              // Fallback to basic UUID data
              valuationData = {
                id: uuidValuation.id,
                vin: uuidValuation.vin,
                make: uuidValuation.make || 'Unknown',
                model: uuidValuation.model || 'Unknown',
                year: uuidValuation.year || new Date().getFullYear(),
                mileage: uuidValuation.mileage || 0,
                condition: uuidValuation.condition || 'good',
                estimatedValue: uuidValuation.estimated_value || 0,
                confidenceScore: uuidValuation.confidence_score || 0,
                zipCode: uuidValuation.zip_code || uuidValuation.state,
                marketListings: [],
                adjustments: uuidValuation.adjustments || [],
                valuationMethod: 'database',
                isUsingFallbackMethod: uuidValuation.confidence_score <= 60
              };
            }
          }
        } else {
          // VIN-based lookup
          console.log('🔍 VIN-based lookup for:', identifier);
          
          // Get vehicle info from decoded_vehicles table
          const { data: decodedVehicle } = await supabase
            .from('decoded_vehicles')
            .select('*')
            .eq('vin', identifier)
            .maybeSingle();

          if (!decodedVehicle) {
            throw new Error('Vehicle information not found for this VIN');
          }

          // Check for existing valuation
          const { data: existingValuation } = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', identifier)
            .order('created_at', { ascending: false })
            .maybeSingle();

          console.log('🔧 Running enhanced valuation engine for fresh market data...');
          
          // Always run enhanced valuation for fresh market data
          const enhancedResult = await calculateEnhancedValuation({
            vin: identifier,
            make: decodedVehicle.make || 'Unknown',
            model: decodedVehicle.model || 'Unknown',
            year: decodedVehicle.year || new Date().getFullYear(),
            mileage: existingValuation?.mileage || 50000,
            condition: existingValuation?.condition || 'good',
            zipCode: existingValuation?.zip_code || '90210'
          });

          console.log('🎯 Enhanced valuation result:', {
            estimatedValue: enhancedResult.estimatedValue,
            confidenceScore: enhancedResult.confidenceScore,
            marketListings: enhancedResult.marketListings.length,
            isUsingFallbackMethod: enhancedResult.isUsingFallbackMethod
          });

          const normalizedListings = enhancedResult.marketListings.map(normalizeListing);
          
          valuationData = {
            id: existingValuation?.id || crypto.randomUUID(),
            vin: identifier,
            make: decodedVehicle.make || 'Unknown',
            model: decodedVehicle.model || 'Unknown',
            year: decodedVehicle.year || new Date().getFullYear(),
            mileage: enhancedResult.mileage,
            condition: enhancedResult.condition,
            estimatedValue: enhancedResult.estimatedValue,
            confidenceScore: enhancedResult.confidenceScore,
            zipCode: enhancedResult.zipCode,
            marketListings: normalizedListings,
            adjustments: enhancedResult.adjustments,
            valuationMethod: 'enhanced_fresh',
            isUsingFallbackMethod: enhancedResult.isUsingFallbackMethod,
            basePriceAnchor: enhancedResult.basePriceAnchor,
            confidenceBreakdown: enhancedResult.confidenceBreakdown
          };
        }

        setValuationData(valuationData);
        console.log('✅ Final valuation data set:', valuationData);
        
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation data');
      } finally {
        setLoading(false);
      }
    };

    fetchValuationData();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading valuation data...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No valuation data found</h2>
          <p className="text-gray-600">Please try again or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Valuation Results
            </h1>
            <p className="text-gray-600">
              {valuationData.year} {valuationData.make} {valuationData.model}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Valuation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Valuation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ValuationSummary
                    estimatedValue={valuationData.estimatedValue}
                    confidenceScore={valuationData.confidenceScore}
                    vehicleInfo={{
                      year: valuationData.year,
                      make: valuationData.make,
                      model: valuationData.model,
                      mileage: valuationData.mileage,
                      condition: valuationData.condition,
                    }}
                    marketAnchors={{
                      exactVinMatch: valuationData.marketListings.some(l => l.vin === valuationData.vin),
                      listingsCount: valuationData.marketListings.length,
                      trustScore: 0.8
                    }}
                    zipCode={valuationData.zipCode}
                  />
                </CardContent>
              </Card>

              {/* Market Data Status */}
              <MarketDataStatus
                marketListings={valuationData.marketListings}
                confidenceScore={valuationData.confidenceScore}
                zipCode={valuationData.zipCode}
              />

              {/* Fallback Method Disclosure */}
              <FallbackMethodDisclosure
                isFallbackMethod={valuationData.isUsingFallbackMethod}
                confidenceScore={valuationData.confidenceScore}
                marketListingsCount={valuationData.marketListings.length}
                estimatedValue={valuationData.estimatedValue}
              />
            </div>

            {/* Right Column - Actions & Details */}
            <div className="space-y-6">
              {/* Valuation Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ValuationActions
                    valuationData={valuationData}
                    onPdfGenerated={() => {
                      toast.success('PDF generated successfully!');
                    }}
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
                    confidenceScore={valuationData.confidenceScore}
                    confidenceBreakdown={valuationData.confidenceBreakdown}
                    marketListingsCount={valuationData.marketListings.length}
                    isFallbackMethod={valuationData.isUsingFallbackMethod}
                    exactVinMatch={valuationData.marketListings.some(l => l.vin === valuationData.vin)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResultsPage;
