
import React from 'react';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, DollarSign, Clock, AlertCircle, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OfferScoreBadge } from './OfferScoreBadge';

interface DealerOffersListProps {
  reportId: string;
  showActions?: boolean;
}

export function DealerOffersList({ reportId, showActions = false }: DealerOffersListProps) {
  const { offers, isLoading, updateOfferStatus, getBestOffer } = useDealerOffers(reportId);
  
  const bestOffer = getBestOffer();
  
  const handleAcceptOffer = (offerId: string) => {
    if (confirm('Are you sure you want to accept this offer?')) {
      updateOfferStatus({ offerId, status: 'accepted' });
    }
  };
  
  const handleRejectOffer = (offerId: string) => {
    if (confirm('Are you sure you want to reject this offer?')) {
      updateOfferStatus({ offerId, status: 'rejected' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (offers.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No offers yet. When dealers make offers, they will appear here.</p>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {offers.map((offer) => (
        <Card 
          key={offer.id} 
          className={
            offer.id === bestOffer?.id && offer.score && offer.score > 80
              ? "overflow-hidden border-green-300 bg-green-50"
              : "overflow-hidden"
          }
        >
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">Dealer Offer</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold">${offer.offer_amount.toLocaleString()}</span>
                <div className="ml-4 flex">
                  {getStatusBadge(offer.status)}
                  <OfferScoreBadge 
                    label={offer.label} 
                    insight={offer.insight} 
                    score={offer.score} 
                    isBestOffer={offer.id === bestOffer?.id}
                  />
                </div>
              </div>
              
              {offer.message && (
                <div className="bg-slate-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-slate-500 mr-2 mt-1" />
                    <p className="text-sm text-slate-700">{offer.message}</p>
                  </div>
                </div>
              )}
              
              {offer.insight && (
                <div className="flex items-start text-sm text-slate-600">
                  <AlertCircle className="h-4 w-4 text-slate-500 mr-2 mt-0.5" />
                  <p>{offer.insight}</p>
                </div>
              )}
              
              {showActions && offer.status === 'sent' && (
                <div className="flex space-x-3 mt-4">
                  <Button 
                    onClick={() => handleAcceptOffer(offer.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Accept Offer
                  </Button>
                  <Button 
                    onClick={() => handleRejectOffer(offer.id)}
                    variant="outline"
                    className="w-full"
                  >
                    Decline
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
