
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, DollarSign, Clock, TrendingUp, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useDealerOfferActions } from '@/hooks/useDealerOfferActions';
import { scoreDealerOffers, getBestOffer } from '@/utils/ain/scoreDealerOffers';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';
import { OfferAcceptanceModal } from '@/components/dealer/OfferAcceptanceModal';
import { AcceptedOfferCard } from '@/components/dealer/AcceptedOfferCard';

interface DealerOffersSectionProps {
  valuationId: string;
  estimatedValue: number;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    vin?: string;
  };
}

export function DealerOffersSection({ 
  valuationId, 
  estimatedValue, 
  vehicleInfo 
}: DealerOffersSectionProps) {
  const { offers, isLoading, refetch } = useDealerOffers(valuationId);
  const { acceptOffer, isProcessing } = useDealerOfferActions();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptedOffers, setAcceptedOffers] = useState<any[]>([]);

  // Score the offers using AIN
  const scoredOffers = React.useMemo(() => {
    if (!offers.length) return [];
    
    return scoreDealerOffers({
      valuationPrice: estimatedValue,
      offers: offers.map(offer => ({
        id: offer.id,
        offer_amount: offer.offer_amount,
        message: offer.message,
        dealer_id: offer.dealer_id,
        status: offer.status,
        created_at: offer.created_at
      })),
      userZip: vehicleInfo?.vin?.substring(0, 5) || ''
    });
  }, [offers, estimatedValue, vehicleInfo?.vin]);

  const bestOffer = getBestOffer(scoredOffers);

  const handleAcceptOffer = (offer: any) => {
    setSelectedOffer(offer);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOffer) return;

    const result = await acceptOffer({
      offerId: selectedOffer.id,
      offerAmount: selectedOffer.offer_amount,
      valuationId,
      dealerId: selectedOffer.dealer_id,
      vin: vehicleInfo?.vin
    });

    if (result.success) {
      setShowAcceptModal(false);
      setSelectedOffer(null);
      refetch();
      
      // Add to accepted offers list
      if (result.acceptedOffer) {
        setAcceptedOffers(prev => [...prev, {
          ...result.acceptedOffer,
          offer: selectedOffer
        }]);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Dealer Offers
          {offers.length > 0 && (
            <Badge variant="secondary">{offers.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show accepted offers first */}
        {acceptedOffers.map((acceptedOffer) => (
          <div key={acceptedOffer.id} className="mb-4">
            <AcceptedOfferCard
              acceptedOffer={acceptedOffer}
              offer={acceptedOffer.offer}
              onCancelled={() => {
                setAcceptedOffers(prev => prev.filter(o => o.id !== acceptedOffer.id));
                refetch();
              }}
            />
          </div>
        ))}

        {scoredOffers.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">No offers yet</p>
            <p className="text-sm text-slate-500">
              When dealers make offers on your vehicle, they will appear here with AI-powered insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scoredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`p-4 border rounded-lg ${
                  offer.id === bestOffer?.id ? 'border-green-300 bg-green-50' : 'border-slate-200'
                } ${offer.status === 'accepted' ? 'opacity-75' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">Dealer Offer</span>
                    {offer.id === bestOffer?.id && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Best Offer
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${offer.offer_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(offer.status)}
                    <OfferScoreBadge
                      score={offer.score}
                      recommendation={offer.recommendation}
                      isBestOffer={offer.id === bestOffer?.id}
                    />
                  </div>
                </div>

                {offer.summary && (
                  <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800 font-medium">{offer.summary}</p>
                    </div>
                  </div>
                )}

                {offer.message && (
                  <div className="mb-3 p-3 bg-slate-50 rounded border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Message from dealer:</p>
                        <p className="text-sm text-slate-600">{offer.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {offer.status === 'sent' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptOffer(offer)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Accept Offer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isProcessing}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <OfferAcceptanceModal
          isOpen={showAcceptModal}
          onClose={() => setShowAcceptModal(false)}
          onConfirm={handleConfirmAccept}
          offer={selectedOffer}
          vehicleInfo={vehicleInfo}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
}
