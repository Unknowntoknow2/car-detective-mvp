
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';
import { OfferAcceptanceModal } from '@/components/dealer/OfferAcceptanceModal';
import { AcceptedOfferCard } from '@/components/dealer/AcceptedOfferCard';
import { useDealerOfferActions } from '@/hooks/useDealerOfferActions';
import { scoreDealerOffers, getBestOffer, getOfferInsights, type ScoredOffer } from '@/utils/ain/scoreDealerOffers';
import { useAuth } from '@/contexts/AuthContext';

interface DealerOffersSectionProps {
  valuationId: string;
  estimatedValue: number;
}

interface AcceptedOffer {
  id: string;
  accepted_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface DealerOfferWithAcceptance extends ScoredOffer {
  acceptedOffer?: AcceptedOffer;
}

export function DealerOffersSection({ valuationId, estimatedValue }: DealerOffersSectionProps) {
  const { user } = useAuth();
  const [selectedOffer, setSelectedOffer] = useState<ScoredOffer | null>(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const { acceptOffer, rejectOffer, isProcessing } = useDealerOfferActions();

  // Fetch dealer offers for this valuation
  const { data: rawOffers = [], isLoading, refetch } = useQuery({
    queryKey: ['dealer-offers', valuationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .select(`
          *,
          dealers:dealer_id (
            business_name,
            contact_name,
            email
          )
        `)
        .eq('report_id', valuationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!valuationId,
    refetchInterval: 30000,
  });

  // Fetch accepted offers for this valuation
  const { data: acceptedOffers = [] } = useQuery({
    queryKey: ['accepted-offers', valuationId],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('accepted_offers')
        .select('*')
        .eq('valuation_id', valuationId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!valuationId && !!user,
  });

  // Score the offers using AIN
  const scoredOffers = scoreDealerOffers({
    valuationPrice: estimatedValue,
    offers: rawOffers,
  });

  // Combine offers with acceptance status
  const offersWithAcceptance: DealerOfferWithAcceptance[] = scoredOffers.map(offer => {
    const acceptedOffer = acceptedOffers.find(ao => ao.dealer_offer_id === offer.id);
    return {
      ...offer,
      acceptedOffer
    };
  });

  const bestOffer = getBestOffer(scoredOffers);
  const insights = getOfferInsights(scoredOffers, estimatedValue);

  const handleAcceptOffer = async (offer: ScoredOffer) => {
    setSelectedOffer(offer);
    setShowAcceptanceModal(true);
  };

  const handleConfirmAcceptance = async () => {
    if (!selectedOffer || !user) return;

    const dealerInfo = rawOffers.find(o => o.id === selectedOffer.id)?.dealers;
    
    const result = await acceptOffer({
      offerId: selectedOffer.id,
      offerAmount: selectedOffer.offer_amount,
      dealerEmail: dealerInfo?.email,
      userEmail: user.email,
      vin: '', // You might want to pass this from the parent component
      valuationId,
      dealerId: selectedOffer.dealer_id,
    });

    if (result.success) {
      setShowAcceptanceModal(false);
      setSelectedOffer(null);
      refetch();
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    await rejectOffer(offerId);
    refetch();
  };

  const handleCancelAcceptance = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dealer Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const acceptedOffersList = offersWithAcceptance.filter(offer => offer.acceptedOffer);
  const availableOffers = offersWithAcceptance.filter(offer => 
    !offer.acceptedOffer && offer.status !== 'rejected'
  );

  return (
    <div className="space-y-6">
      {/* Accepted Offers Section */}
      {acceptedOffersList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800">Accepted Offers</h3>
          {acceptedOffersList.map((offer) => (
            <AcceptedOfferCard
              key={offer.id}
              acceptedOffer={offer.acceptedOffer!}
              offer={offer}
              onCancelled={handleCancelAcceptance}
            />
          ))}
        </div>
      )}

      {/* Available Offers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dealer Offers ({availableOffers.length})
          </CardTitle>
          {insights && (
            <div className="text-sm text-slate-600">
              {insights.totalOffers} total offers • Best offer: ${insights.bestOffer?.offer_amount.toLocaleString()}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {availableOffers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Offers Yet</h3>
              <p className="text-slate-500">
                Dealers will submit offers for your vehicle. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOffers.map((offer) => {
                const dealerInfo = rawOffers.find(o => o.id === offer.id)?.dealers;
                const isRejected = offer.status === 'rejected';
                
                return (
                  <div
                    key={offer.id}
                    className={`border rounded-lg p-4 ${
                      offer.id === bestOffer?.id ? 'border-green-300 bg-green-50' : 'border-slate-200'
                    } ${isRejected ? 'opacity-50 bg-red-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">
                            ${offer.offer_amount.toLocaleString()}
                          </h4>
                          <OfferScoreBadge
                            score={offer.score}
                            recommendation={offer.recommendation}
                            isBestOffer={offer.id === bestOffer?.id}
                          />
                          {isRejected && (
                            <Badge variant="destructive">Rejected</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {dealerInfo?.business_name || 'Dealer'} • {dealerInfo?.contact_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {new Date(offer.created_at).toLocaleDateString()}
                        </div>
                        {offer.id === bestOffer?.id && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 mt-1">
                            Best Offer
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-slate-700">{offer.summary}</p>
                    </div>

                    {offer.message && (
                      <div className="bg-slate-50 p-3 rounded mb-3">
                        <p className="text-sm text-slate-700">{offer.message}</p>
                      </div>
                    )}

                    {!isRejected && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptOffer(offer)}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Offer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRejectOffer(offer.id)}
                          disabled={isProcessing}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acceptance Modal */}
      <OfferAcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={() => setShowAcceptanceModal(false)}
        onConfirm={handleConfirmAcceptance}
        offer={selectedOffer!}
        isProcessing={isProcessing}
      />
    </div>
  );
}
