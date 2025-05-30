import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, TrendingUp, Clock, MessageSquare, DollarSign, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useDealerOfferActions } from '@/hooks/useDealerOfferActions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { scoreDealerOffers, ScoredOffer, getBestOffer } from '@/utils/ain/scoreDealerOffers';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';
import { OfferAcceptanceModal } from '@/components/dealer/OfferAcceptanceModal';
import { AcceptedOfferCard } from '@/components/dealer/AcceptedOfferCard';
import { MarketplaceComparisonCard } from './MarketplaceComparisonCard';
import { useMarketplaceComparison } from '@/hooks/useMarketplaceComparison';

interface DealerOffersSectionProps {
  valuationId: string;
  estimatedValue: number;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
}

export function DealerOffersSection({ 
  valuationId, 
  estimatedValue, 
  vin, 
  make, 
  model, 
  year, 
  zipCode 
}: DealerOffersSectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<ScoredOffer | null>(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [acceptedOffers, setAcceptedOffers] = useState<any[]>([]);

  const { offers, isLoading: offersLoading, refetch } = useDealerOffers(valuationId);
  const { acceptOffer, isProcessing } = useDealerOfferActions();

  // Add marketplace comparison hook
  const { 
    listings: marketplaceListings, 
    isLoading: marketplaceLoading, 
    ainRecommendation,
    marketStats 
  } = useMarketplaceComparison({
    vin,
    make,
    model,
    year,
    zipCode,
    estimatedValue
  });

  const { data: acceptedOffersData = [], refetch: refetchAccepted } = useQuery({
    queryKey: ['accepted-offers', valuationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accepted_offers')
        .select(`
          *,
          dealer_offers (
            id,
            offer_amount,
            message
          )
        `)
        .eq('valuation_id', valuationId)
        .order('accepted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!valuationId,
  });

  useEffect(() => {
    setAcceptedOffers(acceptedOffersData);
  }, [acceptedOffersData]);

  const scoredOffers = scoreDealerOffers({
    valuationPrice: estimatedValue,
    offers: offers.filter(offer => offer.status !== 'accepted'),
    userZip: zipCode
  });

  const bestOffer = getBestOffer(scoredOffers);

  const handleAcceptOffer = (offer: ScoredOffer) => {
    setSelectedOffer(offer);
    setShowAcceptanceModal(true);
  };

  const handleConfirmAcceptance = async () => {
    if (!selectedOffer) return;

    const result = await acceptOffer({
      offerId: selectedOffer.id,
      offerAmount: selectedOffer.offer_amount,
      valuationId,
      dealerId: selectedOffer.dealer_id
    });

    if (result.success) {
      setShowAcceptanceModal(false);
      setSelectedOffer(null);
      refetch();
      refetchAccepted();
    }
  };

  if (offersLoading || marketplaceLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading offers and marketplace data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Marketplace Comparison Card */}
      <MarketplaceComparisonCard
        listings={marketplaceListings}
        dealerOffers={offers}
        estimatedValue={estimatedValue}
        ainRecommendation={ainRecommendation}
      />

      {/* Accepted Offers Section */}
      {acceptedOffers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Accepted Offers</h3>
          {acceptedOffers.map((acceptedOffer) => (
            <AcceptedOfferCard
              key={acceptedOffer.id}
              acceptedOffer={acceptedOffer}
              offer={acceptedOffer.dealer_offers}
              onCancelled={() => refetchAccepted()}
            />
          ))}
        </div>
      )}

      {/* Dealer Offers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Dealer Offers
            {scoredOffers.length > 0 && (
              <Badge variant="secondary">
                {scoredOffers.length} offer{scoredOffers.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scoredOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No dealer offers yet</p>
              <p className="text-sm">Dealers will see your valuation and can submit offers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scoredOffers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <OfferScoreBadge
                        score={offer.score}
                        recommendation={offer.recommendation}
                        isBestOffer={bestOffer?.id === offer.id}
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${offer.offer_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">{offer.summary}</p>
                  </div>

                  {offer.message && (
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Dealer Message:</p>
                      <p className="text-sm text-gray-600">{offer.message}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAcceptOffer(offer)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept Offer
                    </Button>
                    <Button variant="outline" disabled={isProcessing}>
                      Contact Dealer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offer Acceptance Modal */}
      <OfferAcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={() => {
          setShowAcceptanceModal(false);
          setSelectedOffer(null);
        }}
        onConfirm={handleConfirmAcceptance}
        offer={selectedOffer || { id: '', offer_amount: 0 }}
        isProcessing={isProcessing}
      />
    </div>
  );
}
