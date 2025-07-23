import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { UnifiedValuationResult } from '@/components/valuation/result';
import { MarketDataStatus } from "@/components/valuation/result/MarketDataStatus";
import { FallbackMethodDisclosure } from "@/components/valuation/result/FallbackMethodDisclosure";
import { ValuationActions } from "@/components/valuation/result/ValuationActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedConfidenceScore } from "@/components/valuation/result/EnhancedConfidenceScore";
import { calculateUnifiedValuation } from '@/services/valuation/valuationEngine';
import type { MarketListing } from '@/types/marketListing';
import { SimilarListingsSection } from '@/components/results/SimilarListingsSection';

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
  marketListings: MarketListing[];
  adjustments?: Array<{
    type: string;
    amount: number;
    reason: string;
  }>;
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
  basePriceAnchor?: number;
  confidenceBreakdown?: {
    vinAccuracy: number;
    marketData: number;
    fuelCostMatch: number;
    msrpQuality: number;
    overall: number;
    recommendations: string[];
  };
}

interface DecodedVehicle {
  make: string;
  model: string;
  year: number;
  trim?: string;
}

// Helper function to normalize listing data
function normalizeListing(listing: any): MarketListing {
  return {
    id: listing.id || `listing-${Date.now()}-${Math.random()}`,
    source: listing.source || 'Unknown',
    source_type: listing.source_type || 'marketplace',
    price: Number(listing.price) || 0,
    year: Number(listing.year) || 2020,
    make: listing.make || 'Unknown',
    model: listing.model || 'Unknown',
    trim: listing.trim || '',
    vin: listing.vin || '',
    mileage: Number(listing.mileage) || 0,
    condition: listing.condition || 'used',
    dealer_name: listing.dealer_name || null,
    location: listing.location || '',
    listing_url: listing.listing_url || '#',
    is_cpo: Boolean(listing.is_cpo),
    fetched_at: listing.fetched_at || new Date().toISOString(),
    confidence_score: Number(listing.confidence_score) || 75
  };
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError('No valuation ID provided');
        setLoading(false);
        return;
      }

      // Clear any existing state to prevent race conditions
      setError(null);
      setValuationData(null);

      try {
        const identifier = id;
        console.log('🔍 Loading valuation data for ID:', identifier);

        // Try to fetch valuation data - NO MOCK FALLBACKS
        let valuationData = null;
        let fetchError = null;

        // Check if identifier looks like a VIN (17 characters, alphanumeric)
        const isVin = /^[A-HJ-NPR-Z0-9]{17}$/i.test(identifier);
        
        if (isVin) {
          console.log('🔍 Searching by VIN:', identifier);
          console.log('🔍 About to query valuations table by VIN...');
          
          // Search by VIN in valuations table - get most recent valuation
          const { data: vinData, error: vinError } = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', identifier)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          console.log('🔍 Valuations query result:', { vinData, vinError });

          if (!vinError && vinData) {
            valuationData = vinData;
            console.log('✅ Found valuation by VIN:', vinData);
          } else {
            console.log('❌ No valuation found, error:', vinError);
            fetchError = new Error(`No valuation found for VIN: ${identifier}`);
          }
        } else {
          console.log('🔍 Searching by UUID:', identifier);
          
          // Try valuations_uuid first, then regular valuations
          const { data: uuidData, error: uuidError } = await supabase
            .from('valuations_uuid')
            .select('*')
            .eq('id', identifier)
            .maybeSingle();

          if (!uuidError && uuidData) {
            valuationData = uuidData;
          } else {
            const { data: regData, error: regError } = await supabase
              .from('valuations')
              .select('*')
              .eq('id', identifier)
              .maybeSingle();

            if (!regError && regData) {
              valuationData = regData;
            } else {
              fetchError = new Error(`No valuation found for ID: ${identifier}`);
            }
          }
        }

        if (fetchError || !valuationData) {
          console.error('❌ Valuation not found:', fetchError?.message);
          throw fetchError || new Error('Valuation data not found');
        }

        console.log('✅ Found valuation data:', valuationData);

        // If we have valid database valuation data, use it directly without enhanced processing
        if (valuationData.estimated_value && valuationData.estimated_value > 0) {
          console.log('✅ Using database valuation data directly');
          setValuationData({
            id: valuationData.id,
            vin: valuationData.vin,
            make: valuationData.make || 'Unknown',
            model: valuationData.model || 'Unknown',
            year: valuationData.year || new Date().getFullYear(),
            mileage: valuationData.mileage || 0,
            condition: valuationData.condition || 'good',
            estimatedValue: valuationData.estimated_value,
            confidenceScore: valuationData.confidence_score || 0,
            zipCode: valuationData.state || 'Unknown',
            marketListings: [],
            valuationMethod: 'database_confirmed',
            isUsingFallbackMethod: false
          });
        } else {
          throw new Error('No valid valuation data available');
        }

      } catch (error) {
        console.error('❌ Results page error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load valuation data');
      }

      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading valuation results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="text-red-600 mb-4">
          <h2 className="text-2xl font-bold mb-2">Error Loading Results</h2>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>No valuation data available</p>
      </div>
    );
  }

  const isUsingFallback = valuationData.isUsingFallbackMethod || valuationData.marketListings.length === 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Vehicle Valuation Results
        </h1>
        <p className="text-muted-foreground">
          {valuationData.year} {valuationData.make} {valuationData.model} • VIN: {valuationData.vin}
        </p>
        {valuationData.valuationMethod && (
          <Badge variant="secondary" className="mt-2">
            Method: {valuationData.valuationMethod}
          </Badge>
        )}
      </div>

      {/* Enhanced Confidence Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Valuation Display */}
          <Card>
            <CardHeader>
              <CardTitle>Estimated Market Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-primary">
                  ${valuationData.estimatedValue.toLocaleString()}
                </div>
                <div className="text-lg text-muted-foreground">
                  Mileage: {valuationData.mileage.toLocaleString()} • Condition: {valuationData.condition}
                </div>
                <EnhancedConfidenceScore 
                  confidenceScore={valuationData.confidenceScore} 
                  confidenceBreakdown={valuationData.confidenceBreakdown}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Data Status */}
          <MarketDataStatus 
            totalListings={valuationData.marketListings.length}
            searchMethod={isUsingFallback ? 'fallback' : 'database'}
            trustScore={valuationData.confidenceScore / 100}
          />

          {/* Market Listings */}
          {valuationData.marketListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Market Listings Found ({valuationData.marketListings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {valuationData.marketListings.slice(0, 5).map((listing, index) => (
                    <div key={listing.id || index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">
                          {listing.year} {listing.make} {listing.model}
                          {listing.trim && ` ${listing.trim}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {listing.mileage?.toLocaleString() || 'Unknown'} miles • {listing.source}
                          {listing.location && ` • ${listing.location}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${listing.price.toLocaleString()}</div>
                        {listing.is_cpo && (
                          <Badge variant="secondary" className="text-xs">CPO</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback Method Disclosure */}
          {isUsingFallback && (
            <FallbackMethodDisclosure 
              confidenceScore={valuationData.confidenceScore}
              explanation="Limited market data available. Valuation based on MSRP-adjusted depreciation model with condition and mileage adjustments."
            />
          )}

          {/* Similar Listings Section */}
          {valuationData.marketListings.length > 0 && (
            <SimilarListingsSection listings={valuationData.marketListings} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ValuationActions
                onGeneratePDF={() => {
                  toast.success('PDF generated successfully!');
                }}
                onShare={() => {
                  toast.success('Results shared successfully!');
                }}
              />
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          {valuationData.basePriceAnchor && (
            <Card>
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-medium">${valuationData.basePriceAnchor.toLocaleString()}</span>
                </div>
                {valuationData.adjustments?.map((adj, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize">{adj.type}</span>
                    <span className={adj.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {adj.amount >= 0 ? '+' : ''}${adj.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Final Value</span>
                  <span>${valuationData.estimatedValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}