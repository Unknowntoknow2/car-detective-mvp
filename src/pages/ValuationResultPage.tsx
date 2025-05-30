
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { useValuationResult } from '@/hooks/useValuationResult';
import { AIChatBubble } from '@/components/chat/AIChatBubble';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import PredictionResult from '@/components/valuation/PredictionResult';
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton';
import { AuctionInsightCard } from '@/components/valuation/AuctionInsightCard';
import { BidCarsResults } from '@/components/valuation/BidCarsResults';
import { AutoAuctionsResults } from '@/components/valuation/AutoAuctionsResults';
import { AuctionIntelligenceCard } from '@/components/valuation/AuctionIntelligenceCard';
import { AuctionResults } from '@/components/valuation/AuctionResults';
import { AuctionResult } from '@/types/auction';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

export default function ValuationResultPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const { data: valuationResult, isLoading, error } = useValuationResult(valuationId || '');
  const { user } = useUser();
  const [auctionResults, setAuctionResults] = useState<AuctionResult[]>([]);
  const [auctionAINSummary, setAuctionAINSummary] = useState<string>('');

  // Fetch auction data when valuation is loaded
  useEffect(() => {
    const fetchAuctionData = async () => {
      if (!valuationResult?.vin) return;

      try {
        const { data: auctionData, error } = await supabase
          .from('auction_results_by_vin')
          .select('*')
          .eq('vin', valuationResult.vin)
          .order('sold_date', { ascending: false });

        if (error) {
          console.error('Error fetching auction data:', error);
          return;
        }

        if (auctionData && auctionData.length > 0) {
          // Transform the data to match our AuctionResult type
          const transformedResults: AuctionResult[] = auctionData.map(item => ({
            vin: item.vin,
            price: item.price || '0',
            sold_date: item.sold_date,
            odometer: item.odometer || '0',
            condition_grade: item.condition_grade,
            location: item.location,
            auction_source: item.auction_source,
            photo_urls: item.photo_urls || [],
            fetched_at: item.fetched_at,
            source_priority: item.source_priority
          }));

          setAuctionResults(transformedResults);

          // Fetch enrichment data for AIN summary if available
          const { data: enrichmentData } = await supabase
            .from('auction_enrichment_by_vin')
            .select('data')
            .eq('vin', valuationResult.vin)
            .eq('source', 'ain_summary')
            .maybeSingle();

          if (enrichmentData?.data?.summary) {
            setAuctionAINSummary(enrichmentData.data.summary);
          }
        }
      } catch (error) {
        console.error('Error fetching auction data:', error);
      }
    };

    fetchAuctionData();
  }, [valuationResult?.vin]);

  if (isLoading) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="flex justify-center items-center min-h-[50vh]" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-lg">Loading valuation details...</span>
          </div>
        </Container>
      </MainLayout>
    );
  }

  if (error || !valuationResult) {
    return (
      <MainLayout>
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Valuation</h1>
            <p className="text-gray-600 mb-4">
              Could not load the valuation details. Please try again later.
            </p>
          </div>
        </Container>
      </MainLayout>
    );
  }

  const isPremium = valuationResult.isPremium || valuationResult.premium_unlocked;
  const isDealer = user?.userMetadata?.role === 'dealer';
  const canViewIntelligence = isPremium || isDealer;

  // Transform ValuationResult to ensure created_at is always defined for AIChatBubble
  const valuationData = {
    ...valuationResult,
    created_at: valuationResult.created_at || new Date().toISOString()
  };

  return (
    <MainLayout>
      <Container className="py-8 space-y-8">
        {/* Main Valuation Result */}
        <PredictionResult valuationId={valuationId || ''} />

        {/* Auction Results - Available to all users */}
        {valuationResult.vin && (
          <AuctionResults vin={valuationResult.vin} />
        )}

        {/* Bid.Cars Auction History */}
        {valuationResult.vin && (
          <BidCarsResults vin={valuationResult.vin} />
        )}

        {/* AutoAuctions.io Auction History */}
        {valuationResult.vin && (
          <AutoAuctionsResults vin={valuationResult.vin} />
        )}

        {/* Auction Intelligence Card - Only for Premium/Dealer users */}
        {valuationResult.vin && canViewIntelligence && (
          <AuctionIntelligenceCard vin={valuationResult.vin} />
        )}

        {/* Auction History Card - Only for Premium/Dealer users */}
        <AuctionInsightCard 
          results={auctionResults} 
          ainSummary={auctionAINSummary} 
        />

        {/* AI Chat Bubble */}
        <AIChatBubble valuation={valuationData} />

        {/* Dealer Offers */}
        <DealerOffersList reportId={valuationId || ''} />

        {/* PDF Download for Premium */}
        {isPremium && (
          <div className="flex justify-center mt-8">
            <PDFDownloadButton 
              valuationResult={valuationResult}
              isPremium={isPremium}
            />
          </div>
        )}
      </Container>
    </MainLayout>
  );
}
