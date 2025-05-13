
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { DealerOffer } from '@/hooks/useDealerOfferComparison';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';

interface DealerOfferCardProps {
  offer: DealerOffer;
  isBestOffer?: boolean;
}

export const DealerOfferCard: React.FC<DealerOfferCardProps> = ({ 
  offer, 
  isBestOffer = false 
}) => {
  return (
    <Card className={`overflow-hidden ${isBestOffer ? 'border-green-500 shadow-md' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        <div 
          className={`p-6 sm:w-1/3 ${isBestOffer ? 'bg-green-50' : 'bg-slate-50'} flex flex-col justify-between`}
        >
          <div>
            <p className="text-sm text-slate-500 mb-1">Offer Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(offer.offer_amount)}</p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {isBestOffer && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                  Best Offer
                </Badge>
              )}
              
              <OfferScoreBadge 
                label={offer.label}
                insight={offer.insight}
                score={offer.score}
                isBestOffer={isBestOffer}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <ExternalLink className="mr-2 h-3 w-3" />
              View Details
            </Button>
          </div>
        </div>
        
        <div className="p-6 sm:w-2/3">
          {offer.message ? (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-500 mb-1">Message from dealer</p>
              <p className="text-sm">{offer.message}</p>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-500 mb-1">Standard Offer</p>
              <p className="text-sm">This dealer has submitted an offer based on your vehicle details.</p>
            </div>
          )}
          
          {offer.insight && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">AI Insight</p>
              <p className="text-sm">{offer.insight}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
