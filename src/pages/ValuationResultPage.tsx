
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import { useUserRole } from '@/hooks/useUserRole';
import { AIChatBubble } from '@/components/chat/AIChatBubble';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import PredictionResult from '@/components/valuation/PredictionResult';
import { EnrichedDataCard } from '@/components/enriched/EnrichedDataCard';
import { PremiumEnrichmentGate } from '@/components/enriched/PremiumEnrichmentGate';
import { getEnrichedVehicleData, type EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
import PDFDownloadButton from '@/components/common/PDFDownloadButton';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const { data: valuationResult, isLoading, error } = useValuationResult(valuationId || '');
  const { userRole, hasPermiumAccess, isLoading: roleLoading } = useUserRole();
  const [enrichedData, setEnrichedData] = useState<EnrichedVehicleData | null>(null);
  const [isLoadingEnriched, setIsLoadingEnriched] = useState(false);

  const refreshEnrichedData = async () => {
    if (!valuationResult?.vin || !hasPermiumAccess) return;
    
    setIsLoadingEnriched(true);
    try {
      const enriched = await getEnrichedVehicleData(
        valuationResult.vin,
        valuationResult.make || undefined,
        valuationResult.model || undefined,
        valuationResult.year || undefined
      );
      setEnrichedData(enriched);
    } catch (error) {
      console.error('Failed to refresh enriched data:', error);
    } finally {
      setIsLoadingEnriched(false);
    }
  };

  useEffect(() => {
    async function loadEnrichedData() {
      if (
        valuationResult?.vin && 
        typeof valuationResult.vin === 'string' && 
        valuationResult.make && 
        typeof valuationResult.make === 'string' &&
        valuationResult.model && 
        typeof valuationResult.model === 'string' &&
        valuationResult.year && 
        typeof valuationResult.year === 'number' &&
        !roleLoading // Wait for role to load
      ) {
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
  }, [valuationResult?.vin, valuationResult?.make, valuationResult?.model, valuationResult?.year, roleLoading]);

  if (isLoading || roleLoading) {
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
            {typeof error === 'string' ? error : "Could not load the valuation details. Please try again or contact support."}
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
      <PredictionResult valuationId={valuationId || ''} />
      
      {/* Premium PDF Download */}
      {hasPermiumAccess && (
        <div className="flex justify-center">
          <PDFDownloadButton 
            valuationResult={valuationResult}
            enrichedData={enrichedData}
            isPremium={hasPermiumAccess}
          />
        </div>
      )}
      
      {/* Enriched Data Section - Role-based display */}
      {hasPermiumAccess ? (
        // Premium users see full enriched data
        enrichedData && enrichedData.sources.statVin ? (
          <EnrichedDataCard 
            data={enrichedData} 
            userRole={(userRole as "individual" | "dealer" | "admin") || 'individual'}
            onRefresh={refreshEnrichedData}
            isRefreshing={isLoadingEnriched}
            lastUpdated={enrichedData.lastUpdated}
          />
        ) : isLoadingEnriched ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">Loading market intelligence...</span>
          </div>
        ) : null
      ) : (
        // Free users see upgrade prompt
        <PremiumEnrichmentGate 
          vin={valuationResult.vin || undefined}
          valuationId={valuationId}
        />
      )}

      {/* AI Chat Bubble with enriched context */}
      {valuationResult && (
        <AIChatBubble 
          valuation={{
            ...valuationResult,
            created_at: valuationResult.created_at || new Date().toISOString()
          }}
          enrichedData={hasPermiumAccess ? enrichedData : null}
        />
      )}

      {/* Dealer Offers */}
      {valuationId && (
        <DealerOffersList reportId={valuationId} />
      )}
    </div>
  );
}
