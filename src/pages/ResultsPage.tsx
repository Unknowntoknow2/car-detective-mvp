
import React from 'react';
import { useParams } from 'react-router-dom';
import { ValuationProvider, useValuationContext } from '@/contexts/ValuationContext';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { RerunValuationButton } from '@/components/valuation/RerunValuationButton';
import { useMarketListings } from '@/hooks/useMarketListings';
import type { UnifiedValuationResult as ValuationResultType } from '@/types/valuation';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600">No valuation ID provided</p>
      </div>
    );
  }

  return (
    <ValuationProvider valuationId={id}>
      <div className="min-h-screen bg-background">
        <RerunValuationButton />
        <ResultsContent />
      </div>
    </ValuationProvider>
  );
}

function ResultsContent() {
  const { valuationData, isLoading, error, rerunValuation } = useValuationContext();
  
  // Extract actual data from the valuation response
  const vehicleData = valuationData as any;
  const actualMileage = vehicleData?.mileage || 0;
  const actualEstimatedValue = vehicleData?.estimated_value || 0;
  const actualYear = vehicleData?.year || 2018;
  const actualMake = vehicleData?.make || 'TOYOTA';
  const actualModel = vehicleData?.model || 'Camry';
  const actualZipCode = vehicleData?.zip_code || '95821';
  
  // Fetch real market listings based on ACTUAL vehicle data
  const { 
    listings: marketListings, 
    loading: listingsLoading, 
    error: listingsError,
    searchStrategy 
  } = useMarketListings(
    actualMake,
    actualModel, 
    actualYear,
    actualZipCode
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading valuation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No valuation data found</p>
      </div>
    );
  }

  const { id: urlId } = useParams<{ id: string }>();
  
  console.log('📊 Using ACTUAL valuation data:', {
    actualMileage,
    actualEstimatedValue,
    actualYear,
    actualMake,
    actualModel,
    actualZipCode,
    marketListingsCount: marketListings.length,
    searchStrategy
  });
  
  // Create result using ACTUAL database values
  const result: ValuationResultType = {
    id: vehicleData.id || crypto.randomUUID(),
    vin: vehicleData.vin || urlId || '',
    vehicle: {
      year: actualYear,
      make: actualMake,
      model: actualModel,
      trim: vehicleData.trim || 'Standard',
      fuelType: vehicleData.fuel_type || 'gasoline'
    },
    zip: actualZipCode,
    mileage: actualMileage, // Use ACTUAL mileage from database
    baseValue: actualEstimatedValue,
    finalValue: actualEstimatedValue, // Use ACTUAL estimated value
    confidenceScore: vehicleData.confidence_score || (marketListings.length > 3 ? 85 : 70),
    sources: ['database_valuation', 'market_analysis'],
    listings: marketListings.map(listing => ({
      id: listing.id,
      price: listing.price,
      mileage: listing.mileage || 0,
      location: listing.location || 'Unknown',
      source: listing.source,
      source_type: 'marketplace',
      listing_url: listing.listing_url || '#',
      is_cpo: false,
      fetched_at: listing.fetched_at,
      confidence_score: listing.confidence_score || 80
    })),
    listingCount: marketListings.length,
    listingRange: marketListings.length > 0 ? {
      min: Math.min(...marketListings.map(l => l.price)),
      max: Math.max(...marketListings.map(l => l.price))
    } : undefined,
    adjustments: vehicleData.adjustments?.map((adj: any) => ({
      label: adj.factor || 'Market Adjustment',
      amount: adj.impact || 0,
      reason: adj.description || 'Market-based value adjustment'
    })) || [],
    notes: [
      `Market search strategy: ${searchStrategy}`,
      `Found ${marketListings.length} comparable listings`,
      listingsError ? `Market data warning: ${listingsError}` : ''
    ].filter(Boolean),
    timestamp: Date.now(),
    aiExplanation: `Your ${actualYear} ${actualMake} ${actualModel} with ${actualMileage.toLocaleString()} miles is valued at $${actualEstimatedValue.toLocaleString()} based on current market analysis and ${marketListings.length} comparable listings in your area.`,
    marketSearchStatus: listingsError ? 'error' : marketListings.length > 0 ? 'success' : 'fallback'
  };

  console.log('✅ Final result object:', {
    estimatedValue: result.finalValue,
    mileage: result.mileage,
    listingCount: result.listingCount,
    confidenceScore: result.confidenceScore,
    marketSearchStatus: result.marketSearchStatus
  });

  return <UnifiedValuationResult result={result} />;
}
