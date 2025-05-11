
import React from 'react';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface OfferTrackerProps {
  dealerId: string;
}

export function DealerOffersTracker({ dealerId }: OfferTrackerProps) {
  // We pass undefined to get all offers for the current dealer
  const { offers, isLoading } = useDealerOffers();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading offers...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!offers || offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You haven't made any offers yet. Reply to leads to start making offers.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group offers by status
  const sentOffers = offers.filter(offer => offer.status === 'sent');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');
  const rejectedOffers = offers.filter(offer => offer.status === 'rejected');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{sentOffers.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{acceptedOffers.length}</p>
            <p className="text-sm text-muted-foreground">Accepted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{rejectedOffers.length}</p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </div>
        </div>
        
        <h3 className="font-semibold mb-2">Recent Offers</h3>
        <div className="space-y-2">
          {offers.slice(0, 5).map(offer => (
            <div key={offer.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <p className="font-medium">${offer.offer_price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                </p>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                  offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
