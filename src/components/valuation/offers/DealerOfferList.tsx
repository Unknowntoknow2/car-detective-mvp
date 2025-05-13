
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, Store } from 'lucide-react';
import { useDealerOfferComparison } from '@/hooks/useDealerOfferComparison';
import { DealerOfferCard } from './DealerOfferCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DealerOfferListProps {
  valuationId?: string;
}

export const DealerOfferList: React.FC<DealerOfferListProps> = ({ valuationId }) => {
  const { offers, isLoading, error, getBestOffer } = useDealerOfferComparison(valuationId);
  
  const bestOffer = getBestOffer();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
          <CardDescription>Loading available offers...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dealer offers. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (offers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dealer Offers</CardTitle>
          <CardDescription>Competitive offers from our network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <Store className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-1">No offers yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Dealers are reviewing your vehicle details. Offers typically arrive within 24-48 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dealer Offers</CardTitle>
        <CardDescription>
          {offers.length === 1 
            ? "1 offer available" 
            : `${offers.length} offers available`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {offers.map((offer) => (
            <DealerOfferCard
              key={offer.id}
              offer={offer}
              isBestOffer={bestOffer?.id === offer.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
