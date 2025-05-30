
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDealerOfferComparison } from '@/hooks/useDealerOfferComparison';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';
import { useDealerOfferActions } from '@/hooks/useDealerOfferActions';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, MessageSquare, TrendingUp, Users, CheckCircle, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { scoreDealerOffers, getOfferInsights } from '@/utils/ain/scoreDealerOffers';

interface DealerOffersSectionProps {
  valuationId: string;
  estimatedValue?: number;
}

export function DealerOffersSection({ valuationId, estimatedValue }: DealerOffersSectionProps) {
  const { offers, isLoading } = useDealerOfferComparison(valuationId);
  const { acceptOffer, rejectOffer, isProcessing } = useDealerOfferActions();
  
  // Apply AIN scoring to offers
  const scoredOffers = estimatedValue ? scoreDealerOffers({
    valuationPrice: estimatedValue,
    offers: offers.map(offer => ({
      id: offer.id,
      offer_amount: offer.offer_amount,
      message: offer.message,
      dealer_id: offer.dealer_id,
      created_at: offer.created_at
    })),
    userZip: undefined // Could be passed from parent component if available
  }) : [];

  const insights = estimatedValue ? getOfferInsights(scoredOffers, estimatedValue) : null;
  const bestOffer = insights?.bestOffer;

  const handleAcceptOffer = async (offerId: string, offerAmount: number) => {
    await acceptOffer({
      offerId,
      offerAmount,
      // Note: In a real implementation, you'd get these from user context or the offer data
      // dealerEmail: 'dealer@example.com',
      // userEmail: 'user@example.com',
      // vin: 'SAMPLE-VIN'
    });
  };

  const handleRejectOffer = async (offerId: string) => {
    await rejectOffer(offerId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dealer Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dealer Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No dealer offers yet. Dealers will be notified about your valuation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Dealer Offers ({offers.length})
          {bestOffer && bestOffer.recommendation === 'excellent' && (
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Excellent Deal Available
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* AIN Insights Summary */}
        {insights && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">🧠 AIN Market Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Best Offer:</span>
                <div className="text-blue-900">${insights.bestOffer?.offer_amount.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Average Offer:</span>
                <div className="text-blue-900">${insights.averageOffer.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Your Valuation:</span>
                <div className="text-blue-900">${insights.valuationPrice.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Market Position:</span>
                <div className="text-blue-900 capitalize">{insights.marketPosition?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {scoredOffers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`p-4 rounded-lg border ${
                offer.id === bestOffer?.id && offer.recommendation === 'excellent'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    ${offer.offer_amount.toLocaleString()}
                  </span>
                  <OfferScoreBadge 
                    score={offer.score}
                    recommendation={offer.recommendation}
                    isBestOffer={offer.id === bestOffer?.id}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>

              {/* AIN Summary */}
              <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                <strong>AIN Analysis:</strong> {offer.summary}
              </div>
              
              {offer.message && (
                <div className="mb-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-sm text-gray-700">{offer.message}</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Submitted {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                </span>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectOffer(offer.id)}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptOffer(offer.id, offer.offer_amount)}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept Offer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {estimatedValue && offers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p>Estimated Value: ${estimatedValue.toLocaleString()}</p>
              <p>Best Offer: ${Math.max(...offers.map(o => o.offer_amount)).toLocaleString()}</p>
              <p>Average Offer: ${Math.round(offers.reduce((sum, o) => sum + o.offer_amount, 0) / offers.length).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
