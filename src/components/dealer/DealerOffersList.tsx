
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealerOfferCard } from '@/components/valuation/offers/DealerOfferCard';
import { useDealerOfferComparison } from '@/hooks/useDealerOfferComparison';

export interface DealerOffersListProps {
  reportId?: string;
  showActions?: boolean;
}

export const DealerOffersList: React.FC<DealerOffersListProps> = ({
  reportId,
  showActions = false,
}) => {
  const { offers, isLoading, error } = useDealerOfferComparison(reportId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading offers...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading offers: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!offers?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No offers available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dealer Offers ({offers.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.map((offer, index) => (
          <DealerOfferCard
            key={offer.id}
            offer={offer}
            isBestOffer={index === 0}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default DealerOffersList;
