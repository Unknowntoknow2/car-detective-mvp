
import React from 'react';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DealerOffersListProps {
  reportId: string;
  showActions?: boolean;
}

export function DealerOffersList({ reportId, showActions = false }: DealerOffersListProps) {
  const { offers, isLoading, updateOfferStatus } = useDealerOffers(reportId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading offers...</p>
      </div>
    );
  }
  
  if (!offers || offers.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No offers have been made yet.</p>
      </div>
    );
  }
  
  const handleAcceptOffer = (offerId: string) => {
    updateOfferStatus({ offerId, status: 'accepted' });
  };
  
  const handleRejectOffer = (offerId: string) => {
    updateOfferStatus({ offerId, status: 'rejected' });
  };
  
  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">${offer.offer_price.toLocaleString()}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                  offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                Received {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
              </p>
              
              {offer.notes && (
                <div className="bg-muted p-3 rounded-md mb-3">
                  <p className="text-sm">{offer.notes}</p>
                </div>
              )}
              
              {showActions && offer.status === 'sent' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleRejectOffer(offer.id)}
                  >
                    <X className="h-4 w-4 mr-2" /> Decline
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleAcceptOffer(offer.id)}
                  >
                    <Check className="h-4 w-4 mr-2" /> Accept
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
