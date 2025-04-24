
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { DealerOffer } from '@/types/dealer';
import { useDealerOffers } from '@/hooks/useDealerOffers';

interface DealerOffersListProps {
  reportId: string;
  showActions?: boolean;
}

export function DealerOffersList({ reportId, showActions = false }: DealerOffersListProps) {
  const { offers, isLoading, updateOfferStatus } = useDealerOffers(reportId);

  if (isLoading) {
    return <div>Loading offers...</div>;
  }

  if (!offers?.length) {
    return <div>No offers yet</div>;
  }

  const handleStatusUpdate = (offerId: string, status: 'accepted' | 'rejected') => {
    updateOfferStatus({ offerId, status });
  };

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>${offer.offer_amount.toLocaleString()}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </span>
            </CardTitle>
            <CardDescription>
              Submitted on {new Date(offer.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offer.message && (
              <p className="text-muted-foreground mb-4">{offer.message}</p>
            )}
            {showActions && offer.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusUpdate(offer.id, 'accepted')}
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(offer.id, 'rejected')}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
