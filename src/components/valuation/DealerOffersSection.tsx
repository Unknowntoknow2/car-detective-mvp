
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDealerOfferComparison } from '@/hooks/useDealerOfferComparison';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DealerOffersSectionProps {
  valuationId: string;
  estimatedValue?: number;
}

export function DealerOffersSection({ valuationId, estimatedValue }: DealerOffersSectionProps) {
  const { offers, isLoading, getBestOffer } = useDealerOfferComparison(valuationId);
  
  const bestOffer = getBestOffer();

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
          {bestOffer && bestOffer.score && bestOffer.score > 80 && (
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Great Deal Available
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`p-4 rounded-lg border ${
                offer.id === bestOffer?.id && offer.score && offer.score > 80
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    ${offer.offer_amount.toLocaleString()}
                  </span>
                  <OfferScoreBadge 
                    label={offer.label} 
                    insight={offer.insight} 
                    score={offer.score}
                    isBestOffer={offer.id === bestOffer?.id}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
              
              {offer.message && (
                <div className="mb-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-sm text-gray-700">{offer.message}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Submitted {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                </span>
                <Badge 
                  variant="outline" 
                  className={
                    offer.status === 'accepted' 
                      ? 'border-green-200 text-green-800' 
                      : offer.status === 'rejected'
                      ? 'border-red-200 text-red-800'
                      : 'border-gray-200 text-gray-600'
                  }
                >
                  {offer.status}
                </Badge>
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
