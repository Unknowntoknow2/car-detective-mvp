
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DealerOffersProps {
  offers?: any[];
}

const DealerOffers: React.FC<DealerOffersProps> = ({ offers }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dealer Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {offers.length} dealer offers available
        </p>
      </CardContent>
    </Card>
  );
};

export default DealerOffers;
