
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AcceptedOfferCard } from '@/components/dealer/AcceptedOfferCard';
import { useDealerOfferComparison } from '@/hooks/useDealerOfferComparison';

interface DealerOffersSectionProps {
  reportId?: string;
}

export const DealerOffersSection: React.FC<DealerOffersSectionProps> = ({ reportId }) => {
  const { offers, isLoading, getBestOffer } = useDealerOfferComparison(reportId);
  
  const bestOffer = getBestOffer();
  
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

  const handleOfferCancelled = async () => {
    // Mock implementation
    return Promise.resolve();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dealer Offers</CardTitle>
      </CardHeader>
      <CardContent>
        {bestOffer && bestOffer.status === 'accepted' ? (
          <AcceptedOfferCard
            key={bestOffer.id}
            offer={bestOffer}
            onCancelled={handleOfferCancelled}
          />
        ) : (
          <p>No accepted offers found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DealerOffersSection;
