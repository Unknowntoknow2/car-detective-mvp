
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import ValuationResultPremium from '@/components/valuation/result/ValuationResultPremium';
import { AIChatBubble } from '@/components/chat/AIChatBubble';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import PredictionResult from '@/components/valuation/PredictionResult';
import { EnrichedDataCard } from '@/components/enriched/EnrichedDataCard';
import { getEnrichedVehicleData, EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const { data: valuationResult, isLoading, error } = useValuationResult(valuationId);
  const [enrichedData, setEnrichedData] = useState<EnrichedVehicleData | null>(null);
  const [isLoadingEnriched, setIsLoadingEnriched] = useState(false);

  useEffect(() => {
    async function loadEnrichedData() {
      if (valuationResult?.vin) {
        setIsLoadingEnriched(true);
        try {
          const enriched = await getEnrichedVehicleData(
            valuationResult.vin,
            valuationResult.make,
            valuationResult.model,
            valuationResult.year
          );
          setEnrichedData(enriched);
        } catch (error) {
          console.error('Failed to load enriched data:', error);
        } finally {
          setIsLoadingEnriched(false);
        }
      }
    }

    loadEnrichedData();
  }, [valuationResult?.vin, valuationResult?.make, valuationResult?.model, valuationResult?.year]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading valuation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Valuation
          </h2>
          <p className="text-red-600">
            {error || "Could not load the valuation details. Please try again or contact support."}
          </p>
        </div>
      </div>
    );
  }

  if (!valuationResult) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">
            No Valuation Found
          </h2>
          <p className="text-yellow-600">
            The requested valuation could not be found. It may have been deleted or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Main Valuation Result */}
      <PredictionResult valuationId={valuationId} />
      
      {/* Enriched Data Section */}
      {enrichedData && (
        <EnrichedDataCard data={enrichedData} />
      )}
      
      {isLoadingEnriched && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
          <span className="text-sm text-muted-foreground">Loading market data...</span>
        </div>
      )}

      {/* AI Chat Bubble */}
      {valuationResult && (
        <AIChatBubble valuation={valuationResult} />
      )}

      {/* Dealer Offers */}
      {valuationId && (
        <DealerOffersList reportId={valuationId} />
      )}
    </div>
  );
}
