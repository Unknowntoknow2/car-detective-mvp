
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { DealerOffer } from '@/types/dealer';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface DealerOffersListProps {
  reportId: string;
  showActions?: boolean;
}

export function DealerOffersList({ reportId, showActions = false }: DealerOffersListProps) {
  const { offers, isLoading, updateOfferStatus } = useDealerOffers(reportId);
  const { user } = useAuth();

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading offers...</div>;
  }

  if (!offers?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No offers have been submitted yet
      </div>
    );
  }

  const handleStatusUpdate = (offerId: string, status: 'accepted' | 'rejected') => {
    updateOfferStatus({ offerId, status });
  };

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">
                ${Number(offer.offer_amount).toLocaleString()}
              </CardTitle>
              <Badge 
                className={
                  offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                  offer.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                  'bg-red-100 text-red-800 hover:bg-red-100'
                }
              >
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Submitted on {new Date(offer.created_at).toLocaleDateString()}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {offer.message && (
              <div className="mb-4 p-3 bg-muted/50 rounded-md flex gap-2">
                <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm">{offer.message}</p>
              </div>
            )}
            
            {showActions && offer.status === 'pending' && user?.id === offer.user_id && (
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleStatusUpdate(offer.id, 'accepted')}
                  variant="outline"
                  className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(offer.id, 'rejected')}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
