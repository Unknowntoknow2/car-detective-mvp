
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';

export interface AcceptedOfferCardProps {
  offer: any;
  onCancelled: () => Promise<any>;
}

export const AcceptedOfferCard: React.FC<AcceptedOfferCardProps> = ({
  offer,
  onCancelled,
}) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Accepted
          </Badge>
          Dealer Offer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(offer.offer_amount)}
            </p>
            <p className="text-sm text-green-700">
              Offer accepted on {new Date(offer.accepted_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
          
          {offer.message && (
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Message from dealer:</p>
              <p className="text-sm text-green-600">{offer.message}</p>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelled}
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            Contact Dealer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcceptedOfferCard;
